export function validateActivation({generation,evidence,expectedFragments}) {
 if (generation?.state !== 'TESTED') throw Error('not tested');
 if (!/^[a-f0-9]{64}$/.test(generation.manifest_sha256 || '')) throw Error('invalid manifest');
 const required=['r2_integrity','d1_integrity','fts_visibility','vector_visibility','retrieval_evaluation','safety_evaluation','tenant_isolation'];
 for(const key of required) if(evidence?.[key]!==true) throw Error('missing '+key);
 if(!Number.isSafeInteger(expectedFragments)||expectedFragments<1) throw Error('invalid expected count');
 if([evidence.fragment_count,evidence.vector_count,evidence.fts_count].some(n=>n!==expectedFragments)) throw Error('incomplete generation');
 if(evidence.kb_version!==generation.kb_version||evidence.index_version!==generation.index_version) throw Error('generation mismatch');
 return true;
}
