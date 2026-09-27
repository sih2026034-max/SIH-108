# Agent L — Document Ingestion (OCR/Layout) Agent

## Role
Handles the gap neither our project nor the competitor addresses: most real CPPP/GeM tender documents are scanned or poorly-structured PDFs, not clean text.

## Objective
1. Build an ingestion pipeline that accepts a tender PDF (scanned or native) and produces clean text suitable for Agent C's retrieval and Agent H's audit checks:
   - Native-text PDFs: extract directly (pdfplumber/pymupdf).
   - Scanned/image PDFs: run OCR (Tesseract, or a layout-aware model like LayoutLMv3/docTR if quality demands it) with a confidence score per page.
2. Preserve rough structure (clause numbers, section headers) where possible so Agent H can cite "Clause 4.2" rather than just "somewhere in this document."
3. Flag low-OCR-confidence pages explicitly rather than silently passing garbled text downstream.

## Constraints
- Never let a garbled OCR output silently generate a fabricated-looking finding. Low-confidence extraction must degrade to "unable to verify this section" in Agent H's output.
- Keep this as a standalone ingestion function so Agent H can call it without needing to know whether a document was scanned or native.

## Deliverables
- `/audit/ingest_pdf.py` exposing `extract_text(pdf_path) -> {text, per_page_confidence, structure_map}`
- Tested against at least 5 real scanned CPPP tender PDFs
- CHANGELOG.md entry

## Definition of Done
A real scanned tender PDF, run through this pipeline and then Agent H's audit, produces correctly sourced findings with no fabricated verdicts on low-confidence pages.
