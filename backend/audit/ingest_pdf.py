"""
Agent L — Document Ingestion (OCR/Layout) Pipeline

Accepts a tender PDF (scanned or native) and produces clean text suitable
for Agent C's retrieval and Agent H's audit checks.

Interface:
    extract_text(pdf_path: str) -> dict
    Returns: {
        "text": str,              # full extracted text
        "per_page_confidence": [float],  # OCR confidence per page (1.0 for native)
        "structure_map": [{"page": int, "clauses": [str]}],  # detected clause numbers
        "method": str,            # "native_extraction" | "ocr_tesseract"
        "low_confidence_pages": [int],  # pages below OCR threshold
    }

Constraint: Low-confidence extraction degrades to "unable to verify this section"
in Agent H's output. A garbled OCR output must NEVER silently generate a
fabricated-looking finding.
"""

import logging
import os
import re
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

# OCR confidence threshold — pages below this are flagged
OCR_CONFIDENCE_THRESHOLD = 0.70


def extract_text(pdf_path: str) -> Dict[str, Any]:
    """
    Main entry point. Attempts native text extraction first,
    falls back to OCR if the page has too little extractable text.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    # Try native extraction first (pdfplumber/pymupdf)
    try:
        return _extract_native(pdf_path)
    except Exception as e:
        logger.warning(f"Native extraction failed ({e}), trying OCR fallback")

    # Fallback to OCR
    try:
        return _extract_ocr(pdf_path)
    except Exception as e:
        logger.error(f"OCR extraction also failed: {e}")
        return {
            "text": "",
            "per_page_confidence": [],
            "structure_map": [],
            "method": "failed",
            "low_confidence_pages": [],
            "error": str(e),
        }


def _extract_native(pdf_path: str) -> Dict[str, Any]:
    """
    Extract text from native-text PDFs using pymupdf (fitz).
    Falls back to a simple text-based approach if pymupdf isn't installed.
    """
    pages_text: List[str] = []
    structure_map: List[Dict[str, Any]] = []

    try:
        import fitz  # pymupdf

        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            pages_text.append(text)
            clauses = _detect_clauses(text)
            structure_map.append({"page": page_num + 1, "clauses": clauses})
        doc.close()
    except ImportError:
        # pymupdf not available, try pdfplumber
        try:
            import pdfplumber

            with pdfplumber.open(pdf_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text() or ""
                    pages_text.append(text)
                    clauses = _detect_clauses(text)
                    structure_map.append({"page": i + 1, "clauses": clauses})
        except ImportError:
            raise RuntimeError(
                "Neither pymupdf nor pdfplumber is installed. "
                "Install one: pip install pymupdf pdfplumber"
            )

    full_text = "\n\n".join(pages_text)

    # Check if extraction actually got meaningful text
    if len(full_text.strip()) < 50:
        raise ValueError("Native extraction produced too little text, likely scanned PDF")

    return {
        "text": full_text,
        "per_page_confidence": [1.0] * len(pages_text),  # native = full confidence
        "structure_map": structure_map,
        "method": "native_extraction",
        "low_confidence_pages": [],
    }


def _extract_ocr(pdf_path: str) -> Dict[str, Any]:
    """
    OCR extraction for scanned PDFs using Tesseract.
    Reports per-page confidence and flags low-confidence pages.
    """
    pages_text: List[str] = []
    page_confidences: List[float] = []
    structure_map: List[Dict[str, Any]] = []
    low_conf_pages: List[int] = []

    try:
        import fitz  # pymupdf for PDF-to-image conversion
        import pytesseract
        from PIL import Image
        import io

        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc[page_num]
            # Render page to image at 300 DPI
            pix = page.get_pixmap(dpi=300)
            img_bytes = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_bytes))

            # Run Tesseract with confidence data
            ocr_data = pytesseract.image_to_data(
                img, lang="eng+hin", output_type=pytesseract.Output.DICT
            )

            # Calculate average confidence for this page
            confidences = [
                int(c) for c in ocr_data["conf"] if str(c).isdigit() and int(c) > 0
            ]
            avg_conf = sum(confidences) / max(len(confidences), 1) / 100.0

            text = pytesseract.image_to_string(img, lang="eng+hin")
            pages_text.append(text)
            page_confidences.append(round(avg_conf, 3))

            if avg_conf < OCR_CONFIDENCE_THRESHOLD:
                low_conf_pages.append(page_num + 1)
                logger.warning(
                    f"Page {page_num + 1}: OCR confidence {avg_conf:.2f} < threshold "
                    f"{OCR_CONFIDENCE_THRESHOLD}. This page will be flagged as unverifiable."
                )

            clauses = _detect_clauses(text)
            structure_map.append({"page": page_num + 1, "clauses": clauses})

        doc.close()

    except ImportError as e:
        raise RuntimeError(
            f"OCR dependencies missing ({e}). "
            "Install: pip install pymupdf pytesseract Pillow"
        )

    full_text = "\n\n".join(pages_text)

    return {
        "text": full_text,
        "per_page_confidence": page_confidences,
        "structure_map": structure_map,
        "method": "ocr_tesseract",
        "low_confidence_pages": low_conf_pages,
    }


def _detect_clauses(text: str) -> List[str]:
    """
    Detect clause/section numbers in extracted text.
    Looks for patterns like "4.2", "4.2.1", "Clause 5", "Section 3.1"
    """
    patterns = [
        r"(?:Clause|Section|cl\.?)\s*(\d+(?:\.\d+)*)",  # "Clause 4.2.1"
        r"^(\d+(?:\.\d+)+)\s+[A-Z]",  # "4.2.1 Some heading"
    ]
    clauses = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.MULTILINE | re.IGNORECASE)
        clauses.extend(matches)
    return sorted(set(clauses))


def get_safe_text_for_audit(extraction_result: Dict[str, Any]) -> str:
    """
    Returns text that is safe for Agent H's audit pipeline.
    Replaces low-confidence page content with explicit warnings
    so no fabricated findings are generated from garbled OCR.
    """
    if not extraction_result.get("low_confidence_pages"):
        return extraction_result["text"]

    pages = extraction_result["text"].split("\n\n")
    low_conf_set = set(extraction_result["low_confidence_pages"])

    safe_pages = []
    for i, page_text in enumerate(pages):
        page_num = i + 1
        if page_num in low_conf_set:
            safe_pages.append(
                f"[PAGE {page_num}: LOW OCR CONFIDENCE — UNABLE TO VERIFY THIS SECTION. "
                f"Manual review required before issuing audit findings for this page.]"
            )
        else:
            safe_pages.append(page_text)

    return "\n\n".join(safe_pages)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    print("Agent L — PDF Ingestion Module")
    print("Usage: extract_text('/path/to/tender.pdf')")
    print("Dependencies: pip install pymupdf pdfplumber pytesseract Pillow")
