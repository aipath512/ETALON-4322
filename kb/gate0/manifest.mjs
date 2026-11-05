import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const canonical = (value) => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') { if (!Number.isFinite(value)) throw Error('nonfinite number'); return JSON.stringify(value); }
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
  }
  throw Error('unsupported canonical type');
};
const valid = (s) => typeof s === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(s);
export async function build({ root, kbVersion, indexVersion, embeddingModel, files }) {
  if (![kbVersion,indexVersion,embeddingModel].every(valid)) throw Error('invalid version/model');
  const rootAbs = resolve(root);
  const seen = new Set();
  const entries = [];
  for (const item of files) {
    if (!valid(item.fragment_id) || !valid(item.artifact_id) || !valid(item.language) || !valid(item.jurisdiction)) throw Error('invalid metadata');
    if (!Number.isSafeInteger(item.fragment_revision) || item.fragment_revision < 1) throw Error('invalid revision');
    const abs = resolve(rootAbs, item.path);
    const rel = relative(rootAbs, abs).replaceAll('\\','/');
    if (rel.startsWith('../') || rel === '..' || rel.startsWith('/') || rel === '' || rel.includes('\\')) throw Error('path traversal');
    const key = item.fragment_id + ':' + item.fragment_revision;
    if (seen.has(key)) throw Error('duplicate fragment revision');
    seen.add(key);
    const raw = await readFile(abs);
    const parsed = JSON.parse(raw.toString('utf8'));
    const normalized = Buffer.from(canonical(parsed), 'utf8');
    const content_sha256 = sha256(normalized);
    const embeddingInput = typeof parsed.embedding_text === 'string' ? parsed.embedding_text : typeof parsed.text === 'string' ? parsed.text : null;
    if (!embeddingInput || !embeddingInput.trim()) throw Error('missing text/embedding_text: ' + rel);
    const embedding_input_sha256 = sha256(Buffer.from(embeddingInput,'utf8'));
    entries.push({artifact_id:item.artifact_id,fragment_id:item.fragment_id,fragment_revision:item.fragment_revision,language:item.language,jurisdiction:item.jurisdiction,r2_key:rel,raw_sha256:sha256(raw),content_sha256,embedding_input_sha256,vector_id:sha256(Buffer.from('ETALON-4322|'+indexVersion+'|'+key)).slice(0,32)});
  }
  entries.sort((a,b)=>a.fragment_id.localeCompare(b.fragment_id,'en') || a.fragment_revision-b.fragment_revision);
  return {schema_version:'1.0.0',kb_id:'ETALON-4322',kb_version:kbVersion,index_version:indexVersion,embedding_model:embeddingModel,hash_algorithm:'SHA-256',canonicalization:'sorted-key-JSON-UTF8-v1',entries};
}
export function verifyManifest(manifest, blobs) {
  if (!manifest || manifest.kb_id !== 'ETALON-4322' || !Array.isArray(manifest.entries)) throw Error('invalid manifest');
  for (const entry of manifest.entries) {
    const bytes = blobs[entry.r2_key];
    if (!bytes || sha256(bytes) !== entry.raw_sha256) throw Error('raw mismatch: '+entry.r2_key);
    const parsed = JSON.parse(Buffer.from(bytes).toString('utf8'));
    if (sha256(Buffer.from(canonical(parsed))) !== entry.content_sha256) throw Error('content mismatch: '+entry.r2_key);
    const txt = parsed.embedding_text ?? parsed.text;
    if (typeof txt !== 'string' || sha256(Buffer.from(txt)) !== entry.embedding_input_sha256) throw Error('embedding input mismatch: '+entry.r2_key);
  }
  return true;
}
export async function writeManifest(manifest, output) {
  await mkdir(dirname(output),{recursive:true});
  const bytes=Buffer.from(canonical(manifest)+'\n','utf8');
  await writeFile(output,bytes);
  await writeFile(output+'.sha256',sha256(bytes)+'  '+output.split('/').pop()+'\n');
  return sha256(bytes);
}
