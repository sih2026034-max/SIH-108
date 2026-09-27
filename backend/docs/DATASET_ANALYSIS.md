# Dataset Analysis Report: Indian Standards Master Dataset

## 1. Dataset Structure Overview
- **File Analyzed**: `db/master_department_wise.json`
- **Format**: JSON (Object mapped by Department Code containing arrays of standards)
- **Total Standards**: 12,494
- **Total Departments**: 17

### Department List and Record Counts:
| Department Code | Name / Identifier | Standards Count |
|-----------------|-------------------|-----------------|
| PGD | Production and General Engineering | 1,498 |
| FAD | Food and Agriculture | 1,244 |
| MHD | Metallurgical Engineering | 1,238 |
| ETD | Electrotechnical | 1,236 |
| LITD | Electronics and IT | 1,220 |
| CHD | Chemical | 959 |
| CED | Civil Engineering | 939 |
| MTD | Management and Systems | 755 |
| TXD | Textile | 753 |
| MED | Mechanical Engineering | 731 |
| PCD | Petroleum and Coal | 671 |
| MSD | Management and Systems (alternative) | 399 |
| AYD | Ayush | 339 |
| WRD | Water Resources | 226 |
| SSD | Service Sector | 173 |
| EED | Electrotechnical (alternative) | 108 |
| UNKNOWN | Unclassified | 5 |

## 2. Common Schema & Field Mapping
The common fields found across the dataset map to the required AI Recommendation Engine entities as follows:

| Feature required | Mapped JSON Field |
|-------------------------------------|--------------------------------|
| IS Number / Standard Number | `standard_number` / `normalized_id` |
| Standard Title | `title` |
| Description / Scope | `scope` |
| Product Category | `ics_code` |
| Department | `department_code`, `department_name` |
| Scope | `scope` |
| Keywords | *(Not present - needs LLM extraction)* |
| Technical Parameters | *(Not present - needs LLM extraction)* |
| Normative References / Allied | `cross_references` |
| Test Methods | `standard_type` (e.g., "Methods of Tests") |
| Safety Standards | *(Implicit in title / scope)* |
| Installation Standards | *(Implicit in title / scope)* |
| Revision/Edition | `revision_count` |
| Amendments | *(Implicit in title/publish_date)* |
| Status | *(Derived from review_date)* |
| Certification requirements | *(Not present - needs external mapping)* |

## 3. Data Quality & Consistency Analysis

### Missing/Null Values Analysis (across 12,494 records):
- **High Completion (>99%)**: `standard_number`, `title`, `department_code`, `publish_date`, `bis_id`, `preview_url`
- **Moderate Missing Rates**:
  - `review_date`: Missing in 3,832 records (30.67%)
- **Critical Missing Rates**:
  - `ics_code`: Missing in 9,571 records (76.60%)
  - `technical_committee`: Missing in 9,655 records (77.28%)
  - `scope`: Missing in 11,853 records (94.87%)
  - `cross_references`: Missing in 12,067 records (96.58%)

### Duplicate Analysis:
- **Duplicates Found**: 4 standards share the exact same `normalized_id` / `standard_number`.

### Standard Relationship Analysis:
- **Standards with Cross References**: 427 (only 3.4% of total)
- **Total Cross References Detected**: 3,545
- **Observation**: The normative graph is highly sparse. To build a reliable allied-standards recommendation engine, cross-references must be augmented.

### Inconsistent Field Names / Malformed JSON:
- No malformed JSON structures were found (the file parsed successfully).
- The dataset contains some raw unparsed fields (`raw_standard_number`, `raw_standard_title`, `raw_department_name`) which are entirely null (99.96%) and can be safely dropped in favor of the parsed fields (`standard_number`, `title`, `department_name`).

## 4. Recommendations for Backend Data Processing
1. **Semantic Augmentation Needed**: The lack of `scope` (94% missing) and `keywords` means the title is the primary semantic anchor. We need to pass the titles through Gemini Flash to generate synthetic descriptions/keywords for better vector search.
2. **Graph Densification**: The low count of `cross_references` (3.4% population) severely impacts the graph recommendation requirement. An LLM agent (Agent C/Graph ETL) should attempt to extract normative references from the textual titles or fetch them via another source.
3. **Data Unnesting**: The current JSON is deeply nested by department. It must be flattened into `.jsonl` (JSON Lines) to be compatible with `Agent B`'s existing Postgres pgvector ETL pipeline (`etl_load.py`).

## 5. Proposed Normalized Schema for AI Recommendation Engine

For the Postgres / pgvector backend, we recommend the following normalized schema:

```sql
CREATE TABLE standards (
    id SERIAL PRIMARY KEY,
    normalized_id VARCHAR(255) UNIQUE NOT NULL,
    standard_number VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    department_code VARCHAR(50),
    standard_type VARCHAR(100), -- E.g., Terminology, Methods of tests
    publish_date DATE,
    review_date DATE,
    revision_count INT DEFAULT 0,
    ics_code VARCHAR(100),
    scope TEXT,
    preview_url TEXT,
    
    -- AI Generated / Augmented Fields
    generated_keywords TEXT[],
    is_mandatory_certification BOOLEAN DEFAULT FALSE,
    embedding VECTOR(1024) -- For BAAI/bge-m3 dense retrieval
);

CREATE TABLE standard_edges (
    id SERIAL PRIMARY KEY,
    from_normalized_id VARCHAR(255) REFERENCES standards(normalized_id),
    to_normalized_id VARCHAR(255) REFERENCES standards(normalized_id),
    edge_type VARCHAR(100), -- E.g., 'TEST_METHOD_FOR', 'NORMATIVE', 'SAFETY_FOR'
    source_url TEXT,
    UNIQUE (from_normalized_id, to_normalized_id, edge_type)
);
```
