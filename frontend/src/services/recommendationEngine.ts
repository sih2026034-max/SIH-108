import { INDIAN_STANDARDS_DB, IndianStandard } from "../data/indianStandards";
import { TENDERS_DB, TenderMatch } from "../data/tenders";

export interface RecommendationResult {
  query: string;
  detectedProduct: string;
  detectedSpecifications: string;
  sector: string;
  standards: Array<IndianStandard & { matchScore: number, matchReason: string }>;
  tenders: TenderMatch[];
  confidence: number;
}

function getTenderRecommendations(normalizedQuery: string, detectedCategory: string): TenderMatch[] {
  const matches = TENDERS_DB.map(tender => {
    let score = 0;

    // Exact Category Match
    if (detectedCategory && tender.category.toLowerCase() === detectedCategory.toLowerCase()) {
      score += 40;
    }

    // Title / Description Match
    if (tender.title.toLowerCase().includes(normalizedQuery)) score += 30;
    if (tender.description.toLowerCase().includes(normalizedQuery)) score += 10;

    // Keyword Matches
    const matchedKeywords = tender.keywords.filter(k => normalizedQuery.includes(k));
    if (matchedKeywords.length > 0) {
      score += 20 + (matchedKeywords.length * 5);
    }

    return {
      ...tender,
      matchScore: Math.min(score, 99)
    };
  }).filter(t => t.matchScore! > 20);

  matches.sort((a, b) => b.matchScore! - a.matchScore!);
  return matches;
}

export function getRecommendations(query: string): RecommendationResult | null {
  const normalized = query.toLowerCase().trim().replace(/\s+/g, " ");
  
  if (!normalized) return null;

  // Extract specs (e.g., 5 HP, 11kV)
  let specifications = "None specified";
  const hpMatch = normalized.match(/(\d+\s*hp)/);
  if (hpMatch) specifications = hpMatch[1].toUpperCase();
  
  const matches = INDIAN_STANDARDS_DB.map(std => {
    let score = 0;
    let reason = "";

    // Exact Product Match
    if (normalized.includes(std.product.toLowerCase())) {
      score += 0.8;
      reason = `Direct match for product category: ${std.product}`;
    }
    
    // Keyword Match
    const matchedKeywords = std.keywords.filter(k => normalized.includes(k));
    if (matchedKeywords.length > 0 && score === 0) {
      score += 0.6 + (0.05 * matchedKeywords.length);
      reason = `Matched based on keywords: ${matchedKeywords.join(", ")}`;
    }

    // Synonym Match
    const matchedSynonyms = std.synonyms.filter(s => normalized.includes(s));
    if (matchedSynonyms.length > 0 && score === 0) {
      score += 0.5;
      reason = `Matched based on technical synonym.`;
    }

    return {
      ...std,
      matchScore: Math.min(score, 0.99),
      matchReason: reason
    };
  }).filter(m => m.matchScore > 0);

  // Sort by score descending
  matches.sort((a, b) => b.matchScore - a.matchScore);

  if (matches.length === 0) {
    return null;
  }

  const bestMatch = matches[0];
  const avgConfidence = matches.reduce((acc, curr) => acc + curr.matchScore, 0) / matches.length;

  const tenderMatches = getTenderRecommendations(normalized, bestMatch.category);

  return {
    query,
    detectedProduct: bestMatch.product,
    detectedSpecifications: specifications,
    sector: bestMatch.sector,
    standards: matches,
    tenders: tenderMatches,
    confidence: avgConfidence
  };
}
