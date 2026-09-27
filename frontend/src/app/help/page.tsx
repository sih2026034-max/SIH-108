"use client";
import React, { useState } from "react";
import Link from "next/link";

/* ──────────────────────────────────────────────
   SVG Icon Components
   ────────────────────────────────────────────── */
function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function IconChevronUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
function IconExternalLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function IconPlayCircle() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}
function IconMessageCircle() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
function IconFileText() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   FAQ Data
   ────────────────────────────────────────────── */
const faqCategories = [
  {
    category: "Getting Started",
    icon: "🚀",
    questions: [
      {
        q: "What is DrishtiManak IS Recommendation?",
        a: "DrishtiManak is an AI-powered platform built for Government procurement officials. It uses NLP and semantic search to recommend the most relevant Indian Standards (IS) for any product or procurement requirement, helping ensure that government tenders reference the correct and latest BIS standards."
      },
      {
        q: "How do I search for Indian Standards?",
        a: "You can search in three ways:\n\n1. **Quick Search** — Type your product description (e.g., \"5 HP water pump\", \"uPVC pipes\") in the search box on the Dashboard.\n2. **Product Input** — Fill in structured details like product name, description, and technical specs.\n3. **Document Upload** — Upload a tender document (PDF/DOCX/TXT) and the AI will extract product info and recommend standards automatically."
      },
      {
        q: "What languages are supported?",
        a: "DrishtiManak supports **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** queries. The multilingual AI engine can understand product descriptions in any of these languages and recommend the correct Indian Standards. You can switch the UI language from the language selector in the top navigation bar."
      },
      {
        q: "Do I need to create an account?",
        a: "Yes, you can log in through the Login page. Authentication is handled via Firebase. Once logged in, your search history, reports, and preferences are saved to your account."
      },
    ]
  },
  {
    category: "Search & Recommendations",
    icon: "🔍",
    questions: [
      {
        q: "How does the AI recommendation engine work?",
        a: "The system uses a **multilingual semantic search engine** powered by the E5-base model and a FAISS vector index of 23,000+ Indian Standards. When you enter a query:\n\n1. Your query is converted to a high-dimensional embedding\n2. The FAISS index retrieves the top-K semantically similar standards\n3. A re-ranking algorithm considers title relevance, category match, and department alignment\n4. Results are scored and classified as HIGH, MEDIUM, or LOW relevance"
      },
      {
        q: "What does the relevance score mean?",
        a: "The relevance score (shown as a percentage) indicates how closely a recommended standard matches your query:\n\n• **75%+ (HIGH)** — Directly applicable to your product/requirement\n• **65-75% (MEDIUM)** — Potentially applicable, partial match\n• **50-65% (LOW)** — Broadly related, needs verification\n\nStandards below 50% are filtered out automatically."
      },
      {
        q: "What are Primary vs Alternative recommendations?",
        a: "**Primary Recommendations** are the top-scoring standards that are most directly applicable to your query. **Alternative Recommendations** are additional standards that may be relevant — for example, related test methods, safety standards, or standards for similar products."
      },
      {
        q: "Why am I getting 'No matching standard found'?",
        a: "This can happen if:\n\n• The query is too vague — try adding specific product details (material, voltage, dimensions)\n• The product category is not well-covered in the current dataset\n• The query is in a language the model struggles with\n\n**Tip:** Try popular searches like \"cement\", \"transformer\", \"uPVC pipe\", \"solar PV module\" to see how the system works."
      },
    ]
  },
  {
    category: "Reports & Downloads",
    icon: "📄",
    questions: [
      {
        q: "How do I download a report?",
        a: "After getting search results, click the **\"Download Report\"** button at the top of the results section. This will open your browser's print dialog — select **\"Save as PDF\"** to download a clean, printable report in A4 format with all styling preserved."
      },
      {
        q: "How do I view and print a report?",
        a: "Click the **\"View Report\"** button to open the report in a new browser tab without any navigation elements. The new tab includes a **\"Print Report\"** button for easy printing. The report includes recommended standards, allied standards, certification requirements, and version information."
      },
      {
        q: "Can I generate a specification/tender clause?",
        a: "Yes! Use the **Specification Generator** (accessible from the sidebar). Enter the IS numbers of your recommended standards, and the system will generate a ready-to-use tender clause that references those standards with correct IS numbers and titles."
      },
    ]
  },
  {
    category: "Compliance & Audit",
    icon: "✅",
    questions: [
      {
        q: "What is the Compliance Check feature?",
        a: "The Compliance Check lets you paste raw tender text and the system will audit it for:\n\n• **Outdated standards** referenced in the tender\n• **Withdrawn or superseded** IS numbers\n• **Missing mandatory standards** that should be referenced\n• **Non-standard references** that may cause procurement issues\n\nAccess it from the sidebar under \"Compliance Check\"."
      },
      {
        q: "What is the Audit Trail?",
        a: "Every search and action generates an **Audit ID** that links to a permanent record. This ensures traceability — any recommendation can be independently verified later. Audit logs include the query, results, timestamps, and source data references."
      },
    ]
  },
  {
    category: "Data & Coverage",
    icon: "📊",
    questions: [
      {
        q: "How many Indian Standards are covered?",
        a: "The current dataset includes **23,000+ Indian Standards** across 17 BIS departments covering:\n\n• Civil Engineering (CED)\n• Electrotechnical (ETD)\n• Mechanical Engineering (MED)\n• Electronics & IT (LITD)\n• Food & Agriculture (FAD)\n• Chemical (CHD)\n• And 11 more departments"
      },
      {
        q: "How often is the data updated?",
        a: "The standards database is periodically updated from BIS sources. The vector index is rebuilt when new standards are added. Check the Health status on the Dashboard for the current indexed count."
      },
      {
        q: "Where does the data come from?",
        a: "All standards data is sourced from the **Bureau of Indian Standards (BIS)** official catalogs. The system does not invent or fabricate any IS numbers — it only recommends from the verified dataset."
      },
    ]
  },
];

