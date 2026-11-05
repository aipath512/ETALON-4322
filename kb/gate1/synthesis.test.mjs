import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {canonical,digest} from './retrieval.mjs';
import {answerFromKb} from './synthesis.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const doc={text:'Pompe de căldură: prezentare generală.'};
const hash=await digest(canonical(doc));
function env({active=true,approved=true,tamper=false}={}){
 let llmCalls=0,embedCalls=0;
 const AI={async run(model,input){
  if(model==='@cf/baai/bge-m3'){embedCalls++;return {data:[Array(1024).fill(0.01)]};}
  llmCalls++;return {response:'Informațiile verificate descriu pompe de căldură.'};
 }};
 const KB_DB={prepare(sql){return {bind(){return this;},async first(){
  if(sql.includes('kb_active_pointer'))return {kb_version:'v1',index_version:'v1',state:active?'ACTIVE':'DRAFT'};
  if(sql.includes('kb_fragments'))return approved?{fragment_id:'service-10',r2_key:'service-10.json',content_sha256:hash}:null;
  throw Error('unexpected query');
 },async all(){return {results:[{fragment_id:'service-10'}]};}}}};
 const KB_R2={async get(){return {async text(){return JSON.stringify(tamper?{text:'altered'}:doc);}}}};
 const KB_VECTOR={async query(){return {matches:[]};}};
 return {AI,KB_DB,KB_R2,KB_VECTOR,KB_EMBED_MODEL:'@cf/baai/bge-m3',counts:()=>({llmCalls,embedCalls})};
}
test('active approved evidence yields cited RAG response',async()=>{
 const e=env();const out=await answerFromKb({env:e,message:'Ce sunt pompele de căldură?'});
 assert.equal(out.mode,'rag');assert.equal(out.sources.length,1);assert.equal(out.sources[0].content_sha256,hash);assert.equal(e.counts().llmCalls,1);
});
test('pending fragments never trigger LLM generation',async()=>{
 const e=env({approved:false});const out=await answerFromKb({env:e,message:'Pompe de căldură?'});
 assert.equal(out.mode,'insufficient_evidence');assert.equal(out.sources.length,0);assert.equal(e.counts().llmCalls,0);
});
test('inactive KB fails closed before embedding',async()=>{
 const e=env({active:false});await assert.rejects(answerFromKb({env:e,message:'Pompe de căldură?'}),/KB_NOT_ACTIVE/);
 assert.deepEqual(e.counts(),{llmCalls:0,embedCalls:0});
});
test('tampered source fails closed before LLM',async()=>{
 const e=env({tamper:true});await assert.rejects(answerFromKb({env:e,message:'Pompe de căldură?'}),/KB_HASH_MISMATCH/);
 assert.equal(e.counts().llmCalls,0);
});
test('unsupported language fails closed',async()=>{
 const e=env();await assert.rejects(answerFromKb({env:e,message:'Salut',language:'xx'}),/UNSUPPORTED_LANGUAGE/);
 assert.deepEqual(e.counts(),{llmCalls:0,embedCalls:0});
});
