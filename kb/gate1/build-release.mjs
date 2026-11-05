// Creates a deployment bundle from the existing 19 demonstrative catalog entries.
// APPROVED here means catalog-exact text, not verification of a real firm's offerings.
import {services} from '../../ai-data/knowledge.js';
import {build,writeManifest} from '../gate0/manifest.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
if(services.length!==19)throw Error('CATALOG_COUNT_MISMATCH');
const version=process.argv[2]||'v1-reviewed';
if(!/^[a-z0-9-]+$/.test(version))throw Error('INVALID_VERSION');
const root=resolve('kb/gate1/release/'+version);
await mkdir(root,{recursive:true});
const files=[],documents=[];
for(const [i,s] of services.entries()){
 const id='service-'+String(i+1).padStart(2,'0'),path=id+'.json';
 if(!/^\/servicii\/(incalzire|sanitare|climatizare)\/[a-z0-9-]+\/$/.test(s.url))throw Error('INVALID_URL');
 const content={text:s.title+'\n'+s.description+'\nPagina informativă: '+s.url+'\nETALON demonstrativ; nu constituie o ofertă comercială.',title:s.title,url:s.url,review_status:'APPROVED'};
 await writeFile(join(root,path),JSON.stringify(content,null,2)+'\n');
 files.push({path,artifact_id:'catalog-'+id,fragment_id:id,fragment_revision:1,language:'ro',jurisdiction:'RO'});
 documents.push({key:path,content});
}
const manifest=await build({root,kbVersion:'v1',indexVersion:version,embeddingModel:'bge-m3',files});
const manifestPath=join(root,'manifest.json');
const manifest_sha256=await writeManifest(manifest,manifestPath);
const bundle={action:'stage',manifest,manifest_sha256,documents};
await writeFile(join(root,'stage-request.json'),JSON.stringify(bundle));
console.log(JSON.stringify({version,fragments:19,manifest_sha256,request:join(root,'stage-request.json'),status:'BUILT_NOT_DEPLOYED'},null,2));