const quickGuides = [
  {
    title: "Quick Search Guide",
    description: "Learn how to search for Indian Standards using natural language queries in English, Hindi, or Marathi.",
    icon: "🔍",
    steps: ["Go to Dashboard", "Type your product description", "Click 'Get Recommended Standards'", "Review results and download report"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Document Upload Guide",
    description: "Upload a tender document (PDF/DOCX) and let the AI extract product information and recommend standards.",
    icon: "📤",
    steps: ["Go to Dashboard → Document Upload tab", "Drag & drop or browse your file", "Click 'Analyze Document'", "Review extracted info and recommendations"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Compliance Check Guide",
    description: "Audit raw tender text for outdated references, missing standards, and non-compliance issues.",
    icon: "✅",
    steps: ["Go to Compliance Check from sidebar", "Paste your tender text", "Click 'Analyze Tender'", "Review flagged issues and recommendations"],
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Specification Generator",
    description: "Generate ready-to-use tender clauses from recommended Indian Standards.",
    icon: "📝",
    steps: ["Search for standards first", "Note the IS numbers", "Go to Specification Generator", "Enter IS numbers and generate clause"],
    color: "from-purple-500 to-violet-600",
  },
  {
    title: "Standards Directory",
    description: "Browse all Indian Standards by department, status, and type with advanced filtering options.",
    icon: "📚",
    steps: ["Go to Standards Search from sidebar", "Select department filter", "Apply status and type filters", "Click any standard for details"],
    color: "from-rose-500 to-pink-600",
  },
  {
    title: "Report Generation",
    description: "Download or print professional reports with recommended standards and compliance details.",
    icon: "📊",
    steps: ["Run a search query", "View search results", "Click 'Download Report' for PDF", "Or 'View Report' for printable view"],
    color: "from-cyan-500 to-sky-600",
  },
];

/* ──────────────────────────────────────────────
   Help Page Component
   ────────────────────────────────────────────── */
export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  // Filter FAQs based on search
  const filteredFaqs = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => searchQuery.trim() === "" ||
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat =>
    (activeCategory === "all" || cat.category === activeCategory) &&
    cat.questions.length > 0
  );

  const totalFaqs = faqCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <div className="font-sans text-[#172033] min-h-screen bg-white">
      {/* ═══════════════════════════════════════════
          HERO BANNER
          ═══════════════════════════════════════════ */}
      <div className="relative w-full py-12 md:py-16 bg-cover bg-center bg-no-repeat overflow-hidden border-b border-gray-200 print:hidden" style={{ backgroundImage: 'url("/login-bg.jpg")' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
        <div className="relative h-full max-w-[1400px] mx-auto px-6 sm:px-8">
          
          <div className="flex items-center gap-2 text-[#0B3558] text-sm font-semibold mb-6">
            <Link href="/" className="hover:underline">Dashboard</Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-600">Help & Support</span>
          </div>

          <div className="max-w-3xl pt-2">
            <h1 className="font-extrabold tracking-tight mb-2 flex flex-wrap items-baseline gap-x-3">
              <div className="text-3xl md:text-5xl uppercase font-serif">
                <span className="text-[#0B3558]">Help</span>
                <span className="text-[#F28C18]"> & Support</span>
              </div>
            </h1>
            <p className="text-sm md:text-base text-gray-700 font-medium max-w-2xl leading-relaxed mt-4">
              Everything you need to know about DrishtiManak IS Recommendation Platform. Find answers, learn features, and get in touch.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mt-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <IconSearch />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles, FAQs, guides..."
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-white border border-gray-300 shadow-sm text-[#172033] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3558] focus:border-[#0B3558] transition-all text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-[#F28C18] font-bold text-lg">{totalFaqs}</span>
              <span className="text-gray-600 font-medium">FAQ Articles</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-[#F28C18] font-bold text-lg">{quickGuides.length}</span>
              <span className="text-gray-600 font-medium">Step-by-Step Guides</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-[#F28C18] font-bold text-lg">3</span>
              <span className="text-gray-600 font-medium">Languages Supported</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-8 space-y-10">

        {/* ═══════════════════════════════════════════
            QUICK ACTION CARDS
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <IconBook />, title: "Documentation", desc: "Platform guides & tutorials", color: "bg-[#0B3558]", link: "#guides" },
            { icon: <IconMessageCircle />, title: "FAQs", desc: "Frequently asked questions", color: "bg-[#16A34A]", link: "#faqs" },
            { icon: <IconPhone />, title: "Contact Us", desc: "Get in touch with our team", color: "bg-[#F28C18]", link: "#contact" },
            { icon: <IconShield />, title: "About BIS", desc: "Bureau of Indian Standards", color: "bg-[#6366F1]", link: "https://www.bis.gov.in" },
          ].map((card, i) => (
            <a
              key={i}
              href={card.link}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4 relative overflow-hidden"
            >
              <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                {card.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#0B3558] text-base mb-1 group-hover:text-[#1565C0] transition-colors">{card.title}</h3>
                <p className="text-sm text-[#667085]">{card.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#0B3558] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
          ))}
        </div>

        {/* ═══════════════════════════════════════════
            STEP-BY-STEP GUIDES
            ═══════════════════════════════════════════ */}
        <div id="guides">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B3558] flex items-center gap-3">
                <span className="text-2xl">📘</span>
                Step-by-Step Guides
              </h2>
              <p className="text-sm text-[#667085] mt-1">Learn how to use every feature of the platform</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickGuides.map((guide, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${guide.color} p-5 text-white`}>
                  <div className="text-3xl mb-3">{guide.icon}</div>
                  <h3 className="font-bold text-lg">{guide.title}</h3>
                  <p className="text-sm text-white/80 mt-1 leading-relaxed">{guide.description}</p>
                </div>
                {/* Steps */}
                <div className="p-5">
                  <div className="space-y-3">
                    {guide.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#F5F7FA] border border-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#0B3558]">
                          {j + 1}
                        </div>
                        <p className="text-sm text-[#344054] leading-relaxed pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            FAQs SECTION
            ═══════════════════════════════════════════ */}
        <div id="faqs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B3558] flex items-center gap-3">
                <span className="text-2xl">❓</span>
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-[#667085] mt-1">
                {searchQuery ? `Showing results for "${searchQuery}"` : "Find answers to common questions about the platform"}
              </p>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-[#0B3558] text-white shadow-md"
                  : "bg-white border border-gray-200 text-[#667085] hover:border-[#0B3558] hover:text-[#0B3558]"
              }`}
            >
              All Categories
            </button>
            {faqCategories.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.category
                    ? "bg-[#0B3558] text-white shadow-md"
                    : "bg-white border border-gray-200 text-[#667085] hover:border-[#0B3558] hover:text-[#0B3558]"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.category}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#0B3558] mb-2">No results found</h3>
                <p className="text-[#667085]">Try a different search term or browse all categories.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                  className="mt-4 px-5 py-2.5 bg-[#0B3558] text-white rounded-lg font-semibold hover:bg-[#092a47] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <h3 className="text-sm font-bold text-[#0B3558] uppercase tracking-wider flex items-center gap-2 mt-4 mb-2">
                    <span>{cat.icon}</span> {cat.category}
                  </h3>
                  {cat.questions.map((faq, idx) => {
                    const faqId = `${cat.category}-${idx}`;
                    const isOpen = openFaq === faqId;
                    return (
                      <div
                        key={faqId}
                        className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                          isOpen ? "border-[#0B3558] shadow-md" : "border-gray-200 shadow-sm hover:border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqId)}
                          className="w-full flex items-center justify-between p-5 text-left"
                        >
                          <span className={`font-semibold text-[15px] pr-4 transition-colors ${isOpen ? "text-[#0B3558]" : "text-[#344054]"}`}>
                            {faq.q}
                          </span>
                          <span className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "text-[#0B3558]" : "text-gray-400"}`}>
                            {isOpen ? <IconChevronUp /> : <IconChevronDown />}
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                            <div className="text-sm text-[#344054] leading-relaxed whitespace-pre-line">
                              {faq.a.split('\n').map((line, li) => {
                                if (line.startsWith('•')) {
                                  return <p key={li} className="ml-4 mb-1">{line}</p>;
                                }
                                if (line.match(/^\d+\./)) {
                                  return <p key={li} className="ml-4 mb-1">{line}</p>;
                                }
                                // Handle **bold** markers
                                const parts = line.split(/\*\*(.*?)\*\*/g);
                                return (
                                  <p key={li} className="mb-2">
                                    {parts.map((part, pi) =>
                                      pi % 2 === 1 ? <strong key={pi} className="text-[#0B3558] font-bold">{part}</strong> : part
                                    )}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            CONTACT SECTION
            ═══════════════════════════════════════════ */}
        <div id="contact">
          <h2 className="text-2xl font-bold text-[#0B3558] flex items-center gap-3 mb-6">
            <span className="text-2xl">📞</span>
            Contact & Support
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Cards */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1565C0] flex items-center justify-center mb-4">
                <IconMail />
              </div>
              <h3 className="font-bold text-[#0B3558] text-lg mb-2">Email Support</h3>
              <p className="text-sm text-[#667085] mb-4">Send us your queries and we will respond within 24 hours.</p>
              <a href="mailto:support@drishtimanak.gov.in" className="text-[#1565C0] font-semibold text-sm hover:underline flex items-center gap-1.5">
                support@drishtimanak.gov.in <IconExternalLink />
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-[#16A34A] flex items-center justify-center mb-4">
                <IconPhone />
              </div>
              <h3 className="font-bold text-[#0B3558] text-lg mb-2">Phone Support</h3>
              <p className="text-sm text-[#667085] mb-4">Available Monday to Friday, 9:30 AM to 5:30 PM IST.</p>
              <p className="text-[#16A34A] font-semibold text-sm">+91-11-2323-0131 (BIS Helpline)</p>
              <p className="text-[#667085] text-xs mt-1">Toll-Free: 1800-11-4000</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F28C18] flex items-center justify-center mb-4">
                <IconMapPin />
              </div>
              <h3 className="font-bold text-[#0B3558] text-lg mb-2">BIS Headquarters</h3>
              <p className="text-sm text-[#667085] mb-4">Bureau of Indian Standards, Manak Bhavan</p>
              <p className="text-[#0B3558] font-medium text-sm leading-relaxed">
                9, Bahadur Shah Zafar Marg,<br />
                New Delhi — 110 002, India
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            USEFUL LINKS
            ═══════════════════════════════════════════ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B3558] mb-6 flex items-center gap-3">
            <span className="text-xl">🔗</span>
            Useful Links & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "BIS Official Website", url: "https://www.bis.gov.in", desc: "Bureau of Indian Standards" },
              { title: "BIS Standards Catalog", url: "https://www.services.bis.gov.in", desc: "Browse & purchase IS standards" },
              { title: "BIS Product Certification", url: "https://www.manakonline.in", desc: "ISI mark & product licensing" },
              { title: "Quality Control Orders", url: "https://bis.gov.in/index.php/standards/quality-control-orders/", desc: "Mandatory standards list" },
              { title: "GeM Portal", url: "https://gem.gov.in", desc: "Government e-Marketplace" },
              { title: "CPPP", url: "https://eprocure.gov.in", desc: "Central Public Procurement Portal" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#1565C0] hover:bg-blue-50/30 transition-all group"
              >
                <div>
                  <p className="font-semibold text-[#0B3558] text-sm group-hover:text-[#1565C0] transition-colors">{link.title}</p>
                  <p className="text-xs text-[#667085] mt-0.5">{link.desc}</p>
                </div>
                <span className="text-gray-400 group-hover:text-[#1565C0] transition-colors">
                  <IconExternalLink />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            KEYBOARD SHORTCUTS
            ═══════════════════════════════════════════ */}
        <div className="bg-gradient-to-br from-[#0B2545] via-[#0D3060] to-[#1565C0] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-3">
              ⌨️ Quick Tips & Shortcuts
            </h2>
            <p className="text-white/70 text-sm mb-6">Boost your productivity with these tips</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { tip: "Use specific product names for better results", example: "\"11 kV power transformer\" instead of \"transformer\"" },
                { tip: "Include technical specs in your query", example: "\"uPVC pipe 110mm class 1\" instead of \"uPVC pipe\"" },
                { tip: "Try Hindi or Marathi for regional procurement", example: "\"सोलर स्ट्रीट लाइट\" or \"सिमेंट\"" },
                { tip: "Upload tender documents for automatic analysis", example: "PDF, DOCX, TXT files up to 10MB supported" },
                { tip: "Use the Standards Directory for browsing", example: "Filter by department, status, and standard type" },
                { tip: "Generate clauses after finding standards", example: "Use IS numbers from results in Specification Generator" },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="font-semibold text-sm mb-1.5">💡 {item.tip}</p>
                  <p className="text-xs text-white/60 italic">e.g. {item.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            FOOTER NOTE
            ═══════════════════════════════════════════ */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-[#667085]">
            DrishtiManak IS Recommendation Platform — Built for Smart India Hackathon (SIH) 2026
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Powered by Bureau of Indian Standards (BIS) data • AI-driven procurement assistance
          </p>
        </div>
      </div>
    </div>
  );
}
