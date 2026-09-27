# Semantic Search Implementation

This document outlines the implementation of the Semantic Embedding and Vector Search layer for the IS-Recommend system.

## Configuration Details
* **Embedding Model**: `intfloat/multilingual-e5-base`
* **Embedding Dimension**: 768
* **Vector Index Type**: FAISS `IndexFlatIP` (Inner Product, which is equivalent to Cosine Similarity when vectors are L2-normalized)
* **Similarity Metric**: Cosine Similarity
* **Supported Languages**: English, Hindi, Marathi (and other languages supported by multilingual-e5)
* **Indexed Records**: 12,494 (from `normalized_standards.json`)

## Metadata Mapping
Each vector is mapped directly back to its source record using the following metadata:
* `id` (Internal normalized ID)
* `is_number` (Original Standard Number)
* `title`
* `department`
* `category`
* `status`
* `edition`
* `source_record_id`
* `source_file` (`master_department_wise.json`)

## Commands

### 1. Build Index
To rebuild the embeddings and vector index from the normalized dataset:
```bash
python backend/scripts/build_embeddings.py
```

### 2. Search Command (Test Script)
To run predefined test queries across different languages and filters:
```bash
python backend/scripts/test_vector_search.py
```

## Search API Details

**Endpoint:** `POST /api/standards/search`

**Request Payload:**
```json
{
  "query": "LED street light for municipal roads",
  "top_k": 10,
  "department": "Electrical"
}
```

**Health Check Endpoint:** `GET /api/health`

## Known Limitations
* **Metadata Dependency:** The semantic retrieval is heavily dependent on the available text. Because **94% of the records are missing `scope`**, the embedding is primarily generated from the standard's `title`. Semantic retrieval quality may be limited for standards with short, uninformative titles.
* **No Artificial Augmentation:** Per strict instructions, no synthetic descriptions or keywords were generated for this phase. 
