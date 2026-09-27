export interface IndianStandard {
  id: string;
  product: string;
  category: string;
  keywords: string[];
  synonyms: string[];
  isNumber: string;
  title: string;
  application: string;
  sector: string;
  description: string;
  verificationStatus: "verified-reference" | "requires-verification";
}

export const INDIAN_STANDARDS_DB: IndianStandard[] = [
  {
    id: "pump_submersible",
    product: "Submersible Pump",
    category: "Pumps",
    keywords: ["water pump", "water pumps", "pump", "pump set", "5 hp pump", "5 hp water pump", "submersible pump"],
    synonyms: ["water pumping system", "pump set", "borewell pump"],
    isNumber: "IS 8034:2018",
    title: "Submersible pump-sets - Specification",
    application: "Borewells and underwater pumping",
    sector: "Mechanical / Water & Pumping",
    description: "Specifies requirements for submersible pump sets used in borewells.",
    verificationStatus: "verified-reference"
  },
  {
    id: "pump_centrifugal_horizontal_1",
    product: "Horizontal Centrifugal Pump",
    category: "Pumps",
    keywords: ["centrifugal pump", "horizontal pump", "water pump", "pump"],
    synonyms: ["surface pump", "clear water pump"],
    isNumber: "IS 9079",
    title: "Horizontal centrifugal pump sets for clear, cold water",
    application: "General clear water pumping",
    sector: "Mechanical / Water & Pumping",
    description: "Specification for horizontal centrifugal pumps.",
    verificationStatus: "verified-reference"
  },
  {
    id: "pump_centrifugal_horizontal_2",
    product: "Horizontal Centrifugal Pump",
    category: "Pumps",
    keywords: ["centrifugal pump", "horizontal pump", "clear water"],
    synonyms: ["surface water pump"],
    isNumber: "IS 6595",
    title: "Horizontal centrifugal pumps for clear, cold water",
    application: "Agricultural and general purpose",
    sector: "Mechanical / Water & Pumping",
    description: "Specification for general purpose horizontal centrifugal pumps.",
    verificationStatus: "verified-reference"
  },
  {
    id: "steel_tmt",
    product: "TMT Steel",
    category: "Steel",
    keywords: ["tmt steel", "reinforcement steel", "steel bars", "fe 500", "fe 500d"],
    synonyms: ["rebar", "deformed bars"],
    isNumber: "IS 1786:2008",
    title: "High strength deformed steel bars and wires for concrete reinforcement",
    application: "Concrete construction reinforcement",
    sector: "Civil & Construction",
    description: "Requirements for high strength deformed steel bars and wires.",
    verificationStatus: "verified-reference"
  },
  {
    id: "steel_structural",
    product: "Structural Steel",
    category: "Steel",
    keywords: ["structural steel", "mild steel", "hot rolled steel", "steel beams"],
    synonyms: ["ms steel", "structural shapes"],
    isNumber: "IS 2062",
    title: "Hot rolled medium and high tensile structural steel",
    application: "General structural purposes",
    sector: "Civil & Construction",
    description: "Specification for hot rolled structural steel.",
    verificationStatus: "verified-reference"
  },
  {
    id: "cement_opc",
    product: "Ordinary Portland Cement",
    category: "Cement",
    keywords: ["cement", "portland cement", "opc", "53 grade", "43 grade", "construction material"],
    synonyms: ["building cement"],
    isNumber: "IS 269",
    title: "Ordinary Portland Cement",
    application: "General concrete construction",
    sector: "Civil & Construction",
    description: "Specification for 33, 43 and 53 grade ordinary Portland cement.",
    verificationStatus: "verified-reference"
  },
  {
    id: "cement_ppc",
    product: "Portland Pozzolana Cement",
    category: "Cement",
    keywords: ["ppc", "pozzolana cement", "cement", "fly ash cement", "construction material"],
    synonyms: ["blended cement"],
    isNumber: "IS 1489",
    title: "Portland Pozzolana Cement",
    application: "Mass concrete and marine structures",
    sector: "Civil & Construction",
    description: "Specification for Portland Pozzolana Cement.",
    verificationStatus: "verified-reference"
  },
  {
    id: "concrete_pipe",
    product: "Precast Concrete Pipe",
    category: "Pipes",
    keywords: ["concrete pipe", "rcc pipe", "drainage pipe"],
    synonyms: ["hume pipe", "sewer pipe"],
    isNumber: "IS 458",
    title: "Precast concrete pipes",
    application: "Drainage and sewerage",
    sector: "Civil & Construction",
    description: "Requirements for unreinforced, reinforced and prestressed concrete pipes.",
    verificationStatus: "verified-reference"
  },
  {
    id: "solar_pv",
    product: "Solar PV Module",
    category: "Solar",
    keywords: ["solar pv", "solar panel", "pv module", "photovoltaic"],
    synonyms: ["solar board", "solar cell array"],
    isNumber: "IS 14286",
    title: "Terrestrial photovoltaic modules",
    application: "Solar energy generation",
    sector: "Renewable Energy / Electrical",
    description: "Design qualification and type approval for PV modules.",
    verificationStatus: "verified-reference"
  },
  {
    id: "transformer_power",
    product: "Power Transformer",
    category: "Transformers",
    keywords: ["power transformer", "transformer", "high voltage transformer"],
    synonyms: ["substation transformer", "pt"],
    isNumber: "IS 2026",
    title: "Power transformers",
    application: "Transmission substations",
    sector: "Electrical",
    description: "Specification for power transformers.",
    verificationStatus: "verified-reference"
  },
  {
    id: "transformer_distribution",
    product: "Distribution Transformer",
    category: "Transformers",
    keywords: ["distribution transformer", "transformer", "11kv transformer"],
    synonyms: ["dt", "pole mounted transformer"],
    isNumber: "IS 1180",
    title: "Outdoor type oil immersed distribution transformers",
    application: "Distribution networks",
    sector: "Electrical",
    description: "Specification for outdoor distribution transformers up to 2500 kVA.",
    verificationStatus: "verified-reference"
  },
  {
    id: "led_lamp",
    product: "LED Lamp",
    category: "Lighting",
    keywords: ["led lamp", "led bulb", "lamp", "lighting"],
    synonyms: ["led bulb", "led light"],
    isNumber: "IS 16102",
    title: "Self-ballasted LED lamps",
    application: "General lighting",
    sector: "Electrical / Lighting",
    description: "Safety requirements for self-ballasted LED lamps.",
    verificationStatus: "verified-reference"
  },
  {
    id: "cable_pvc",
    product: "PVC Insulated Cable",
    category: "Electrical Cables",
    keywords: ["pvc insulated cable", "cable", "wire", "pvc wire"],
    synonyms: ["electrical wire", "power cable"],
    isNumber: "IS 694",
    title: "PVC insulated cables",
    application: "Wiring for working voltages up to 1100V",
    sector: "Electrical",
    description: "Specification for PVC insulated cables for working voltages.",
    verificationStatus: "verified-reference"
  },
  {
    id: "switchgear_lv",
    product: "Low-Voltage Switchgear",
    category: "Switchgear",
    keywords: ["switchgear", "controlgear", "low voltage switchgear", "mcb"],
    synonyms: ["breaker", "electrical panel equipment"],
    isNumber: "IS/IEC 60947",
    title: "Low-voltage switchgear and controlgear",
    application: "Electrical distribution and control",
    sector: "Electrical",
    description: "General rules for LV switchgear.",
    verificationStatus: "verified-reference"
  },
  {
    id: "pipe_upvc",
    product: "uPVC Pipe",
    category: "Pipes",
    keywords: ["upvc pipe", "pvc pipe", "plumbing pipe", "water pipe"],
    synonyms: ["unplasticized pvc", "rigid pvc pipe"],
    isNumber: "IS 4985:2021",
    title: "Unplasticized PVC Pipes for Water Supply",
    application: "Cold water supply systems",
    sector: "Plumbing / Construction",
    description: "Specification for uPVC pipes for potable water.",
    verificationStatus: "verified-reference"
  }
];
