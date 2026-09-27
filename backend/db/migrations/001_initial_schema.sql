-- 001_initial_schema.sql
-- Create extension for pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for Indian Standards Metadata
CREATE TABLE IF NOT EXISTS standards (
    id VARCHAR PRIMARY KEY,
    is_number VARCHAR NOT NULL,
    title TEXT NOT NULL,
    common_title VARCHAR,
    edition VARCHAR,
    amendment_no VARCHAR,
    amendment_date DATE,
    status VARCHAR CHECK (status IN ('live', 'superseded', 'withdrawn')),
    group_name VARCHAR,
    subgroup VARCHAR,
    ics_code VARCHAR,
    itc_hs_code VARCHAR,
    certification_type VARCHAR,
    relevant_ministry VARCHAR,
    source_url VARCHAR NOT NULL,
    retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    scope_excerpt TEXT,
    embedding VECTOR(1024) -- BAAI/bge-m3 has 1024 dims
);

-- Creating index for vector search (HNSW index for fast nearest neighbor)
CREATE INDEX IF NOT EXISTS standards_embedding_idx ON standards USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS standards_is_number_idx ON standards (is_number);

-- Table for typed edges/relationships between standards
CREATE TABLE IF NOT EXISTS standard_edges (
    id SERIAL PRIMARY KEY,
    from_is_number VARCHAR NOT NULL,
    to_is_number VARCHAR NOT NULL,
    edge_type VARCHAR CHECK (edge_type IN ('SUPERSEDED_BY', 'NORMATIVE_REF', 'CROSS_REF', 'TEST_METHOD_FOR', 'TERMINOLOGY_FOR', 'SAFETY_FOR')),
    source_url VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS standard_edges_from_idx ON standard_edges (from_is_number);
CREATE INDEX IF NOT EXISTS standard_edges_to_idx ON standard_edges (to_is_number);

-- Table for certification specifics
CREATE TABLE IF NOT EXISTS certifications (
    standard_id VARCHAR REFERENCES standards(id),
    cert_type VARCHAR,
    mandatory_bool BOOLEAN,
    qco_reference VARCHAR,
    notes TEXT,
    PRIMARY KEY (standard_id, cert_type)
);

-- Table for Agent F (Evaluation Gold Queries)
CREATE TABLE IF NOT EXISTS gold_queries (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    language VARCHAR,
    correct_is_number VARCHAR NOT NULL,
    notes TEXT
);

-- Table for Agent H (Audited Tenders)
CREATE TABLE IF NOT EXISTS audited_tenders (
    id SERIAL PRIMARY KEY,
    source_url VARCHAR,
    tender_text TEXT NOT NULL,
    flagged_issues JSONB,
    audited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
