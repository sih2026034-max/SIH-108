import os
import json
import numpy as np
from pydantic import BaseModel
from typing import List, Optional

try:
    import faiss
    HAS_FAISS = True
except ImportError:
    HAS_FAISS = False
    print("Warning: faiss-cpu not found or failed to load. Will use lexical fallback.")

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
            if HAS_FAISS:
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
        if not query or len(query.strip()) < 3:
            raise ValueError("Query is too short or empty")
            
        if top_k <= 0 or top_k > 100:
            raise ValueError("Invalid top_k")
            
        # Fallback to lexical if AI model failed to load or metadata is missing
        if not self.is_loaded or self.model is None or not self.metadata:
            results = []
            q_lower = query.lower()
            q_words = [w for w in q_lower.split() if len(w) > 3]
            
            # Direct read from master DB
            db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "master_department_wise.json")
            all_stds = []
            try:
                import json
                with open(db_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for dept, stds in data.items():
                        all_stds.extend(stds)
            except:
                pass
                
            for i, meta in enumerate(all_stds):
                score = 0.0
                title = str(meta.get("title", "")).lower()
                desc = str(meta.get("department_name", "")).lower()
                if q_lower in title: score += 0.8
                if q_lower in desc: score += 0.5
                for word in q_words:
                    if word in title: score += 0.3
                if score > 0:
                    results.append((score, meta))
            
            results.sort(reverse=True, key=lambda x: x[0])
            out = []
            for score, meta in results[:top_k]:
                out.append({
                    "rank": len(out) + 1,
                    "is_number": meta.get("standard_number"),
                    "title": meta.get("title"),
                    "department": meta.get("department_name"),
                    "category": meta.get("standard_type", "Product"),
                    "similarity_score": round(score, 4) if score < 1 else 0.95,
                    "source_record_id": meta.get("bis_id"),
                    "source_file": meta.get("preview_url"),
                    "id": meta.get("normalized_id")
                })
            if not out:
                return [{"rank": 1, "is_number": "N/A", "title": f"No matches found for {query}", "category": "General", "similarity_score": 0.0}]
            return out
            
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
