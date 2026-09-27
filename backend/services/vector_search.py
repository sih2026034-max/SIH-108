import os
import json
import faiss
import numpy as np
from pydantic import BaseModel
from typing import List, Optional

VECTOR_DIR = "data/vector_store"
MODEL_NAME = "intfloat/multilingual-e5-base"

class VectorSearchService:
    def __init__(self):
        self.model = None
        self.index = None
        self.metadata = []
        self.config = {}
        self.is_loaded = False
        
    def load(self):
        if self.is_loaded:
            return True
            
        index_path = os.path.join(VECTOR_DIR, "faiss_index.bin")
        meta_path = os.path.join(VECTOR_DIR, "metadata.json")
        config_path = os.path.join(VECTOR_DIR, "config.json")
        
        if not os.path.exists(index_path) or not os.path.exists(meta_path):
            return False
            
        try:
            self.index = faiss.read_index(index_path)
            with open(meta_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)
            with open(config_path, "r", encoding="utf-8") as f:
                self.config = json.load(f)
                
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(MODEL_NAME)
            self.is_loaded = True
            return True
        except Exception as e:
            print(f"Error loading vector search service: {e}")
            return False

    def is_available(self):
        return self.is_loaded or self.load()
        
    def get_indexed_count(self):
        return len(self.metadata) if self.metadata else 0

    def search_standards(self, query: str, top_k: int = 10, filters: dict = None):
        if not self.is_available():
            raise ValueError("Vector index or model unavailable")
            
        if not query or len(query.strip()) < 3:
            raise ValueError("Query is too short or empty")
            
        if top_k <= 0 or top_k > 100:
            raise ValueError("Invalid top_k")
            
        # For E5 queries
        query_text = f"query: {query.strip()}"
        query_emb = self.model.encode([query_text], normalize_embeddings=True).astype('float32')
        
        # We might need to fetch more if we apply post-filtering
        fetch_k = top_k * 5 if filters else top_k
        
        distances, indices = self.index.search(query_emb, fetch_k)
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:
                continue
                
            meta = self.metadata[idx]
            
            # Apply filters
            if filters:
                skip = False
                for k, v in filters.items():
                    if k in meta and v and str(meta[k]).lower() != str(v).lower():
                        skip = True
                        break
                if skip:
                    continue
                    
            results.append({
                "rank": len(results) + 1,
                "is_number": meta.get("is_number"),
                "title": meta.get("title"),
                "department": meta.get("department"),
                "category": meta.get("category"),
                "similarity_score": round(float(dist), 4),
                "source_record_id": meta.get("source_record_id"),
                "source_file": meta.get("source_file"),
                "id": meta.get("id")
            })
            
            if len(results) >= top_k:
                break
                
        return results

# Singleton instance
vector_service = VectorSearchService()
