import {answerFromKb} from '../../../../kb/gate1/synthesis.mjs';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
async function boundedJson(request){
 const reader=request.body?.getReader();if(!reader)throw Error('INVALID_JSON');
 const chunks=[];let size=0;
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();throw Error('PAYLOAD_TOO_LARGE');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.byteLength;}
 try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw Error('INVALID_JSON');}
}
export async function onRequest({request,env}){
 if(request.method!=='POST')return json({error:'METHOD_NOT_ALLOWED'},405);
 if(env.KB_RAG_STAGING_ENABLED!=='true')return json({error:'RAG_NOT_ENABLED'},503);
 const url=new URL(request.url);
 if(!env.KB_RAG_ALLOWED_HOST||url.hostname.toLowerCase()!==env.KB_RAG_ALLOWED_HOST.toLowerCase())return json({error:'HOST_NOT_AUTHORIZED'},403);
 const origin=request.headers.get('origin');
 if((origin&&origin!==url.origin)||request.headers.get('sec-fetch-site')==='cross-site')return json({error:'ORIGIN_NOT_ALLOWED'},403);
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return json({error:'UNSUPPORTED_MEDIA_TYPE'},415);
 if(Number(request.headers.get('content-length'))>4096)return json({error:'PAYLOAD_TOO_LARGE'},413);
 let body;try{body=await boundedJson(request);}catch(e){return json({error:e.message==='PAYLOAD_TOO_LARGE'?'PAYLOAD_TOO_LARGE':'INVALID_JSON'},e.message==='PAYLOAD_TOO_LARGE'?413:400);}
 if(typeof body?.message!=='string'||!body.message.trim()||body.message.length>1200)return json({error:'INVALID_QUESTION'},400);
 const requestId=crypto.randomUUID();
 try{return json(await answerFromKb({env,message:body.message,language:body.language??'ro',requestId}));}
 catch(e){const code=e.message;if(['INVALID_QUESTION','UNSUPPORTED_LANGUAGE','UNSUPPORTED_JURISDICTION'].includes(code))return json({error:code,request_id:requestId},400);if(['KB_NOT_CONFIGURED','KB_NOT_ACTIVE'].includes(code))return json({error:'KB_UNAVAILABLE',request_id:requestId},503);return json({error:'ASSISTANT_UNAVAILABLE',request_id:requestId},502);}
}
