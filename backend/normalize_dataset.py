import json
import os
import re
from collections import defaultdict
import uuid
import uuid

INPUT_FILE = "db/master_department_wise.json"
OUTPUT_DIR = "data/processed"
DEPT_OUTPUT_DIR = "data/processed/by_department"
DOCS_DIR = "docs"
BACKEND_SCRIPTS_DIR = "backend/scripts"

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

ensure_dir(OUTPUT_DIR)
ensure_dir(DEPT_OUTPUT_DIR)
ensure_dir(DOCS_DIR)
ensure_dir(BACKEND_SCRIPTS_DIR)

def clean_text(text):
    if not text: return text
    if not isinstance(text, str): return str(text)
    return " ".join(text.split()).strip()

def normalize():
    print(f"Loading {INPUT_FILE}...")
    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Failed to load dataset: {e}")
        return

    normalized_standards = []
    departments_info = {}
    
    # Stats
    total_records = 0
    missing_scope = 0
    missing_desc = 0
    missing_keywords = 0
    missing_ics = 0
    missing_cross_refs = 0
    missing_status = 0
    missing_edition = 0
    invalid_records = 0
    empty_records = 0
    
    # Duplicate tracking
    is_number_map = defaultdict(list)
    title_map = defaultdict(list)
    exact_map = defaultdict(list)
    
    departments = list(data.keys())
    
    for dept_code, standards in data.items():
        if not standards:
            continue
        
        dept_name = standards[0].get("department_name", dept_code)
        departments_info[dept_code] = {
            "department_id": dept_code,
            "department_name": dept_name,
            "record_count": len(standards),
            "source_mapping": dept_code
        }
        
        dept_standards = []
        
        for record in standards:
            total_records += 1
            if not record:
                empty_records += 1
                continue
                
            orig_id = record.get("normalized_id", record.get("bis_id", str(uuid.uuid4())))
            internal_id = f"NORM_{orig_id}"
            
            raw_is = clean_text(record.get("standard_number", ""))
            raw_title = clean_text(record.get("title", ""))
            raw_scope = clean_text(record.get("scope"))
            raw_ics = clean_text(record.get("ics_code"))
            cross_refs = record.get("cross_references", [])
            
            if not raw_is:
                invalid_records += 1
            
            # Simple edition extraction from end of standard number (e.g. :2020)
            edition = None
            if raw_is:
                match = re.search(r':\s*(\d{4})$', raw_is)
                if match:
                    edition = match.group(1)
            
            revision = record.get("revision_count")
            
            # search_text
            search_parts = [raw_is, raw_title, dept_code, dept_name, raw_scope, raw_ics]
            search_text = " ".join([p for p in search_parts if p])
            
            norm_rec = {
                "id": internal_id,
                "is_number": raw_is,
                "title": raw_title,
                "department": dept_code,
                "category": record.get("standard_type"), 
                "scope": raw_scope if raw_scope else None,
                "description": None, # Source has no distinct description field besides scope
                "keywords": [],
                "ics_code": raw_ics if raw_ics else None,
                "status": None, # Not clearly present
                "edition": edition,
                "revision": revision,
                "amendments": [],
                "cross_references": cross_refs if cross_refs else [],
                "normative_references": [],
                "related_standards": [],
                "test_standards": [],
                "safety_standards": [],
                "installation_standards": [],
                "certification_requirements": [],
                "source_file": "master_department_wise.json",
                "source_record_id": str(orig_id),
                "search_text": search_text
            }
            
            # Completeness logic
            fields_to_check = [
                "is_number", "title", "department", "category", "scope",
                "description", "keywords", "ics_code", "status", "edition", "revision",
                "amendments", "cross_references", "normative_references", "related_standards",
                "test_standards", "safety_standards", "installation_standards", "certification_requirements"
            ]
            
            filled_fields = 0
            for f in fields_to_check:
                val = norm_rec[f]
                if val is not None and val != "" and val != []:
                    filled_fields += 1
                    
            completeness = round((filled_fields / len(fields_to_check)) * 100, 2)
            norm_rec["data_completeness"] = completeness
            
            # Tracking for Data Quality
            if not norm_rec["scope"]: missing_scope += 1
            if not norm_rec["description"]: missing_desc += 1
            if not norm_rec["keywords"]: missing_keywords += 1
            if not norm_rec["ics_code"]: missing_ics += 1
            if not norm_rec["cross_references"]: missing_cross_refs += 1
            if not norm_rec["status"]: missing_status += 1
            if not norm_rec["edition"]: missing_edition += 1
            
            # Tracking for Duplicates
            is_number_map[norm_rec["is_number"]].append(norm_rec)
            title_map[norm_rec["title"].lower()].append(norm_rec)
            exact_str = f"{norm_rec['is_number']}|{norm_rec['title']}|{norm_rec['department']}"
            exact_map[exact_str].append(norm_rec)
            
            normalized_standards.append(norm_rec)
            dept_standards.append(norm_rec)
            
        # Write dept file
        with open(os.path.join(DEPT_OUTPUT_DIR, f"{dept_code}.json"), "w", encoding="utf-8") as out_f:
            json.dump(dept_standards, out_f, indent=2, ensure_ascii=False)

    # Output normalized_standards
    with open(os.path.join(OUTPUT_DIR, "normalized_standards.json"), "w", encoding="utf-8") as f:
        json.dump(normalized_standards, f, indent=2, ensure_ascii=False)
        
    # Output departments
    with open(os.path.join(OUTPUT_DIR, "departments.json"), "w", encoding="utf-8") as f:
        json.dump(list(departments_info.values()), f, indent=2, ensure_ascii=False)
        
    # Process duplicates
    duplicates_md = ["# Duplicate Analysis\n"]
    dup_count = 0
    for is_num, recs in is_number_map.items():
        if len(recs) > 1 and is_num:
            # Check if they are exact
            first = recs[0]
            is_exact = all(r["title"] == first["title"] and r["department"] == first["department"] for r in recs)
            dup_type = "Exact Duplicate" if is_exact else "Same IS Number Duplicate"
            
            dup_count += (len(recs) - 1)
            duplicates_md.append(f"## {dup_type}: {is_num}")
            for r in recs:
                duplicates_md.append(f"- ID: {r['id']}, Title: {r['title']}, Dept: {r['department']}")
            duplicates_md.append(f"**Recommended Action**: {'Merge records if identical' if is_exact else 'Review manually for versioning or distinct entity conflicts'}\n")
            
    with open(os.path.join(DOCS_DIR, "DUPLICATE_ANALYSIS.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(duplicates_md))

    # Data Quality Report
    dq_md = [
        "# Data Quality Report",
        f"- Total records: {total_records}",
        f"- Total departments: {len(departments)}",
        "- Records per department:"
    ]
    for d, info in departments_info.items():
        dq_md.append(f"  - {d}: {info['record_count']}")
    
    dq_md.extend([
        f"- Missing scope count: {missing_scope}",
        f"- Missing description count: {missing_desc}",
        f"- Missing keywords count: {missing_keywords}",
        f"- Missing ICS code count: {missing_ics}",
        f"- Missing cross-reference count: {missing_cross_refs}",
        f"- Missing status count: {missing_status}",
        f"- Missing edition/year count: {missing_edition}",
        f"- Duplicate count: {dup_count}",
        f"- Invalid records (missing standard number): {invalid_records}",
        f"- Empty records: {empty_records}"
    ])
    
    # average completeness
    if len(normalized_standards) > 0:
        avg_comp = sum(r["data_completeness"] for r in normalized_standards) / len(normalized_standards)
        dq_md.append(f"- Average Data Completeness: {avg_comp:.2f}%")
        
    with open(os.path.join(DOCS_DIR, "DATA_QUALITY_REPORT.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(dq_md))
        
    # Dataset Statistics
    field_comp = {
        "is_number": total_records - invalid_records,
        "title": total_records,
        "scope": total_records - missing_scope,
        "description": total_records - missing_desc,
        "keywords": total_records - missing_keywords,
        "ics_code": total_records - missing_ics,
        "cross_references": total_records - missing_cross_refs,
        "status": total_records - missing_status,
        "edition": total_records - missing_edition
    }
    
    stats = {
        "total_standards": total_records,
        "total_departments": len(departments),
        "departments": {d: info["record_count"] for d, info in departments_info.items()},
        "field_completeness": field_comp,
        "duplicates": dup_count,
        "processable_records": len(normalized_standards)
    }
    
    with open(os.path.join(OUTPUT_DIR, "dataset_statistics.json"), "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
        
    print("Normalization complete.")

if __name__ == "__main__":
    normalize()
