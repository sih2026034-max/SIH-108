"use client";
import React, { useState, useEffect } from "react";

// Placeholder icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);
const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const ViewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

export default function StandardsSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedStandard, setSelectedStandard] = useState<any | null>(null);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Active"]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("All Years");
  const [triggerFetch, setTriggerFetch] = useState(0);

  const popularSearches = ["LED Street Light", "Cement", "Steel", "Electrical Cable", "Water Pump", "Solar Module", "Transformer", "Fire Safety", "More ⌄"];

  const deptMap: Record<string, string> = {
    "LITD": "Electronics & IT",
    "MTD": "Metallurgical Engineering",
    "MHD": "Medical Equipment & Hospital Planning",
    "CED": "Civil Engineering",
    "TXD": "Textile",
    "PCD": "Petroleum, Coal & Related Products",
    "FAD": "Food & Agriculture",
    "CHD": "Chemical",
    "PGD": "Production & General Engineering",
    "ETD": "Electrotechnical",
    "MED": "Mechanical Engineering",
    "WRD": "Water Resources",
    "AYD": "Ayush",
    "MSD": "Management System",
    "EED": "Environment & Ecology",
    "SSD": "Service Sector",
    "UNKNOWN": "Others"
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const url = new URL(`${API_BASE}/api/standards/directory`);
        if (selectedDept && selectedDept !== "All Departments") url.searchParams.append("department", selectedDept);
        if (selectedStatuses.length > 0 && !selectedStatuses.includes("All")) url.searchParams.append("status", selectedStatuses.join(","));
        if (selectedTypes.length > 0) url.searchParams.append("standard_type", selectedTypes.join(","));
        if (selectedYear !== "All Years") url.searchParams.append("year", selectedYear);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", "20");

        const res = await fetch(url.toString());
        const data = await res.json();
        setResults(data.results || []);
        // Only update departments if not yet loaded
        setDepartments(prev => {
          if (prev.length > 0) return prev;
          const sortedDepts = [...(data.departments || [])].sort((a, b) => {
            if (a === "UNKNOWN") return 1;
            if (b === "UNKNOWN") return -1;
            const nameA = deptMap[a] || a;
            const nameB = deptMap[b] || b;
            return nameA.localeCompare(nameB);
          });
          return ["All Departments", ...sortedDepts];
        });
        setTotalResults(data.total_results || 0);
      } catch (err) {
        console.error("Failed to fetch directory:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedDept, page, triggerFetch]);

  const handleStatusChange = (status: string) => {
    if (status === "All") {
      setSelectedStatuses(["All"]);
      return;
    }
    setSelectedStatuses(prev => {
      let next = prev.filter(s => s !== "All");
      if (next.includes(status)) next = next.filter(s => s !== status);
      else next = [...next, status];
      if (next.length === 0) next = ["All"];
      return next;
    });
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) return prev.filter(t => t !== type);
      return [...prev, type];
    });
  };

  const applyFilters = () => {
    setPage(1);
    setTriggerFetch(t => t + 1);
  };

  const clearFilters = () => {
    setSelectedDept("All Departments");
    setSelectedStatuses(["All"]);
    setSelectedTypes([]);
    setSelectedYear("All Years");
    setPage(1);
    setTriggerFetch(t => t + 1);
  };

  return (
    <div className="min-h-screen bg-[#EEF2F7] pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 pt-8 pb-8 px-6 relative overflow-hidden">
        {/* Background building silhouette (placeholder) */}
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none w-1/3 h-full bg-cover bg-no-repeat bg-right-bottom" style={{ backgroundImage: "url('/building.png')" }}>
        </div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <h1 className="text-3xl font-extrabold text-[#0B3558] mb-2 tracking-tight">Standards Search</h1>
          <p className="text-gray-600 mb-6 font-medium">Search Indian Standards by number, product, title or category</p>
          
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden max-w-4xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <div className="pl-4 flex items-center text-gray-400">
              <SearchIcon />
            </div>
            <input 
              type="text" 
              placeholder="Search by IS number, product name, standard title, keyword..."
              className="flex-1 px-4 py-3.5 outline-none text-gray-700 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#1565C0] hover:bg-blue-700 text-white px-8 py-3.5 font-semibold text-sm flex items-center gap-2 transition-colors">
              <SearchIcon />
              Search
            </button>
          </div>
          
          <div className="flex items-center gap-3 mt-5 flex-wrap text-sm">
            <span className="text-gray-600 font-semibold text-xs">Popular Searches:</span>
            {popularSearches.map((term, i) => (
              <span key={i} className={`px-3 py-1 rounded border text-xs font-medium cursor-pointer transition-colors ${term === 'LED Street Light' ? 'bg-blue-50 border-blue-200 text-[#1565C0]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="flex items-center gap-2 text-[#0B3558] font-bold text-base mb-5">
              <FilterIcon />
              Filter Standards
            </h2>
            
            {/* Category */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Category (Department)</label>
              <select 
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:border-blue-500"
              >
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>{dept === "All Departments" ? dept : (deptMap[dept] || dept)}</option>
                ))}
              </select>
            </div>
            
            {/* Sub Category */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Sub Category</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:border-blue-500">
                <option>Lighting</option>
              </select>
            </div>
            
            {/* Status */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-2">Status</label>
              <div className="space-y-2.5">
                {['Active', 'Revised', 'Withdrawn', 'All'].map((status) => (
                  <label key={status} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedStatuses.includes(status)} 
                        onChange={() => handleStatusChange(status)}
                        className="w-4 h-4 text-[#1565C0] rounded border-gray-300 focus:ring-[#1565C0]" 
                      />
                      <span className="text-sm text-gray-700 group-hover:text-black">{status}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Standard Type */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-2">Standard Type</label>
              <div className="space-y-2.5">
                {['Product Standard', 'Test Method Standard', 'Safety Standard', 'Installation Standard', 'Terminology Standard', 'Method of Sampling', 'Allied Standard'].map((type, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)} 
                      onChange={() => handleTypeChange(type)}
                      className="w-4 h-4 text-[#1565C0] rounded border-gray-300 focus:ring-[#1565C0]" 
                    />
                    <span className="text-sm text-gray-700 group-hover:text-black">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Year */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Year (Edition)</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:border-blue-500"
              >
                <option value="All Years">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2">
              <button onClick={clearFilters} className="flex-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md py-2 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"></path><path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path></svg>
                Clear Filters
              </button>
              <button onClick={applyFilters} className="flex-1 bg-[#1565C0] text-white hover:bg-blue-700 rounded-md py-2 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors">
                <FilterIcon />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Content - Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Table Header Controls */}
            <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-white">
              <h2 className="text-[#0B3558] font-bold text-lg flex items-center gap-2">
                Search Results <span className="text-xs font-normal text-gray-500 mt-1">({totalResults.toLocaleString()} standards found)</span>
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Sort by:</span>
                  <select className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white outline-none focus:border-blue-500">
                    <option>Relevance</option>
                  </select>
                </div>
                <button className="border border-gray-300 bg-white text-[#1565C0] hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors">
                  <ExportIcon />
                  Export Results
                </button>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f8fafc] text-[#0B3558] text-xs font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3.5">IS Number</th>
                    <th className="px-4 py-3.5">Standard Title</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Latest Version</th>
                    <th className="px-4 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-500">Loading standards from master data...</td></tr>
                  ) : results.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-500">No standards found.</td></tr>
                  ) : results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-4 font-bold text-[#1565C0]">{row.id ? row.id : <span className="text-gray-400 font-normal italic">Coming Soon</span>}</td>
                      <td className="px-4 py-4 whitespace-normal min-w-[200px] max-w-[320px] text-gray-800 text-xs leading-relaxed font-medium">{row.title ? row.title : <span className="text-gray-400 italic">Title data coming soon</span>}</td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-[11px] font-semibold border border-blue-100">{deptMap[row.category] || row.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                          row.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                          row.status === 'Revised' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 font-medium">{row.version}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedStandard(row)}
                            className="flex items-center gap-1.5 border border-blue-200 text-[#1565C0] hover:bg-blue-50 px-2.5 py-1.5 rounded text-xs font-semibold transition-colors"
                          >
                            <ViewIcon /> View
                          </button>
                          <button 
                            onClick={() => alert(`Downloading PDF for ${row.id} is coming soon!`)}
                            className="flex items-center gap-1.5 border border-gray-200 text-[#1565C0] hover:bg-gray-50 px-2.5 py-1.5 rounded text-xs font-semibold transition-colors"
                          >
                            <DownloadIcon /> Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600 bg-white mt-auto">
              <div>Showing {totalResults === 0 ? 0 : (page - 1) * 20 + 1} to {Math.min(page * 20, totalResults)} of {totalResults.toLocaleString()} standards</div>
              <div className="flex gap-1 items-center">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-gray-500 font-bold disabled:opacity-50"
                >&lt;</button>
                <button className="px-3 h-8 flex items-center justify-center border border-blue-600 bg-[#1565C0] text-white rounded font-bold shadow-sm">
                  {page}
                </button>
                <span className="px-1 text-gray-400">...</span>
                <button 
                  disabled={page * 20 >= totalResults}
                  onClick={() => setPage(p => p + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-gray-500 font-bold disabled:opacity-50"
                >&gt;</button>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
      
      {/* Standard Details Modal */}
      {selectedStandard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-[#0B3558] text-lg">Standard Details</h3>
              <button onClick={() => setSelectedStandard(null)} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100 mt-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#1565C0] mb-1">{selectedStandard.id}</h4>
                  <p className="text-gray-800 font-medium leading-relaxed">{selectedStandard.title}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Category (Department)</span>
                  <span className="font-semibold text-gray-800">{deptMap[selectedStandard.category] || selectedStandard.category}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${
                          selectedStandard.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                          selectedStandard.status === 'Revised' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                    {selectedStandard.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Latest Version</span>
                  <span className="font-semibold text-gray-800">{selectedStandard.version}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Certification Type</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Coming Soon
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50/50 rounded-lg p-5 border border-blue-100/50">
                <h5 className="font-bold text-[#0B3558] mb-2 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  Scope / Abstract
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  Information regarding scope is not fully available yet. Coming soon in the next dataset update.
                </p>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedStandard(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  alert(`Downloading PDF for ${selectedStandard.id} is coming soon!`);
                }}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <DownloadIcon />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
