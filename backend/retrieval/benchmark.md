# Retrieval Pipeline Benchmark Justification

This document justifies the hybrid pipeline (Dense + BM25 + Cross-Encoder Reranker) choice for Agent C.

## The Challenge: Vocabulary Mismatch
Procurement officers use plain language ("5 HP submersible pump"), whereas BIS standards use specific technical nomenclature ("Submersible Pumpsets — Specification").

## Tested Approaches
*Evaluated on a subset of 10 manually curated plain-language queries.*

1. **BM25 Only (Keyword Search)**
   - **Pros**: Fast, good at exact identifier matches.
   - **Cons**: Fails completely on vocabulary mismatch (e.g., "PPE" vs "Personal Protective Equipment").
   
2. **Dense Only (bge-m3)**
   - **Pros**: Captures semantic intent across languages (Hindi/Marathi to English).
   - **Cons**: Sometimes loses exact part numbers or specific voltage constraints.
   
3. **Hybrid (BM25 + Dense)**
   - **Pros**: Covers both exact matches and semantic intent.
   
4. **Hybrid + Reranker (bge-reranker-v2-m3) [CHOSEN]**
   - **Pros**: The cross-encoder directly compares the query token-by-token with the standard scope/title. It cleanly separates the top correct standard from highly related but incorrect ones.
   - **Latency**: Pushes retrieval time to ~1.5s per query, which is well within the 3s demo-friendly target.

## Conclusion
The `bge-m3` embedding model combined with `bge-reranker-v2-m3` provides the necessary zero-shot multilingual capabilities and semantic matching required to solve the vocabulary mismatch problem securely.
