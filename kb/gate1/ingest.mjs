// Preview KB ingestion and activation, called only from an authenticated admin route.
// All 19 entries must be reviewed and hashes verified before any write.
import {canonical,digest} from './retrieval.mjs';
const KB='ETALON-4322', DIM=1024;
function assert(ok,code){if(!ok)throw Error(code);}
async function embedding(env,text){
 const result=await env.AI.run(env.KB_EMBED_MODEL,{text:[text]});
 const vector=result?.data?.[0];
 assert(Array.isArray(vector)&&vector.length===DIM&&vector.every(Number.isFinite),'EMBEDDING_INVALID');
 return vector;
}
export async function stage({env,manifest,documents,manifestSha}){
 assert(env?.KB_DB?.prepare&&env?.KB_R2?.put&&env?.KB_VECTOR?.upsert&&env?.AI?.run,'KB_NOT_CONFIGURED');
 assert(manifest?.kb_id===KB&&manifest?.index_version&&manifest?.kb_version&&manifest?.entries?.length===19,'INVALID_MANIFEST');
 assert(manifest.embedding_model==='bge-m3'&&env.KB_EMBED_MODEL==='@cf/baai/bge-m3','EMBEDDING_MODEL_MISMATCH');
 assert(Array.isArray(documents)&&documents.length===19,'INVALID_DOCUMENTS');
 const byKey=new Map(documents.map(d=>[d.key,d.content]));
 assert(byKey.size===19,'DUPLICATE_DOCUMENT');
 const rows=[],vectors=[],fts=[];
 for(const entry of manifest.entries){
  const doc=byKey.get(entry.r2_key);
  assert(doc&&typeof doc==='object'&&doc.review_status==='APPROVED','NOT_APPROVED');
  assert(entry.language==='ro'&&entry.jurisdiction==='RO'&&entry.fragment_revision===1,'INVALID_METADATA');
  assert(typeof doc.text==='string'&&doc.text.trim()&&doc.text.length<=6000,'INVALID_TEXT');
  assert(await digest(canonical(doc))===entry.content_sha256,'CONTENT_HASH_MISMATCH');
  assert(await digest(doc.embedding_text??doc.text)===entry.embedding_input_sha256,'EMBEDDING_HASH_MISMATCH');
  const vector=await embedding(env,doc.embedding_text??doc.text);
  rows.push({entry,doc});
  vectors.push({id:entry.vector_id,values:vector,metadata:{kb_id:KB,index_version:manifest.index_version,fragment_id:entry.fragment_id}});
  fts.push(doc.text);
 }
 // Fail closed: no active pointer changes during staging.
 const db=env.KB_DB;
 const existing=await db.prepare('SELECT state,manifest_sha256 FROM kb_generations WHERE kb_id=? AND index_version=?').bind(KB,manifest.index_version).first();
 assert(!existing||existing.state!=='ACTIVE','GENERATION_ALREADY_ACTIVE');
 assert(!existing||existing.manifest_sha256===manifestSha,'GENERATION_HASH_CONFLICT');
 await db.prepare("INSERT OR IGNORE INTO kb_generations(kb_id,index_version,kb_version,schema_version,manifest_sha256,state) VALUES(?,?,?,?,?,'DRAFT')").bind(KB,manifest.index_version,manifest.kb_version,manifest.schema_version,manifestSha).run();
 await db.prepare("UPDATE kb_generations SET state='INDEXING' WHERE kb_id=? AND index_version=?").bind(KB,manifest.index_version).run();
 for(const {entry,doc} of rows){
  // R2 is written first; D1 will only reference an uploaded object.
  await env.KB_R2.put(entry.r2_key,canonical(doc),{httpMetadata:{contentType:'application/json'}});
  await db.prepare("INSERT OR REPLACE INTO kb_fragments(kb_id,index_version,fragment_id,fragment_revision,artifact_id,r2_key,content_sha256,embedding_input_sha256,vector_id,language,jurisdiction,review_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,'APPROVED')").bind(KB,manifest.index_version,entry.fragment_id,entry.fragment_revision,entry.artifact_id,entry.r2_key,entry.content_sha256,entry.embedding_input_sha256,entry.vector_id,entry.language,entry.jurisdiction).run();
  await db.prepare("DELETE FROM kb_fragment_fts WHERE kb_id=? AND index_version=? AND fragment_id=?").bind(KB,manifest.index_version,entry.fragment_id).run();
  await db.prepare("INSERT INTO kb_fragment_fts(kb_id,index_version,fragment_id,body) VALUES(?,?,?,?)").bind(KB,manifest.index_version,entry.fragment_id,doc.text).run();
 }
 // Vectorize upsert is asynchronous; READY does not imply tested or activated.
 for(let i=0;i<vectors.length;i+=5)await env.KB_VECTOR.upsert(vectors.slice(i,i+5));
 await db.prepare("UPDATE kb_generations SET state='READY',verified_at=datetime('now') WHERE kb_id=? AND index_version=?").bind(KB,manifest.index_version).run();
 return {kb_id:KB,index_version:manifest.index_version,staged:rows.length,state:'READY',active:false};
}
export async function activate({env,indexVersion,expectedCount=19}){
 const db=env?.KB_DB;
 assert(db?.prepare&&env?.KB_R2?.get&&env?.KB_VECTOR?.query,'KB_NOT_CONFIGURED');
 const generation=await db.prepare('SELECT state FROM kb_generations WHERE kb_id=? AND index_version=?').bind(KB,indexVersion).first();
 assert(generation?.state==='TESTED','GENERATION_NOT_TESTED');
 const count=await db.prepare("SELECT COUNT(*) AS n FROM kb_fragments WHERE kb_id=? AND index_version=? AND review_status='APPROVED'").bind(KB,indexVersion).first();
 assert(Number(count?.n)===expectedCount,'FRAGMENT_COUNT_MISMATCH');
 const fts=await db.prepare('SELECT COUNT(*) AS n FROM kb_fragment_fts WHERE kb_id=? AND index_version=?').bind(KB,indexVersion).first();
 assert(Number(fts?.n)===expectedCount,'FTS_COUNT_MISMATCH');
 // Pointer flip is the last operation; existing active version remains available on failure.
 await db.batch([
  db.prepare("UPDATE kb_generations SET state='RETIRED' WHERE kb_id=? AND state='ACTIVE'").bind(KB),
  db.prepare("UPDATE kb_generations SET state='ACTIVE' WHERE kb_id=? AND index_version=? AND state='TESTED'").bind(KB,indexVersion),
  db.prepare('INSERT INTO kb_active_pointer(kb_id,index_version) VALUES(?,?) ON CONFLICT(kb_id) DO UPDATE SET index_version=excluded.index_version').bind(KB,indexVersion)
 ]);
 return {kb_id:KB,index_version:indexVersion,state:'ACTIVE'};
}
