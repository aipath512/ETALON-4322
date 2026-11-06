import { readFile } from 'node:fs/promises';
import { build, writeManifest } from './manifest.mjs';
const [configPath, output='kb/gate0/generated/manifest.json'] = process.argv.slice(2);
if (!configPath) { console.error('Usage: node kb/gate0/build.mjs config.json [output]'); process.exit(2); }
const config=JSON.parse(await readFile(configPath,'utf8'));
const manifest=await build(config);
const digest=await writeManifest(manifest,output);
console.log(JSON.stringify({output,sha256:digest,fragments:manifest.entries.length,ots:'NOT_ANCHORED'},null,2));
