import {services} from '../../ai-data/knowledge.js';
import {canonical,sha256} from '../gate0/manifest.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const safe=(s)=>typeof s==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(s);
export function draftServiceFragments(input=services){
 if(!Array.isArray(input)||input.length!==19)throw Error('EXPECTED_19_SERVICES');
 const seen=new Set();
 return input.map((s,i)=>{
  if(typeof s.title!=='string'||typeof s.description!=='string'||typeof s.url!=='string'||!/^\/servicii\/(incalzire|sanitare|climatizare)\/[a-z0-9-]+\/$/.test(s.url))throw Error('INVALID_SERVICE');
  if(seen.has(s.url))throw Error('DUPLICATE_SERVICE');seen.add(s.url);
  const fragment_id='service-'+String(i+1).padStart(2,'0');
  return {fragment_id,fragment_revision:1,artifact_id:'etalon-4322-services',language:'ro',jurisdiction:'RO',review_status:'PENDING',data:{text:s.title+'. '+s.description,source_url:s.url,source_type:'etalon_editorial',company_service_verified:false}};
 });
}
export async function writeDrafts(outputDir){
 const root=resolve(outputDir);await mkdir(root,{recursive:true});
 const fragments=draftServiceFragments();
 const files=[];
 for(const item of fragments){const path=item.fragment_id+'.json';const data=canonical(item.data)+'\n';await writeFile(join(root,path),data);files.push({fragment_id:item.fragment_id,fragment_revision:item.fragment_revision,artifact_id:item.artifact_id,language:item.language,jurisdiction:item.jurisdiction,path});}
 const config={root,kbVersion:'draft-1',indexVersion:'draft-1',embeddingModel:'MODEL_NOT_SELECTED',files};
 await writeFile(join(root,'build-config.json'),JSON.stringify(config,null,2)+'\n');
 await writeFile(join(root,'review.json'),JSON.stringify({status:'PENDING_HUMAN_REVIEW',count:files.length,warning:'Not approved, not published, not verified as services offered by any company',fragments:fragments.map(f=>({fragment_id:f.fragment_id,source_url:f.data.source_url,review_status:'PENDING'}))},null,2)+'\n');
 return {count:files.length,files,config_sha256:sha256(Buffer.from(canonical(config)))};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+resolve(process.argv[1])).href){const dir=process.argv[2];if(!dir){console.error('Usage: node kb/gate1/prepare-drafts.mjs OUTPUT_DIRECTORY');process.exitCode=2;}else console.log(JSON.stringify(await writeDrafts(dir),null,2));}
