#!/usr/bin/env node
// Safe, read-only validation of required Cloudflare Preview configuration.
import {readFile} from 'node:fs/promises';
const file=process.argv[2]||'wrangler.jsonc';
const raw=await readFile(file,'utf8');
const config=JSON.parse(raw.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm,''));
const errors=[];
if(config.name!=='etalon-4322')errors.push('Unexpected Pages project');
if(config.ai?.binding!=='AI')errors.push('Missing Workers AI binding');
const expected={d1_databases:'KB_DB',r2_buckets:'KB_R2',vectorize:'KB_VECTOR'};
for(const [section,name] of Object.entries(expected)){
 const values=config[section]||[];
 if(values.some(x=>x.binding===name))errors.push('WARNING: '+name+' declared globally; use Preview-only dashboard bindings or verify environment isolation');
}
if(config.vars?.KB_RAG_STAGING_ENABLED==='true')errors.push('RAG activation flag must not be global');
const result={project:config.name,preview_resources_required:['KB_DB (D1)','KB_R2 (R2)','KB_VECTOR (Vectorize)','AI (Workers AI)','KB_EMBED_MODEL (plain variable)','KB_RAG_ALLOWED_HOST (plain variable)'],activation:'disabled unless explicitly enabled in Preview',errors};
console.log(JSON.stringify(result,null,2));
if(errors.length)process.exitCode=1;
