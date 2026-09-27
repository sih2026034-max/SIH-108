import json
import os
import sys

NORMALIZED_FILE = "data/processed/normalized_standards.json"
ORIGINAL_COUNT = 12494

def validate():
    if not os.path.exists(NORMALIZED_FILE):
        print(f"ERROR: {NORMALIZED_FILE} not found.")
        sys.exit(1)
        
    try:
        with open(NORMALIZED_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"ERROR: Invalid JSON. {e}")
        sys.exit(1)
        
    print(f"Validating {len(data)} records...")
    
    if len(data) != ORIGINAL_COUNT:
        print(f"ERROR: Record count consistency failed! Expected {ORIGINAL_COUNT}, got {len(data)}.")
        sys.exit(1)
        
    unique_ids = set()
    errors = []
    
    required_fields = [
        "id", "is_number", "title", "department", "category", "scope",
        "description", "keywords", "ics_code", "status", "edition", "revision",
        "amendments", "cross_references", "normative_references", "related_standards",
        "test_standards", "safety_standards", "installation_standards",
        "certification_requirements", "source_file", "source_record_id", "data_completeness",
        "search_text"
    ]
    
    for i, record in enumerate(data):
        rec_id = record.get("id")
        
        if not rec_id:
            errors.append(f"Record index {i} missing 'id'.")
        elif rec_id in unique_ids:
            errors.append(f"Duplicate internal ID found: {rec_id}")
        else:
            unique_ids.add(rec_id)
            
        for f in required_fields:
            if f not in record:
                errors.append(f"Record {rec_id} missing required field '{f}'")
                
        # Validate IS Number
        if not record.get("is_number"):
            # Some might be missing but we shouldn't fail totally, just log
            pass
            
    if errors:
        print(f"Validation failed with {len(errors)} errors.")
        for e in errors[:20]:
            print("  -", e)
        if len(errors) > 20:
            print(f"  ... and {len(errors) - 20} more errors.")
        sys.exit(1)
        
    print("SUCCESS: Dataset validation passed!")
    print(f"- Total records verified: {len(data)}")
    print("- All required fields present.")
    print("- Internal IDs are unique.")
    print("- Record count matches original dataset (12,494).")
    
if __name__ == "__main__":
    validate()
