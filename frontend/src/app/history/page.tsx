"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

/* ──────────────────────────────────────────────
   Icons
   ────────────────────────────────────────────── */
function IconEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconExport() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconProductPlaceholder() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export default function AnalysisHistoryPage() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Summary');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const q = query(collection(db, "analysisHistory"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistoryData(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const stats = {
    total: historyData.length,
    completed: historyData.filter(d => d.status === "Completed").length,
    inProgress: historyData.filter(d => d.status === "In Progress").length,
    issuesFound: historyData.filter(d => d.status === "Issues Found").length,
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-12 flex relative">
      <div className={`flex-1 transition-all duration-300 ${selectedRow ? 'mr-[400px]' : ''}`}>
        
        {/* Header Banner */}
        <div className="relative bg-white h-[200px] overflow-hidden border-b border-gray-200 shadow-sm flex items-end pb-8">
          {/* Subtle Background Pattern / Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-80" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          
          <div className="relative z-10 px-8 max-w-[1400px] w-full mx-auto flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0B3558] tracking-tight">Analysis History</h1>
              <p className="text-gray-600 mt-1">View and track all your past analyses, inputs, and results</p>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 mt-[-30px] relative z-20">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {/* Total Analyses */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                  <p className="text-sm text-gray-500 font-medium">Total Analyses</p>
                </div>
              </div>
              <svg className="w-16 h-8 text-blue-400" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 30 Q 20 10, 40 20 T 80 10 L 100 0" />
              </svg>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.completed}</h3>
                  <p className="text-sm text-gray-500 font-medium">Completed</p>
                </div>
              </div>
              <svg className="w-16 h-8 text-green-400" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 35 L 20 25 L 40 30 L 60 15 L 80 20 L 100 5" />
              </svg>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.inProgress}</h3>
                  <p className="text-sm text-gray-500 font-medium">In Progress</p>
                </div>
              </div>
              <svg className="w-16 h-8 text-orange-400" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 20 Q 25 25, 50 15 T 100 10" />
              </svg>
            </div>

            {/* Issues Found */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.issuesFound}</h3>
                  <p className="text-sm text-gray-500 font-medium">Issues Found</p>
                </div>
              </div>
              <svg className="w-16 h-8 text-red-400" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 20 L 20 25 L 40 10 L 60 15 L 80 5 L 100 0" />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-end gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <IconSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search by product, keyword or report ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="w-[180px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="w-[180px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Department</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Departments</option>
                <option>Urban Development</option>
                <option>Public Works</option>
              </select>
            </div>

            <div className="w-[150px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Status</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Issues Found</option>
              </select>
            </div>

            <div className="w-[160px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Product Category</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Categories</option>
                <option>Electrical</option>
                <option>Construction</option>
              </select>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
              <IconFilter />
              Apply Filters
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Analysis History <span className="text-sm font-normal text-gray-500">({stats.total} records)</span></h2>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                <IconExport />
                Export History
              </button>
            </div>
            
            <div className="overflow-hidden w-full">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Product / Input</th>
                    <th className="px-6 py-4">Input Type</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historyData.map((row) => (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedRow?.id === row.id ? 'bg-blue-50/50' : ''}`}
                      onClick={() => setSelectedRow(row)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-500">{row.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                            <IconProductPlaceholder />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 max-w-[220px] truncate" title={row.product}>
                              {row.product.split('(')[0].trim()}
                              {row.product.includes('(') && (
                                <span className="text-xs font-normal text-gray-500 ml-1">
                                  ({row.product.split('(')[1]}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${row.inputTypeColor}`}>
                          {row.inputType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{row.date}</p>
                        <p className="text-xs text-gray-500">{row.time}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-[120px] truncate" title={row.department}>
                        {row.department}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-blue-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(row);
                          }}
                        >
                          <IconEye />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/30">
              <p className="text-sm text-gray-500">Showing 1 to 10 of 156 records</p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-medium">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">5</button>
                <span className="px-2 text-gray-500">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">16</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">&gt;</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Side Panel */}
      {selectedRow && (
        <div className="fixed top-[64px] right-0 bottom-0 w-[400px] bg-white shadow-2xl border-l border-gray-200 z-40 transform transition-transform duration-300 flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">Analysis Details</h2>
            <button 
              onClick={() => setSelectedRow(null)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IconClose />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Product Summary */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                <IconProductPlaceholder />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1.5">{selectedRow.product}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${selectedRow.statusColor}`}>
                  ✓ {selectedRow.status}
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  Report ID: REP-2026-00{selectedRow.id}<br/>
                  Date: {selectedRow.date}, {selectedRow.time}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {['Summary', 'Applicable Standards', 'Compliance', 'Report'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === tab 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Summary' && (
              <>
                {/* Input Details */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Input Details</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="text-gray-500">Input Type</span>
                      <span className="text-gray-900 font-medium">{selectedRow.inputType}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="text-gray-500">Description</span>
                      <span className="text-gray-900">Procurement of {selectedRow.product.split('(')[0].trim().toLowerCase()} for municipal roads. High efficiency, long life.</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="text-gray-500">Department</span>
                      <span className="text-gray-900">{selectedRow.department}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="text-gray-500">Category</span>
                      <span className="text-gray-900">{selectedRow.category}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="text-gray-500">Language</span>
                      <span className="text-gray-900">{selectedRow.language}</span>
                    </div>
                  </div>
                </div>

                {/* Result Summary */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Result Summary</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[150px_1fr] gap-2 text-sm items-center">
                      <span className="text-gray-500">Applicable Standards</span>
                      <span className="text-blue-600 font-bold">{selectedRow.applicableStandards}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr] gap-2 text-sm items-center">
                      <span className="text-gray-500">Compliance Status</span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide w-max
                        ${selectedRow.complianceStatus === 'Compliant' ? 'bg-green-50 text-green-600 border-green-200' : 
                          selectedRow.complianceStatus === 'Non-Compliant' ? 'bg-red-50 text-red-600 border-red-200' : 
                          'bg-orange-50 text-orange-600 border-orange-200'}
                      `}>
                        {selectedRow.complianceStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr] gap-2 text-sm items-center">
                      <span className="text-gray-500">Issues Found</span>
                      <span className={`font-bold ${selectedRow.issuesFound && selectedRow.issuesFound !== '-' && selectedRow.issuesFound > 0 ? 'text-red-500' : 'text-gray-900'}`}>{selectedRow.issuesFound}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr] gap-2 text-sm items-center">
                      <span className="text-gray-500">Recommendations</span>
                      <span className="text-orange-500 font-bold">{selectedRow.recommendations}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Applicable Standards' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Identified Standards ({selectedRow.applicableStandards})</h4>
                {selectedRow.applicableStandards > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <ul className="divide-y divide-gray-100">
                      {Array.from({ length: selectedRow.applicableStandards }).map((_, i) => (
                        <li key={i} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-3 items-start">
                            <div className="mt-0.5">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-blue-700">IS Standard 00{i + 1}</h5>
                              <p className="text-xs text-gray-600 mt-1">Recommended standard for {selectedRow.category.toLowerCase()} applications related to {selectedRow.product.split('(')[0].trim()}.</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg border border-gray-100 italic">
                    No applicable standards found for this input.
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Compliance' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Compliance Check</h4>
                
                <div className={`p-4 rounded-lg border ${selectedRow.complianceStatus === 'Compliant' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {selectedRow.complianceStatus === 'Compliant' ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </div>
                    )}
                    <h5 className={`font-bold ${selectedRow.complianceStatus === 'Compliant' ? 'text-green-800' : 'text-red-800'}`}>
                      {selectedRow.complianceStatus}
                    </h5>
                  </div>
                  <p className={`text-sm ${selectedRow.complianceStatus === 'Compliant' ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedRow.complianceStatus === 'Compliant' 
                      ? 'The input specifications align with mandatory guidelines.' 
                      : `Found ${selectedRow.issuesFound} deviation(s) from required specifications.`}
                  </p>
                </div>

                {selectedRow.issuesFound > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Action Items</h5>
                    <ul className="space-y-2">
                      {Array.from({ length: selectedRow.issuesFound === '-' ? 1 : selectedRow.issuesFound }).map((_, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-600 bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                          <span className="text-red-500 font-bold">•</span> Missing requirement related to material grade or dimensions.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Report' && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">Analysis Report</h3>
                    <p className="text-xs text-gray-500">Generated on {selectedRow.date} at {selectedRow.time}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors border border-blue-200" title="Export PDF">
                    <IconExport />
                  </button>
                </div>
                
                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</h4>
                    <p className="text-sm font-medium text-gray-900">{selectedRow.product}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</h4>
                      <p className="text-sm text-gray-900">{selectedRow.department}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</h4>
                      <p className="text-sm text-gray-900">{selectedRow.category}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Executive Summary</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      The product/input <span className="font-semibold">"{selectedRow.product.split('(')[0].trim()}"</span> was analyzed against relevant Indian Standards for the {selectedRow.department}.
                      A total of <span className="font-bold">{selectedRow.applicableStandards}</span> applicable standard(s) were identified. 
                      The overall compliance status is marked as <span className="font-bold">{selectedRow.complianceStatus}</span>.
                    </p>
                  </div>
                  
                  {selectedRow.issuesFound > 0 && (
                    <div className="bg-red-50 p-3 rounded-md border border-red-100">
                      <h4 className="text-sm font-semibold text-red-800 mb-1">Critical Issues</h4>
                      <p className="text-xs text-red-600">The procurement input is missing essential mandatory standard clauses. Immediate revision is recommended before publishing the tender.</p>
                    </div>
                  )}
                  
                  {selectedRow.complianceStatus === 'Compliant' && (
                    <div className="bg-green-50 p-3 rounded-md border border-green-100">
                      <h4 className="text-sm font-semibold text-green-800 mb-1">Passed</h4>
                      <p className="text-xs text-green-600">No major deviations found. The input fulfills the basic standard requirements.</p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommendations</h4>
                    <p className="text-sm text-gray-700">
                      {selectedRow.recommendations > 0 
                        ? `We suggest reviewing the ${selectedRow.recommendations} identified recommendation(s) to optimize the technical specifications further.` 
                        : 'No further recommendations. The document appears ready.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Panel Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
            <button 
              onClick={() => alert(`Opening full report for ${selectedRow.product}...`)}
              className="flex-1 bg-white border border-gray-300 text-blue-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <IconEye /> View Full Report
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
