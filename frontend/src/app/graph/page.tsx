"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import cytoscape from "cytoscape";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const EDGE_COLORS: Record<string, string> = {
  NORMATIVE_REF: "#60a5fa",
  TEST_METHOD_FOR: "#f59e0b",
  TERMINOLOGY_FOR: "#a78bfa",
  SAFETY_FOR: "#f87171",
  SUPERSEDED_BY: "#6b7280",
  CROSS_REF: "#34d399",
};

const EDGE_LABELS: Record<string, string> = {
  NORMATIVE_REF: "Normative Ref",
  TEST_METHOD_FOR: "Test Method",
  TERMINOLOGY_FOR: "Terminology",
  SAFETY_FOR: "Safety",
  SUPERSEDED_BY: "Superseded By",
  CROSS_REF: "Cross Ref",
};

export default function GraphPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading graph...</div>}>
      <GraphContent />
    </Suspense>
  );
}

function GraphContent() {
  const searchParams = useSearchParams();
  const standardId = searchParams.get("id") || "IS 1000:2020";
  const cyRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);

  useEffect(() => {
    if (!cyRef.current) return;

    let cyInstance: cytoscape.Core | null = null;

    // Fetch graph data (fallback to mock)
    async function loadGraph() {
      let graphData;
      try {
        const res = await fetch(`${API_BASE}/standards/${encodeURIComponent(standardId)}/graph`);
        graphData = await res.json();
      } catch {
        graphData = {
          nodes: [
            { data: { id: standardId, title: "Primary Standard", status: "live", cert_required: "ISI Mark" } },
            { data: { id: "IS 1500:2019", title: "Methods of Test for Hydraulic Machines", status: "live" } },
            { data: { id: "IS 2062:2011", title: "Steel — Specification", status: "live" } },
            { data: { id: "IS 325:1996", title: "Three Phase Induction Motors", status: "superseded" } },
            { data: { id: "IS 325:2020", title: "Three Phase Induction Motors (Revised)", status: "live" } },
          ],
          edges: [
            { data: { source: standardId, target: "IS 1500:2019", edge_type: "TEST_METHOD_FOR", source_url: "https://services.bis.gov.in" } },
            { data: { source: standardId, target: "IS 2062:2011", edge_type: "NORMATIVE_REF", source_url: "https://services.bis.gov.in" } },
            { data: { source: standardId, target: "IS 325:1996", edge_type: "NORMATIVE_REF", source_url: "https://services.bis.gov.in" } },
            { data: { source: "IS 325:1996", target: "IS 325:2020", edge_type: "SUPERSEDED_BY", source_url: "https://services.bis.gov.in" } },
          ],
        };
      }

      if (!cyRef.current) return;

      cyInstance = cytoscape({
        container: cyRef.current,
        elements: [...graphData.nodes, ...graphData.edges],
        style: [
          {
            selector: "node",
            style: {
              label: "data(id)",
              "text-valign": "bottom",
              "text-halign": "center",
              "font-size": "11px",
              color: "#d1d5db",
              "background-color": "#1e40af",
              "border-width": 2,
              "border-color": "#3b82f6",
              width: 45,
              height: 45,
              "text-margin-y": 8,
            },
          },
          {
            selector: 'node[status = "superseded"]',
            style: { "background-color": "#92400e", "border-color": "#f59e0b" },
          },
          {
            selector: 'node[status = "withdrawn"]',
            style: { "background-color": "#991b1b", "border-color": "#ef4444" },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#4b5563",
              "target-arrow-color": "#4b5563",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              label: "data(edge_type)",
              "font-size": "9px",
              color: "#9ca3af",
              "text-rotation": "autorotate",
              "text-margin-y": -10,
            },
          },
          ...Object.entries(EDGE_COLORS).map(([type, color]) => ({
            selector: `edge[edge_type = "${type}"]`,
            style: { "line-color": color, "target-arrow-color": color },
          })),
          {
            selector: ":selected",
            style: { "border-width": 4, "border-color": "#22d3ee" },
          },
        ],
        layout: { name: "cose", animate: true, padding: 60 },
      });

      cyInstance.on("tap", "node", (e) => setSelectedElement(e.target.data()));
      cyInstance.on("tap", "edge", (e) => setSelectedElement(e.target.data()));
    }

    loadGraph();

    return () => {
      if (cyInstance) {
        cyInstance.destroy();
      }
    };
  }, [standardId]);

  return (
    <div className="p-8 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-2">
        Standards Graph: <span className="text-cyan-400">{standardId}</span>
      </h1>
      <p className="text-sm text-gray-500 mb-4">Click any node or edge to inspect its source.</p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(EDGE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2 text-xs">
            <div className="w-4 h-1 rounded" style={{ backgroundColor: color }} />
            <span className="text-gray-400">{EDGE_LABELS[type]}</span>
          </div>
        ))}
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 flex gap-4">
        <div ref={cyRef} className="flex-1 rounded-xl border border-gray-800 bg-gray-900/50" />
        {selectedElement && (
          <div className="w-72 p-4 rounded-xl border border-gray-800 bg-gray-900/70 text-sm space-y-3">
            <h3 className="font-semibold text-white">Inspection Panel</h3>
            {Object.entries(selectedElement).map(([k, v]) => (
              <div key={k}>
                <span className="text-gray-500 text-xs">{k}</span>
                <p className="text-gray-300 break-all">
                  {k === "source_url" ? (
                    <a href={v as string} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {v as string}
                    </a>
                  ) : (
                    String(v)
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
