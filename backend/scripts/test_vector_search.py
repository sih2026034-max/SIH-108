import sys
import os

# Add root directory to python path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.services.vector_search import vector_service

def test_queries():
    print("Initializing Vector Search Service...")
    if not vector_service.is_available():
        print("ERROR: Vector search service could not be loaded. Please ensure the index is built.")
        sys.exit(1)
        
    print(f"Service loaded successfully. Indexed records: {vector_service.get_indexed_count()}")
    
    test_cases = [
        {"desc": "English", "query": "LED street light for outdoor roads"},
        {"desc": "Hindi", "query": "नगरपालिका सड़कों के लिए एलईडी स्ट्रीट लाइट"},
        {"desc": "Marathi", "query": "महानगरपालिकेच्या रस्त्यांसाठी एलईडी स्ट्रीट लाईट"},
        {"desc": "Electrical", "query": "power cable for building electrical installation"},
        {"desc": "Mechanical", "query": "industrial water pump"},
        {"desc": "Filtering by Department", "query": "power cable for building electrical installation", "filters": {"department": "ETD"}}
    ]
    
    for case in test_cases:
        print(f"\n--- Testing {case['desc']} ---")
        print(f"Query: {case['query']}")
        filters = case.get("filters")
        if filters:
            print(f"Filters: {filters}")
            
        try:
            results = vector_service.search_standards(case['query'], top_k=3, filters=filters)
            if not results:
                print("No results found.")
            else:
                for r in results:
                    print(f"[{r['rank']}] Score: {r['similarity_score']:.4f} | IS: {r['is_number']} | Dept: {r['department']}")
                    print(f"    Title: {r['title'][:100]}...")
        except Exception as e:
            print(f"ERROR: {e}")
            
    print("\nTest completed.")

if __name__ == "__main__":
    test_queries()
