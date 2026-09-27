# Compliance Engine Architecture & Documentation

## 1. Architecture & Pipeline

The Compliance Engine processes user procurement requirements and cross-references them with Indian Standards metadata available in the indexed dataset.

### Pipeline:
```
Officer Specification (product_description + technical_specification)
  ↓
Input Validation
  ↓
Recommended Standards (auto-detect via recommendation engine, or supplied)
  ↓
Available Standard Metadata (title, department, category from dataset)
  ↓
Requirement Extraction (regex/heuristic: Power, IP, Voltage, Material)
  ↓
Specification-to-Standard Comparison
  ↓
Evidence Mapping (verify against standard title/metadata)
  ↓
Compliance Classification (COMPLIANT / INSUFFICIENT_DATA / etc.)
  ↓
Missing Information & Verification Warnings
  ↓
Compliance Report
```

## 2. Input Format

**API Endpoint:** `POST /api/compliance/check`

**Request Body:**
```json
{
  "product_description": "LED street light for municipal roads",
  "technical_specification": "100W, IP66 protection, Aluminium housing",
  "recommended_standards": ["IS 16107 (Part 2/Sec 2):2017"]  // optional
}
```

If `recommended_standards` is omitted, the engine automatically calls the recommendation engine to identify applicable standards.

## 3. Requirement Extraction

The engine extracts explicit technical parameters from the combined input text using deterministic regex patterns:
- **Power Rating**: `(\d+)\s*(W|Watt|kW)` → e.g., "100W"
- **Ingress Protection**: `(IP\s*\d{2})` → e.g., "IP66"
- **Voltage**: `(\d+)\s*(V|kV|Volts)` → e.g., "230V"
- **Material**: checks for known material keywords (aluminium, copper, PVC, steel, plastic, iron)

**No LLM generation.** Requirements are extracted deterministically. No synthetic or hallucinated parameters.

## 4. Evidence Model

For each extracted requirement, the engine checks whether the standard's metadata (primarily the `title` field) explicitly contains evidence for it.

- If the submitted value appears in the standard title → `COMPLIANT`
- Otherwise → `INSUFFICIENT_DATA` (NOT `NON_COMPLIANT`)

This is the core safety rule: **Missing data ≠ Non-compliance.**

## 5. Compliance States

| Status | Meaning |
|--------|---------|
| `COMPLIANT` | The submitted requirement is supported by available standard evidence |
| `PARTIALLY_COMPLIANT` | Some requirements verified, others cannot be |
| `NON_COMPLIANT` | Explicit evidence of conflict (rare with current dataset) |
| `INSUFFICIENT_DATA` | Required standard information is missing from dataset |
| `VERIFY_REQUIRED` | Requires authoritative verification outside the dataset |

## 6. Coverage Calculation

```
coverage_score = verified_requirements / total_extracted_requirements
```

This is NOT labeled as a "probability" or "% compliant." It represents only the fraction of submitted requirements that could be verified against available data.

## 7. Missing-Data Handling

When the dataset lacks scope, description, or detailed technical parameters for a standard (which is the case for ~96% of records), the engine:
- Returns `INSUFFICIENT_DATA` for each unverifiable requirement
- Lists explicit "missing_information" entries
- Lists "verification_required" items for certification/version checks
- Never fabricates technical limits

## 8. Certification Handling

```json
{
  "status": "VERIFY_REQUIRED",
  "message": "Certification requirements not available in dataset."
}
```

The engine never claims "BIS certification mandatory" without evidence.

## 9. Version Handling

```json
{
  "status": "VERIFY_REQUIRED",
  "message": "Version/edition recency requires external authoritative check."
}
```

The engine never claims a standard is "the latest version" unless the dataset explicitly contains that information.

## 10. Traceability

Every standard in the response includes:
- `is_number` — the standard number
- `title` — the standard title
- `source_record_id` — traceable ID to the normalized dataset
- `source_file` — original data file

Every requirement finding identifies its evidence source.

## 11. Known Limitations

1. The dataset primarily contains standard **titles**, **departments**, and **categories**. Detailed technical scope, testing procedures, and normative references are unavailable for ~96% of records.
2. As a result, most technical requirements (Power, IP, Material, Voltage) default to `INSUFFICIENT_DATA`.
3. This is intentional and correct. The engine is designed to be honest about what it can and cannot verify.
4. Future enrichment of the dataset with scope text, test method references, and certification data will dramatically increase the engine's coverage score.

## 12. Safety Disclaimer

All compliance results include:
> "Compliance results are based on the information available in the current dataset and should be verified against the latest authoritative BIS standard before final procurement use."
