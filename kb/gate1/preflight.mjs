// Gate 2 preflight: verify the generated KB is internally consistent.
// This script is deliberately read-only. It cannot upload or activate anything.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {verifyManifest} from '../gate0/manifest.mjs';
import {services} from '../../ai-data/knowledge.js';
const base='kb/gate1/generated';
const manifest=JSON.parse(await readFile(base+'/manifest.json','utf8'));
if(manifest.kb_id!=='ETALON-4322'||manifest.entries.length!==19||services.length!==19)throw Error('CATALOG_COUNT_MISMATCH');
if(manifest.embedding_model!=='bge-m3')throw Error('EMBEDDING_MODEL_MISMATCH');
const seen=new Set(),blobs={};let pending=0;
for(const e of manifest.entries){
 if(seen.has(e.fragment_id))throw Error('DUPLICATE_FRAGMENT');
 seen.add(e.fragment_id);
 if(e.language!=='ro'||e.jurisdiction!=='RO'||e.fragment_revision!==1)throw Error('INVALID_METADATA');
 if(!/^[a-f0-9]{64}$/.test(e.content_sha256)||!/^[a-f0-9]{64}$/.test(e.embedding_input_sha256))throw Error('INVALID_DIGEST');
 const bytes=await readFile(base+'/etalon-4322-v1/'+e.r2_key);
 const doc=JSON.parse(bytes.toString('utf8'));
 if(doc.review_status==='PENDING')pending++;
 else if(doc.review_status!=='APPROVED')throw Error('INVALID_REVIEW_STATUS');
 blobs[e.r2_key]=bytes;
}
verifyManifest(manifest,blobs);
const hash=createHash('sha256').update(await readFile(base+'/manifest.json')).digest('hex');
const report={kb_id:manifest.kb_id,fragments:manifest.entries.length,pending,approved:manifest.entries.length-pending,manifest_sha256:hash,ingestion_allowed:pending===0,activation_allowed:false,cloudflare_writes:0};
console.log(JSON.stringify(report,null,2));
if(pending)console.log('Gate 2 blocked: editorial approval required before any ingestion.');
