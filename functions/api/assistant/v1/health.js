// Read-only, preview-only diagnostics. No keys, customer data, or KB contents are returned.
const respond=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
export async function onRequest({request,env}){
  if(request.method!=="GET")return respond({error:"METHOD_NOT_ALLOWED"},405);
  const host=new URL(request.url).hostname.toLowerCase();
  if(!host.endsWith(".etalon-4322.pages.dev")||host==="etalon-4322.pages.dev")return respond({error:"NOT_FOUND"},404);
  const checks={
    ai:typeof env.AI?.run==="function",
    d1:typeof env.KB_DB?.prepare==="function",
    r2:typeof env.KB_R2?.get==="function",
    vectorize:typeof env.KB_VECTOR?.query==="function",
    embedding_model:env.KB_EMBED_MODEL==="@cf/baai/bge-m3",
    rag_enabled:env.KB_RAG_STAGING_ENABLED==="true"
  };
  if(checks.d1){
    try{
      const result=await env.KB_DB.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE name IN ('kb_generations','kb_active_pointer','kb_fragments','kb_fragment_fts','idx_kb_fragments_vector')").first();
      checks.d1_schema=Number(result?.n)===5;
    }catch{checks.d1_schema=false;}
  }else checks.d1_schema=false;
  return respond({environment:"preview",checks,ready_for_ingestion:checks.ai&&checks.d1_schema&&checks.r2&&checks.vectorize&&checks.embedding_model});
}
