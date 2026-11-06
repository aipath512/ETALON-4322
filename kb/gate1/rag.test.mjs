import test from 'node:test';
import assert from 'node:assert/strict';
import {retrieve,digest,canonical} from './retrieval.mjs';
import {onRequest} from '../../functions/api/assistant/v1/chat.js';
const content={text:'Prezentare generală despre pompe de căldură.'};
const hash=await digest(canonical(content));
function fixtures(active=true,validHash=true){
 const db={prepare(sql){return {bind(){return {async first(){if(sql.includes('kb_active_pointer'))return active?{state:'ACTIVE',kb_version:'v1',index_version:'i1'}:null;return {r2_key:'f1.json',content_sha256:validHash?hash:'0'.repeat(64)};},async all(){return {results:[{fragment_id:'f1'}]};}};}}}};
 return {db,r2:{async get(){return {async text(){return JSON.stringify(content);}}}}};
}
test('retrieval verifies approved fragment hash',async()=>{const x=await retrieve({...fixtures(),question:'pompe caldura'});assert.equal(x.fragments.length,1);assert.equal(x.index_version,'i1');});
test('inactive generation is rejected',async()=>{await assert.rejects(()=>retrieve({...fixtures(false),question:'pompe'}),/KB_NOT_ACTIVE/);});
test('tampered fragment is rejected',async()=>{await assert.rejects(()=>retrieve({...fixtures(true,false),question:'pompe'}),/KB_HASH_MISMATCH/);});
const req=(host='feature-scara-ai-kb-contract.etalon-4322.pages.dev')=>new Request('https://'+host+'/api/assistant/v1/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'Pompe de caldura?'})});
test('endpoint disabled by default',async()=>{const r=await onRequest({request:req(),env:{}});assert.equal(r.status,503);assert.equal((await r.json()).error,'RAG_NOT_ENABLED');});
test('endpoint denies unapproved host',async()=>{const r=await onRequest({request:req('etalon-4322.pages.dev'),env:{KB_RAG_STAGING_ENABLED:'true',KB_RAG_ALLOWED_HOST:'feature-scara-ai-kb-contract.etalon-4322.pages.dev'}});assert.equal(r.status,403);});
