import json
import os
from collections import defaultdict

FILE_PATH = "/Users/aryandate/Desktop/SIH2626 /db/master_department_wise.json"

def analyze_dataset():
    if not os.path.exists(FILE_PATH):
        print(f"Error: {FILE_PATH} not found.")
        return
        
    try:
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"JSON Parse Error: {e}")
        return

    departments = list(data.keys())
    total_standards = 0
    dept_counts = {}
    
    all_fields = set()
    field_counts = defaultdict(int)
    null_counts = defaultdict(int)
    
    unique_ids = set()
    duplicates = 0
    
    cross_ref_count = 0
    total_cross_refs = 0
    
    for dept, standards in data.items():
        dept_counts[dept] = len(standards)
        total_standards += len(standards)
        
        for std in standards:
            # Check duplicates
            std_id = std.get("normalized_id") or std.get("standard_number")
            if std_id in unique_ids:
                duplicates += 1
            else:
                unique_ids.add(std_id)
                
            # Check fields
            for key, val in std.items():
                all_fields.add(key)
                field_counts[key] += 1
                
                if val is None or val == "" or val == [] or val == {}:
                    null_counts[key] += 1
                    
            # Relationships
            if std.get("cross_references"):
                cross_ref_count += 1
                total_cross_refs += len(std.get("cross_references", []))

    print("=== DATASET ANALYSIS ===")
    print(f"Total Standards: {total_standards}")
    print(f"Total Departments: {len(departments)}")
    print(f"Duplicates: {duplicates}")
    print("\nDepartment Counts:")
    for d, c in sorted(dept_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {d}: {c}")
        
    print("\nFields found across dataset:")
    for f in sorted(list(all_fields)):
        missing = total_standards - field_counts[f] + null_counts[f]
        missing_pct = (missing / total_standards) * 100 if total_standards > 0 else 0
        print(f"  {f}: missing/null {missing} ({missing_pct:.2f}%)")
        
    print(f"\nStandards with Cross References: {cross_ref_count}")
    print(f"Total Cross References: {total_cross_refs}")

if __name__ == "__main__":
    analyze_dataset()
