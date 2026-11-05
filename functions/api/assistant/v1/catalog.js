import {services} from '../../../../ai-data/knowledge.js';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const stop=new Set(['care','este','sunt','pentru','despre','vreau','aveti','oferiti','puteti','face','faceți','acest','aceasta','unui','unei','cum','cat','costa','pret','preț','serviciu','servicii','firma','firmă','buna','ziua']);
export function matchCatalog(question){
 const words=[...new Set(normalize(question).split(' ').filter(w=>w.length>=3&&!stop.has(w)))];
 const ranked=services.map(s=>{
  const title=normalize(s.title),url=normalize(s.url),description=normalize(s.description);
  const score=words.reduce((n,w)=>n+(title.split(' ').includes(w)?5:0)+(url.split(' ').includes(w)?3:0)+(description.split(' ').includes(w)?1:0),0);
  return {service:s,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
 return ranked.slice(0,3).map(x=>x.service);
}
export async function onRequest({request}){
 if(request.method!=='POST')return json({error:'METHOD_NOT_ALLOWED'},405);
 const url=new URL(request.url);
 if(!url.hostname.endsWith('.etalon-4322.pages.dev')||!url.hostname.startsWith('feature-scara-ai-kb-contract'))return json({error:'PREVIEW_ONLY'},403);
 const origin=request.headers.get('origin');
 if(origin&&origin!==url.origin)return json({error:'ORIGIN_NOT_ALLOWED'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'UNSUPPORTED_MEDIA_TYPE'},415);
 if(Number(request.headers.get('content-length'))>4096)return json({error:'PAYLOAD_TOO_LARGE'},413);
 let body;try{body=await request.json();}catch{return json({error:'INVALID_JSON'},400);}
 if(typeof body?.message!=='string'||!body.message.trim()||body.message.length>1200)return json({error:'INVALID_QUESTION'},400);
 const matches=matchCatalog(body.message);
 if(!matches.length)return json({reply:'Nu am identificat un serviciu relevant în catalogul demonstrativ. Puteți întreba despre climatizare, încălzire sau instalații sanitare.',mode:'catalog_no_match',sources:[]});
 return json({reply:matches.map(s=>s.title+': '+s.description+' Detalii: '+s.url).join('\n\n')+'\n\nETALON este demonstrativ; informațiile nu reprezintă o ofertă comercială.',mode:'catalog_deterministic',sources:matches.map(s=>({title:s.title,url:s.url})),catalog_count:services.length});
}
