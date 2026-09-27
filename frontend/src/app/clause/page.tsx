"use client";
import React, { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function IconDocumentText() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function ClausePage() {
  const [standardIds, setStandardIds] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!standardIds.trim()) {
      setErrorMsg("Please enter at least one standard ID.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    
    const ids = standardIds.split(",").map((s) => s.trim()).filter(Boolean);
    try {
      const res = await fetch(`${API_BASE}/clause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standard_ids: ids }),
      });
      if (!res.ok) {
        throw new Error("Failed to generate clause.");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-12">
      {/* Breadcrumbs */}
      <div className="px-8 py-3 text-xs font-semibold text-gray-500 max-w-[1500px] mx-auto">
        <Link href="/" className="hover:text-blue-600">Home</Link> &gt; 
        <span className="text-gray-900 ml-1">Specification Generator</span>
      </div>

      <div className="max-w-[1000px] mx-auto px-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 mt-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <IconDocumentText />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0B3558] tracking-tight">Tender Clause Generator</h1>
              <p className="text-gray-600 mt-1">Generate a legally robust, paste-ready specification clause for your procurement document.</p>
            </div>
          </div>
        </div>

        {/* ── INPUT FORM ── */}
        <form onSubmit={handleGenerate} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#0B3558] mb-2">Selected Indian Standards (comma-separated) <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={standardIds}
              onChange={(e) => setStandardIds(e.target.value)}
              placeholder='e.g. "IS 16107 (Part 2/Sec 2):2017, IS 2062:2011"'
              className="w-full px-4 py-3.5 rounded-lg bg-[#F5F7FA] border border-gray-300 text-[#172033] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3558] focus:border-[#0B3558] text-sm font-medium"
            />
            <p className="text-xs text-gray-400 mt-2">Enter the exact IS numbers you want to include in the compliance clause.</p>
          </div>
          {errorMsg && <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0B3558] to-[#1565C0] text-white font-bold text-sm tracking-wide hover:from-[#092a47] hover:to-[#1256a3] active:scale-[0.99] transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Clause...
              </>
            ) : (
              <>
                <IconDocumentText />
                Generate Clause
              </>
            )}
          </button>
        </form>

        {/* ── RESULTS PREVIEW ── */}
        {result && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded border border-blue-200">PREVIEW</span>
                <span className="text-sm font-bold text-gray-700">Tender Specification Document</span>
              </div>
              {result.docx_download_url && (
                <a 
                  href={`${API_BASE}${result.docx_download_url}`}
                  download
                  className="px-5 py-2 rounded-lg bg-white border border-gray-300 text-blue-600 hover:bg-gray-50 text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <IconDownload />
                  Download DOCX
                </a>
              )}
            </div>
            
            <div className="p-8 bg-[#fdfdfd]">
              <div className="max-w-[800px] mx-auto bg-white p-10 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[500px]">
                <pre className="text-sm text-gray-800 font-serif whitespace-pre-wrap leading-loose">
                  {result.text_preview}
                </pre>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 font-medium">
              <span>Audit ID: <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">{result.audit_id || "N/A"}</span></span>
              <span>Included Standards: {result.referenced_is_numbers?.length || 0}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
