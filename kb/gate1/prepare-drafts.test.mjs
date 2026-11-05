import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {draftServiceFragments,writeDrafts} from './prepare-drafts.mjs';
test('all 19 services are editorial drafts, not verified company claims',()=>{const d=draftServiceFragments();assert.equal(d.length,19);assert.equal(new Set(d.map(x=>x.data.source_url)).size,19);for(const f of d){assert.equal(f.review_status,'PENDING');assert.equal(f.data.company_service_verified,false);assert.match(f.data.source_url,/^\/servicii\//);}});
test('draft generator produces canonical files and review ledger',async()=>{const dir=await mkdtemp(join(tmpdir(),'scara-kb-'));try{const r=await writeDrafts(dir);assert.equal(r.count,19);const ledger=JSON.parse(await readFile(join(dir,'review.json'),'utf8'));assert.equal(ledger.status,'PENDING_HUMAN_REVIEW');const first=JSON.parse(await readFile(join(dir,'service-01.json'),'utf8'));assert.equal(first.company_service_verified,false);const config=JSON.parse(await readFile(join(dir,'build-config.json'),'utf8'));assert.equal(config.files.length,19);}finally{await rm(dir,{recursive:true,force:true});}});
test('draft generator rejects duplicate source URLs',()=>{const d=draftServiceFragments();const source=d.map(x=>({title:x.data.text,description:'desc',url:x.data.source_url}));source[1].url=source[0].url;assert.throws(()=>draftServiceFragments(source),/DUPLICATE_SERVICE/);});
