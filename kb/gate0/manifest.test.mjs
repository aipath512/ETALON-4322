import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,writeFile,readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build,verifyManifest,canonical,sha256,writeManifest } from './manifest.mjs';
test('canonical hash independent of object key order',()=>{
  assert.equal(sha256(Buffer.from(canonical({b:2,a:1}))),sha256(Buffer.from(canonical({a:1,b:2}))));
});
test('deterministic manifest and tamper detection',async()=>{
 const root=await mkdtemp(join(tmpdir(),'etalon-gate0-'));
 const raw=Buffer.from('{"text":"Pompe de căldură: prezentare generală."}');
 await writeFile(join(root,'heat.json'),raw);
 const config={root,kbVersion:'1.0.0',indexVersion:'idx-001',embeddingModel:'model-001',files:[{path:'heat.json',artifact_id:'heat',fragment_id:'heat-001',fragment_revision:1,language:'ro',jurisdiction:'RO'}]};
 const a=await build(config),b=await build(config);
 assert.equal(canonical(a),canonical(b));
 assert.equal(a.entries.length,1);
 assert.equal(verifyManifest(a,{'heat.json':raw}),true);
 assert.throws(()=>verifyManifest(a,{'heat.json':Buffer.from('{"text":"ALT TEXT"}')}),/mismatch/);
 assert.throws(()=>verifyManifest(a,{}),/mismatch/);
 const dest=join(root,'manifest.json');
 const digest=await writeManifest(a,dest);
 assert.equal(digest,sha256(await readFile(dest)));
});
test('reject path traversal',async()=>{
 const root=await mkdtemp(join(tmpdir(),'etalon-gate0-'));
 await assert.rejects(()=>build({root,kbVersion:'1',indexVersion:'1',embeddingModel:'m',files:[{path:'../escape.json',artifact_id:'a',fragment_id:'f',fragment_revision:1,language:'ro',jurisdiction:'RO'}]}),/path traversal/);
});
