import {stage,activate} from '../../../../kb/gate1/ingest.mjs';
import {retrieve} from '../../../../kb/gate1/retrieval.mjs';
const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
export async function onRequest({request,env}){
 const host=new URL(request.url).hostname;
 if(!host.endsWith('.etalon-4322.pages.dev')||host==='etalon-4322.pages.dev')return reply({error:'PREVIEW_ONLY'},404);
 if(request.method!=='POST')return reply({error:'METHOD_NOT_ALLOWED'},405);
 // Never expose this route unless a secret was explicitly configured.
 if(!env.KB_ADMIN_TOKEN||env.KB_ADMIN_TOKEN.length<32)return reply({error:'ADMIN_DISABLED'},503);
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 if(!token||token.length!==env.KB_ADMIN_TOKEN.length)return reply({error:'UNAUTHORIZED'},401);
 let equal=0;for(let i=0;i<token.length;i++)equal|=token.charCodeAt(i)^env.KB_ADMIN_TOKEN.charCodeAt(i);
 if(equal!==0)return reply({error:'UNAUTHORIZED'},401);
 if(request.headers.get('origin'))return reply({error:'BROWSER_ORIGIN_FORBIDDEN'},403);
 if(Number(request.headers.get('content-length'))>180000)return reply({error:'TOO_LARGE'},413);
 let body;try{const raw=await request.text();if(raw.length>180000)return reply({error:'TOO_LARGE'},413);body=JSON.parse(raw);}catch{return reply({error:'INVALID_JSON'},400);}
 try{
  if(body.action==='stage')return reply(await stage({env,manifest:body.manifest,documents:body.documents,manifestSha:body.manifest_sha256}));
  if(body.action==='test'){
   const index=body.index_version;
   const gen=await env.KB_DB.prepare('SELECT state FROM kb_generations WHERE kb_id=? AND index_version=?').bind('ETALON-4322',index).first();
   if(gen?.state!=='READY')throw Error('GENERATION_NOT_READY');
   const n=await env.KB_DB.prepare("SELECT COUNT(*) AS n FROM kb_fragments WHERE kb_id=? AND index_version=? AND review_status='APPROVED'").bind('ETALON-4322',index).first();
   const f=await env.KB_DB.prepare("SELECT COUNT(*) AS n FROM kb_fragment_fts WHERE kb_id=? AND index_version=?").bind('ETALON-4322',index).first();
   if(Number(n?.n)!==19||Number(f?.n)!==19)throw Error('INCOMPLETE_INDEX');
   // Read and hash-check every uploaded object before marking tested.
   const rows=await env.KB_DB.prepare("SELECT r2_key,content_sha256 FROM kb_fragments WHERE kb_id=? AND index_version=?").bind('ETALON-4322',index).all();
   const {canonical,digest}=await import('../../../../kb/gate1/retrieval.mjs');
   for(const row of rows.results||[]){const obj=await env.KB_R2.get(row.r2_key);if(!obj||await digest(canonical(JSON.parse(await obj.text())))!==row.content_sha256)throw Error('HASH_CHECK_FAILED');}
   // Check Vectorize index visibility by querying with a valid vector and index metadata.
   const embedded=await env.AI.run(env.KB_EMBED_MODEL,{text:['pompe de căldură']});
   const vector=embedded?.data?.[0];
   if(!Array.isArray(vector)||vector.length!==1024)throw Error('EMBEDDING_INVALID');
   const matches=await env.KB_VECTOR.query(vector,{topK:5,returnMetadata:'all',filter:{kb_id:'ETALON-4322',index_version:index}});
   if(!(matches?.matches||[]).some(m=>m.metadata?.index_version===index))throw Error('VECTOR_NOT_VISIBLE');
   await env.KB_DB.prepare("UPDATE kb_generations SET state='TESTED',verified_at=datetime('now') WHERE kb_id=? AND index_version=? AND state='READY'").bind('ETALON-4322',index).run();
   return reply({state:'TESTED',index_version:index,fragments:19});
  }
  if(body.action==='activate')return reply(await activate({env,indexVersion:body.index_version}));
  return reply({error:'UNKNOWN_ACTION'},400);
 }catch(e){return reply({error:String(e.message||e)},409);}
}
