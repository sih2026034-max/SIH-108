import json
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import time

DATA_FILE = "data/processed/normalized_standards.json"
VECTOR_DIR = "data/vector_store"
MODEL_NAME = "intfloat/multilingual-e5-base"

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def build_index():
    print(f"Loading model: {MODEL_NAME}...")
    try:
        model = SentenceTransformer(MODEL_NAME)
    except Exception as e:
        print(f"ERROR: Could not load embedding model {MODEL_NAME}. {e}")
        return
        
    print(f"Loading data from {DATA_FILE}...")
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    texts = []
    metadata = []
    
    # E5 models usually require "query: " or "passage: " prefix. We use "passage: " for indexing.
    for record in data:
        # validate record
        if "id" not in record or "search_text" not in record:
            continue
            
        texts.append(f"passage: {record['search_text']}")
        metadata.append({
            "id": record["id"],
            "is_number": record.get("is_number"),
            "title": record.get("title"),
            "department": record.get("department"),
            "category": record.get("category"),
            "status": record.get("status"),
            "edition": record.get("edition"),
            "source_record_id": record.get("source_record_id"),
            "source_file": record.get("source_file")
        })
        
    total_records = len(texts)
    print(f"Found {total_records} valid records to index.")
    
    batch_size = 128
    embeddings = []
    
    print("Generating embeddings in batches...")
    start_time = time.time()
    for i in range(0, total_records, batch_size):
        batch_texts = texts[i:i+batch_size]
        # normalize_embeddings=True applies L2 normalization for cosine similarity
        batch_emb = model.encode(batch_texts, normalize_embeddings=True)
        embeddings.append(batch_emb)
        if i % 1000 == 0 or i == total_records - 1:
            print(f"  Processed {min(i+batch_size, total_records)}/{total_records}...")
            
    embeddings = np.vstack(embeddings).astype('float32')
    
    print("Building FAISS index...")
    d = embeddings.shape[1]
    index = faiss.IndexFlatIP(d) # Inner product with normalized vectors = cosine similarity
    index.add(embeddings)
    
    ensure_dir(VECTOR_DIR)
    
    print("Saving index and metadata...")
    faiss.write_index(index, os.path.join(VECTOR_DIR, "faiss_index.bin"))
    
    with open(os.path.join(VECTOR_DIR, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False)
        
    config = {
        "model_name": MODEL_NAME,
        "dimension": d,
        "metric": "cosine",
        "index_type": "IndexFlatIP",
        "indexed_records": total_records
    }
    
    with open(os.path.join(VECTOR_DIR, "config.json"), "w", encoding="utf-8") as f:
        json.dump(config, f)
        
    print(f"Successfully indexed {total_records} records in {time.time() - start_time:.2f} seconds.")

if __name__ == "__main__":
    build_index()
