export interface TenderMatch {
  id: string;
  tenderReference: string;
  title: string;
  organization: string;
  category: string;
  keywords: string[];
  location: string;
  issueDate: string;
  closingDate: string;
  description: string;
  sourceUrl: string | null;
  status: string;
  dataSource: "DEMO" | "LIVE";
  matchScore?: number;
}

export const TENDERS_DB: TenderMatch[] = [
  {
    id: "tender_001",
    tenderReference: "PHED/JJM/2026/04",
    title: "Supply of 5HP Submersible Pumps for Jal Jeevan Mission",
    organization: "Public Health Engineering Dept",
    category: "Water Pump",
    keywords: ["water pump", "5 hp", "submersible pump", "pumpsets"],
    location: "Maharashtra",
    issueDate: "01-Oct-2026",
    closingDate: "15-Oct-2026",
    description: "Procurement of highly efficient submersible pumps for drinking water supply.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  },
  {
    id: "tender_002",
    tenderReference: "MES/PMP/2026",
    title: "100 HP Centrifugal Pump Procurement",
    organization: "MES Cantonment",
    category: "Water Pump",
    keywords: ["centrifugal pump", "water pump", "horizontal pump", "100 hp"],
    location: "Various",
    issueDate: "10-Oct-2026",
    closingDate: "12-Nov-2026",
    description: "Supply of clear water centrifugal pumps for cantonment supply.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  },
  {
    id: "tender_003",
    tenderReference: "NHAI/HWY/2026",
    title: "Procurement of Construction Material for Elevated Highway",
    organization: "National Highways Authority",
    category: "Construction Material",
    keywords: ["tmt steel", "structural steel", "cement", "construction material"],
    location: "Delhi NCR",
    issueDate: "15-Sep-2026",
    closingDate: "20-Nov-2026",
    description: "Supply of structural steel and TMT bars for highway bridge construction.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  },
  {
    id: "tender_004",
    tenderReference: "CPWD/CEM/88",
    title: "Annual Rate Contract for Portland Cement",
    organization: "CPWD",
    category: "Cement",
    keywords: ["cement", "opc", "portland cement", "construction material"],
    location: "Pan India",
    issueDate: "01-Sep-2026",
    closingDate: "31-Oct-2026",
    description: "Bulk supply of ordinary portland cement for various public works.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  },
  {
    id: "tender_005",
    tenderReference: "SEB/TRF/2026",
    title: "11kV Distribution Transformer Upgrades",
    organization: "State Electricity Board",
    category: "Transformer",
    keywords: ["transformer", "distribution transformer", "11kv", "power"],
    location: "Gujarat",
    issueDate: "05-Oct-2026",
    closingDate: "10-Nov-2026",
    description: "Procurement of outdoor oil-immersed distribution transformers.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  },
  {
    id: "tender_006",
    tenderReference: "IR/SOLAR/2026",
    title: "1.2 MW Rooftop Solar PV Installation",
    organization: "Indian Railways",
    category: "Solar PV",
    keywords: ["solar pv", "photovoltaic", "solar module"],
    location: "Central Zone",
    issueDate: "20-Sep-2026",
    closingDate: "30-Oct-2026",
    description: "Installation of terrestrial PV modules across railway stations.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  },
  {
    id: "tender_007",
    tenderReference: "MC/WS/2026/88",
    title: "Annual Rate Contract for uPVC Pipes",
    organization: "Municipal Corporation",
    category: "Pipes",
    keywords: ["upvc pipe", "pvc pipe", "water pipe"],
    location: "Pune",
    issueDate: "01-Oct-2026",
    closingDate: "05-Dec-2026",
    description: "Procurement of unplasticized PVC pipes for municipal water distribution.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  },
  {
    id: "tender_008",
    tenderReference: "MCL/LED/22",
    title: "Procurement of LED Street Lights",
    organization: "Municipal Corporation",
    category: "Lighting",
    keywords: ["led lamp", "led street light", "lighting"],
    location: "Mumbai",
    issueDate: "15-Oct-2026",
    closingDate: "30-Nov-2026",
    description: "Supply and installation of LED lamps for street lighting.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  },
  {
    id: "tender_009",
    tenderReference: "PGCIL/CBL/2026",
    title: "Supply of PVC Insulated Cables",
    organization: "Power Grid Corporation",
    category: "Cables",
    keywords: ["cable", "pvc insulated cable", "electrical cable"],
    location: "Haryana",
    issueDate: "10-Oct-2026",
    closingDate: "15-Nov-2026",
    description: "Bulk procurement of electrical wiring and PVC insulated cables.",
    sourceUrl: null,
    status: "Open",
    dataSource: "DEMO"
  }
];
