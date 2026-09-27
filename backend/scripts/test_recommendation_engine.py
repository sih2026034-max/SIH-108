import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.services.recommendation_engine import get_recommendations

def test_engine():
    queries = [
        "LED street light",
        "Electrical cable",
        "Water pump",
        "Fire extinguisher",
        "Office chair",
        "Solar panel",
        "नगरपालिका सड़कों के लिए एलईडी स्ट्रीट लाइट",
        "महानगरपालिकेच्या रस्त्यांसाठी एलईडी स्ट्रीट लाईट",
        "xyz unknown product abc 123",
        "equipment",
        "LED street light for municipal roads"
    ]
    
    for q in queries:
        print(f"\n======================================")
        print(f"QUERY: {q}")
        res = get_recommendations(q, top_k=5)
        
        print(f"STATUS: {res.get('status')}")
        print(f"INTENT: {res.get('intent')}")
        
        if res.get("status") == "NO_CONFIDENT_MATCH":
            print(f"Message: {res.get('message')}")
            continue
            
        primary = res.get("primary_recommendations", [])
        alt = res.get("alternative_recommendations", [])
        
        print("\n--- PRIMARY RECOMMENDATIONS ---")
        for idx, p in enumerate(primary):
            print(f"[{idx+1}] {p['is_number']} | {p['department']} | {p['title'][:60]}...")
            print(f"    Semantic: {p['similarity_score']:.4f} | Final: {p['final_score']:.4f} | Level: {p['relevance_level']}")
            print(f"    Reason: {p['recommendation_reason']}")
            
        print("\n--- ALTERNATIVE RECOMMENDATIONS ---")
        for idx, a in enumerate(alt):
            print(f"[{idx+1}] {a['is_number']} | {a['department']} | {a['title'][:60]}...")
            print(f"    Semantic: {a['similarity_score']:.4f} | Final: {a['final_score']:.4f} | Level: {a['relevance_level']}")

if __name__ == "__main__":
    test_engine()
