import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {retrieve,canonical,digest,tokenize} from './retrieval.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const doc={text:'Pompe de căldură: prezentare generală.'};
const hash=await digest(canonical(doc));
function mock({state='ACTIVE',review='APPROVED',tamper=false}={}){
 const calls=[];
 const db={prepare(sql){
  const query={bind(...args){this.args=args;return this;},async first(){
   if(sql.includes('kb_active_pointer'))return state?{kb_version:'v1',index_version:'v1',state}:null;
   if(sql.includes('kb_fragments'))return review==='APPROVED'?{fragment_id:'service-10',fragment_revision:1,r2_key:'service-10.json',content_sha256:hash,language:'ro',jurisdiction:'RO',review_status:review}:null;
   throw Error('Unexpected SQL');
  },async all(){return {results:[{fragment_id:'service-10'}]};}};
  calls.push({sql,query});return query;
 }};
 const r2={async get(){return {async text(){return JSON.stringify(tamper?{text:'altered'}:doc);}}}};
 return {db,r2,calls};
}
test('tokenization removes duplicates and bounds tokens',()=>{assert.deepEqual(tokenize('Pompe pompe de căldură'),['pompe','căldură']);assert.deepEqual(tokenize('a bb'),[]);});
test('inactive KB fails closed',async()=>{const m=mock({state:'DRAFT'});await assert.rejects(retrieve({...m,question:'pompe căldură'}),/KB_NOT_ACTIVE/);});
test('approved fragments returned with verified hash',async()=>{const m=mock();const r=await retrieve({...m,question:'pompe căldură'});assert.equal(r.fragments.length,1);assert.equal(r.fragments[0].content_sha256,hash);});
test('pending fragments never reach synthesis',async()=>{const m=mock({review:'PENDING'});const r=await retrieve({...m,question:'pompe căldură'});assert.equal(r.fragments.length,0);});
test('R2 tampering fails closed',async()=>{const m=mock({tamper:true});await assert.rejects(retrieve({...m,question:'pompe căldură'}),/KB_HASH_MISMATCH/);});
test('empty question rejected',async()=>{const m=mock();await assert.rejects(retrieve({...m,question:' '}),/INVALID_QUESTION/);});

test('rejects malformed embedding before Vectorize query',async()=>{
 const m=mock();let queried=false;
 await assert.rejects(retrieve({...m,question:'pompe căldură',embed:async()=>[0.1,0.2],vectorize:{async query(){queried=true;return {matches:[]};}}}),/EMBEDDING_INVALID/);
 assert.equal(queried,false);
});
test('accepts valid embedding and applies KB version filter',async()=>{
 const m=mock();let filter;
 const r=await retrieve({...m,question:'pompe căldură',embed:async()=>Array(1024).fill(0.01),vectorize:{async query(vector,options){assert.equal(vector.length,1024);filter=options.filter;return {matches:[]};}}});
 assert.deepEqual(filter,{kb_id:'ETALON-4322',index_version:'v1'});
 assert.equal(r.fragments.length,1);
});
