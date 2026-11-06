// Build 19 draft KB fragments from the site's existing service catalog.
// Offline only: no Cloudflare writes, approvals, indexing, or activation.
import { services } from '../../ai-data/knowledge.js';
import { build, writeManifest } from '../gate0/manifest.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

if (services.length !== 19) throw Error('Expected exactly 19 catalog services; got '+services.length);
const root=resolve('kb/gate1/generated/etalon-4322-v1');
await mkdir(root,{recursive:true});
const files=[];
const seen=new Set();
for (const [i,service] of services.entries()) {
  if (typeof service.title!=='string'||typeof service.description!=='string'||!/^\/servicii\/[a-z0-9/-]+\/$/.test(service.url)) throw Error('Invalid catalog service '+i);
  if(seen.has(service.url))throw Error('Duplicate service URL: '+service.url);
  seen.add(service.url);
  const fragment_id='service-'+String(i+1).padStart(2,'0');
  const file=fragment_id+'.json';
  const text=service.title+'\n'+service.description+'\nPagina informativă: '+service.url+'\nNotă: ETALON demonstrativ; nu constituie o ofertă comercială a unei firme reale.';
  await writeFile(join(root,file),JSON.stringify({text,title:service.title,url:service.url,review_status:'PENDING'},null,2)+'\n');
  files.push({path:file,artifact_id:'catalog-'+fragment_id,fragment_id,fragment_revision:1,language:'ro',jurisdiction:'RO'});
}
const manifest=await build({root,kbVersion:'v1',indexVersion:'v1',embeddingModel:'bge-m3',files});
const output=resolve('kb/gate1/generated/manifest.json');
const sha=await writeManifest(manifest,output);
console.log(JSON.stringify({count:manifest.entries.length,manifest:output,sha256:sha,review_status:'PENDING',cloudflare_writes:0},null,2));
