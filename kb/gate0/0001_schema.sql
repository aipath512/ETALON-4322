-- Gate 0 only: no automatic deployment. Apply with explicit D1 binding and migration plan.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS kb_generations (
  kb_id TEXT NOT NULL,
  index_version TEXT NOT NULL,
  kb_version TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  manifest_sha256 TEXT NOT NULL CHECK(length(manifest_sha256)=64),
  state TEXT NOT NULL CHECK(state IN ('DRAFT','VALIDATED','INDEXING','READY','TESTED','ACTIVE','RETIRED')),
  verified_at TEXT,
  PRIMARY KEY (kb_id,index_version)
);
CREATE TABLE IF NOT EXISTS kb_active_pointer (
  kb_id TEXT PRIMARY KEY,
  index_version TEXT NOT NULL,
  FOREIGN KEY(kb_id,index_version) REFERENCES kb_generations(kb_id,index_version)
);
CREATE TABLE IF NOT EXISTS kb_fragments (
  kb_id TEXT NOT NULL,
  index_version TEXT NOT NULL,
  fragment_id TEXT NOT NULL,
  fragment_revision INTEGER NOT NULL CHECK(fragment_revision>=1),
  artifact_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  content_sha256 TEXT NOT NULL CHECK(length(content_sha256)=64),
  embedding_input_sha256 TEXT NOT NULL CHECK(length(embedding_input_sha256)=64),
  vector_id TEXT NOT NULL,
  language TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY(kb_id,index_version,fragment_id,fragment_revision),
  FOREIGN KEY(kb_id,index_version) REFERENCES kb_generations(kb_id,index_version)
);
CREATE INDEX IF NOT EXISTS idx_kb_fragments_vector ON kb_fragments(kb_id,index_version,vector_id);
CREATE VIRTUAL TABLE IF NOT EXISTS kb_fragment_fts USING fts5(
  kb_id UNINDEXED,index_version UNINDEXED,fragment_id UNINDEXED,body,
  tokenize='unicode61'
);
-- FTS content must be populated from VERIFIED canonical fragments; not by this migration.
-- Activation requires a separate transactional routine checking state TESTED and generation completeness.
