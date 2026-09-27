import fs from 'fs';

const filePath = 'frontend/src/app/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove mock import
content = content.replace(
  'import { getRecommendations } from "../services/recommendationEngine";',
  '// using real backend now'
);

// 2. Add new state
content = content.replace(
  'const [analysis, setAnalysis] = useState<any>(null);',
  'const [analysis, setAnalysis] = useState<any>(null);\n  const [backendData, setBackendData] = useState<any>(null);'
);

// 3. Update handleSearch
const newHandleSearch = `
    try {
      const res = await fetch(\`\${API_BASE}/api/recommend\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, top_k: 5 })
      });
      const data = await res.json();
      
      if (data.status === "SUCCESS") {
        setBackendData(data);
        setAnalysis({
          category: data.intent?.product || "Unknown",
          specifications: data.intent?.technical_terms?.join(", ") || "None",
          sector: data.intent?.domain || "General",
        });
        saveToHistory(q, [...data.primary_recommendations, ...data.alternative_recommendations], [], data.intent?.domain || "Unknown", data.primary_recommendations[0]?.is_number || "N/A");
      } else {
        setBackendData(data); // for NO_CONFIDENT_MATCH
        setAnalysis(null);
        saveToHistory(q, [], [], "No match", "N/A");
      }
    } catch(err) {
      setErrorMsg("Failed to connect to backend recommendation engine.");
    }
`;

content = content.replace(
  /const recs = getRecommendations\(q\);[\s\S]*?saveToHistory\(q, \[\], \[\], "No match", "N\/A"\);\s*\}/,
  newHandleSearch.trim()
);

// 4. Update JSX Results rendering
const oldResultsRender = `{(!results || results.length === 0) ? (`;
const newResultsRender = `{(!backendData || backendData.status !== "SUCCESS") ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold text-[#0B3558] mb-2">{backendData?.message || "No matching standard found in the current dataset."}</h3>
              <p className="text-[#667085] mb-4">Try a more specific procurement description, for example:</p>
              <div className="flex justify-center gap-3">
                <span className="px-3 py-1 bg-gray-100 rounded text-sm text-[#0B3558]">5 HP water pump</span>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm text-[#0B3558]">TMT steel</span>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm text-[#0B3558]">uPVC pipe</span>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm text-[#0B3558]">solar PV module</span>
              </div>
            </div>
          ) : (
            <>
              {/* SEARCH ANALYSIS */}
              <div>
                <h3 className="text-sm font-bold text-[#667085] uppercase tracking-wider mb-3">Search Analysis</h3>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-8">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Query</span>
                    <span className="font-semibold text-[#0B3558]">{backendData.query}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Detected Intent</span>
                    <span className="font-semibold text-[#0B3558]">{backendData.intent?.product}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Keywords</span>
                    <span className="font-semibold text-[#0B3558]">{backendData.intent?.technical_terms?.join(", ") || "None"}</span>
                  </div>
                </div>
              </div>

              {/* PRIMARY RECOMMENDATIONS */}
              <div>
                <h3 className="text-sm font-bold text-[#667085] uppercase tracking-wider mb-3">Primary Recommended Standards</h3>
                <div className="grid gap-4">
                  {backendData.primary_recommendations.map((r: any, i: number) => (
                    <div key={i} className="p-6 rounded-xl bg-white border-2 border-[#16A34A]/50 hover:border-[#16A34A] hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-[#0B3558] text-white text-xs font-bold px-2 py-1 rounded">Primary IS</span>
                          <h3 className="text-xl font-bold text-[#0B3558]">{r.is_number}</h3>
                          <span className={\`px-2.5 py-0.5 rounded text-xs font-bold uppercase \${r.relevance_level === 'HIGH' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}\`}>
                            {r.relevance_level} RELEVANCE ({r.final_score})
                          </span>
                        </div>
                        <p className="text-[#172033] font-medium mb-1">{r.title}</p>
                        <p className="text-sm text-[#667085] mb-2"><span className="font-semibold text-gray-500">Why recommended:</span> {r.recommendation_reason}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                           <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Dept: {r.department || 'N/A'}</span>
                           <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Category: {r.category || 'N/A'}</span>
                           <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">Version: {r.version_information?.edition || 'N/A'}</span>
                           <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-200">Cert: {r.certification_information?.status || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ALTERNATIVE RECOMMENDATIONS */}
              {backendData.alternative_recommendations?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-[#667085] uppercase tracking-wider mb-3">Alternative / Related Standards</h3>
                <div className="grid gap-4">
                  {backendData.alternative_recommendations.map((r: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl bg-white border border-gray-200 hover:border-[#0B3558] hover:shadow-sm transition-all duration-300 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#0B3558]">{r.is_number}</h3>
                          <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-gray-100 text-gray-600">
                            {r.relevance_level} RELEVANCE ({r.final_score})
                          </span>
                        </div>
                        <p className="text-[#172033] text-sm font-medium mb-1">{r.title}</p>
                        <p className="text-xs text-[#667085]"><span className="font-semibold text-gray-500">Why recommended:</span> {r.recommendation_reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
`;

content = content.replace(/\{\(!results \|\| results\.length === 0\) \? \([\s\S]*?\{results\.map\(\(r, i\) => \([\s\S]*?\}\)[\s\S]*?<\/div>[\s\S]*?<\/div>/, newResultsRender);

fs.writeFileSync(filePath, content);
console.log("Replaced frontend successfully.");
