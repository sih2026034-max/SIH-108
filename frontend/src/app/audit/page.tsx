"use client";
import React, { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ──────────────────────────────────────────────
   SVG Icon Components
   ────────────────────────────────────────────── */
function IconShieldCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
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

function IconDocument() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Status badge styling helper
   ────────────────────────────────────────────── */
function statusStyle(status: string) {
  switch (status) {
    case "COMPLIANT":
      return "bg-green-50 text-green-600 border-green-200";
    case "PARTIALLY_COMPLIANT":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "NON_COMPLIANT":
      return "bg-red-50 text-red-600 border-red-200";
    case "INSUFFICIENT_DATA":
      return "bg-orange-50 text-orange-600 border-orange-200";
    case "VERIFY_REQUIRED":
      return "bg-blue-50 text-blue-600 border-blue-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

function statusLabel(s: string) {
  return s.replace(/_/g, " ");
}

export default function ComplianceCheckPage() {
  const [productDesc, setProductDesc] = useState("");
  const [techSpec, setTechSpec] = useState("");
  const [stdInput, setStdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!productDesc.trim()) {
      setErrorMsg("Please enter a product description.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    setResult(null);

    try {
      const body: any = {
        product_description: productDesc,
        technical_specification: techSpec,
      };
      if (stdInput.trim()) {
        body.recommended_standards = stdInput.split(",").map((s: string) => s.trim()).filter(Boolean);
      }

      const res = await fetch(`${API_BASE}/api/compliance/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg("Failed to connect to backend. Ensure the API server is running.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Derived stats from the result ── */
  const allReqs = result?.standards?.flatMap((s: any) => s.requirements || []) || [];
  const counts: Record<string, number> = {};
  allReqs.forEach((r: any) => { counts[r.status] = (counts[r.status] || 0) + 1; });
  const totalReqs = allReqs.length;

  const donutPercent = totalReqs > 0 ? Math.round(((counts["COMPLIANT"] || 0) / totalReqs) * 100) : 0;
  const coverageScores = result?.standards?.map((s: any) => s.coverage_score) || [];
  const avgCoverage = coverageScores.length > 0 ? (coverageScores.reduce((a: number, b: number) => a + b, 0) / coverageScores.length) : 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-12">
      
      {/* Breadcrumbs */}
      <div className="px-8 py-3 text-xs font-semibold text-gray-500 max-w-[1500px] mx-auto">
        <Link href="/" className="hover:text-blue-600">Home</Link> &gt; 
        <span className="text-gray-900 ml-1">Compliance Check</span>
      </div>

      <div className="max-w-[1500px] mx-auto px-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <IconShieldCheck />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0B3558] tracking-tight">Compliance Check</h1>
              <p className="text-gray-600 mt-1">Verify if the procurement specification meets applicable Indian Standards and regulatory requirements</p>
            </div>
          </div>
        </div>

        {/* ── INPUT FORM ── */}
        <form onSubmit={handleCheck} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#0B3558] mb-1">Product Description <span className="text-red-500">*</span></label>
              <textarea
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder='e.g. "LED street light for municipal roads"'
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-[#F5F7FA] border border-gray-300 text-[#172033] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3558] focus:border-[#0B3558] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0B3558] mb-1">Technical Specification</label>
              <textarea
                value={techSpec}
                onChange={(e) => setTechSpec(e.target.value)}
                placeholder='e.g. "100W, IP66 protection, Aluminium housing"'
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-[#F5F7FA] border border-gray-300 text-[#172033] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3558] focus:border-[#0B3558] text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0B3558] mb-1">Recommended Standards (Optional, comma-separated)</label>
            <input
              type="text"
              value={stdInput}
              onChange={(e) => setStdInput(e.target.value)}
              placeholder='e.g. "IS 16107 (Part 2/Sec 2):2017"'
              className="w-full px-4 py-3 rounded-lg bg-[#F5F7FA] border border-gray-300 text-[#172033] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3558] focus:border-[#0B3558] text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank to auto-detect applicable standards using the recommendation engine.</p>
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
                Running Compliance Check...
              </>
            ) : (
              <>
                <IconShieldCheck />
                Run Compliance Check
              </>
            )}
          </button>
        </form>

        {/* ── RESULTS ── */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Product Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">📋 Submitted Specification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Product</span>
                    <p className="font-semibold text-[#0B3558]">{result.product}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Overall Status</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold border uppercase tracking-wider ${statusStyle(result.status)}`}>
                      {statusLabel(result.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Per-Standard Results */}
              {result.standards?.map((std: any, si: number) => (
                <div key={si} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="bg-[#0B3558] text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2">BIS STANDARD</span>
                        <span className="text-xl font-bold text-[#0B3558]">{std.is_number}</span>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded text-[11px] font-bold border uppercase tracking-wider ${statusStyle(std.overall_status)}`}>
                        {statusLabel(std.overall_status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{std.title}</p>
                    <div className="flex gap-6 mt-3 text-xs text-gray-500">
                      <span>Coverage Score: <strong className="text-gray-900">{(std.coverage_score * 100).toFixed(0)}%</strong></span>
                      <span>Source: <strong className="text-gray-900">{std.source_file}</strong></span>
                      <span>Record ID: <strong className="text-gray-900">{std.source_record_id}</strong></span>
                    </div>
                  </div>

                  {/* Requirements Table */}
                  {std.requirements && std.requirements.length > 0 && (
                    <div className="p-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Requirement Verification</h4>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                              <th className="px-4 py-3">#</th>
                              <th className="px-4 py-3">Requirement</th>
                              <th className="px-4 py-3">Submitted Value</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Evidence</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {std.requirements.map((req: any, ri: number) => (
                              <tr key={ri} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-4 py-3 text-gray-500 font-medium">{ri + 1}</td>
                                <td className="px-4 py-3 font-semibold text-gray-900">{req.requirement}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{req.submitted_value}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${statusStyle(req.status)}`}>
                                    {statusLabel(req.status)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed max-w-[280px]">{req.standard_evidence}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Missing Information */}
                  {std.missing_information && std.missing_information.length > 0 && (
                    <div className="px-6 pb-4">
                      <h4 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-1.5"><IconAlert /> Missing Information</h4>
                      <ul className="space-y-1 text-sm text-orange-900">
                        {std.missing_information.map((m: string, mi: number) => (
                          <li key={mi} className="flex gap-2"><span className="text-orange-500">•</span> {m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Verification Required */}
                  {std.verification_required && std.verification_required.length > 0 && (
                    <div className="px-6 pb-6">
                      <h4 className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-1.5">🔍 Verification Required</h4>
                      <ul className="space-y-1 text-sm text-blue-900">
                        {std.verification_required.map((v: string, vi: number) => (
                          <li key={vi} className="flex gap-2"><span className="text-blue-500">•</span> {v}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Overall Compliance Summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Overall Compliance</h3>
                  <span className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 uppercase tracking-wider border ${statusStyle(result.status)}`}>
                    {result.status === "COMPLIANT" ? <><IconCheckCircle /> Compliant</> : 
                     result.status === "PARTIALLY_COMPLIANT" ? <><IconAlert /> Partial</> :
                     result.status === "INSUFFICIENT_DATA" ? <><IconAlert /> Data Insufficient</> :
                     <><IconAlert /> {statusLabel(result.status)}</>}
                  </span>
                </div>
                
                <div className="flex items-center gap-8">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <path
                        className="text-gray-100"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500"
                        strokeDasharray={`${donutPercent}, 100`}
                        strokeWidth="6"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-orange-400"
                        strokeDasharray={`${totalReqs > 0 ? Math.round(((counts["INSUFFICIENT_DATA"] || 0) / totalReqs) * 100) : 0}, 100`}
                        strokeDashoffset={`-${donutPercent}`}
                        strokeWidth="6"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-gray-900 tracking-tighter">{(avgCoverage * 100).toFixed(0)}%</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Coverage</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-gray-700">Compliant</span></div>
                      <span className="font-bold text-gray-900">{counts["COMPLIANT"] || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400"></div><span className="text-gray-700">Insufficient Data</span></div>
                      <span className="font-bold text-gray-900">{counts["INSUFFICIENT_DATA"] || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-gray-700">Non-Compliant</span></div>
                      <span className="font-bold text-gray-900">{counts["NON_COMPLIANT"] || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div><span className="text-gray-700">Verify Required</span></div>
                      <span className="font-bold text-gray-900">{counts["VERIFY_REQUIRED"] || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standards Evaluated */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Standards Evaluated</h3>
                <div className="space-y-3">
                  {result.standards?.map((std: any, si: number) => (
                    <div key={si} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg border border-gray-100">
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-[#0B3558] truncate">{std.is_number}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[220px]">{std.title}</p>
                      </div>
                      <span className={`flex-shrink-0 ml-2 px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${statusStyle(std.overall_status)}`}>
                        {statusLabel(std.overall_status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5">⚠️ Important Disclaimer</h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {result.disclaimer || "Compliance results are based on the information available in the current dataset and should be verified against the latest authoritative BIS standard before final procurement use."}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2">
                  <IconDownload />
                  Download Compliance Report
                </button>
                <Link href="/clause" className="w-full bg-white hover:bg-gray-50 border border-blue-200 text-blue-700 font-bold py-3.5 rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2">
                  <IconDocument />
                  Generate Updated Specification
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
