// Shared Supplier Scoring System

export interface SupplierCriteria {
  riskScore: number;
  performanceScore: number;
  innovationPotential: number;
  supplierComplexity: "low" | "medium" | "high";
  marketAvailability: "many_alternatives" | "limited_alternatives" | "few_alternatives" | "monopolistic";
  businessCriticality: "routine" | "important" | "critical" | "strategic";
  relationshipType: "transactional" | "collaborative" | "partnership" | "integration";
}

export interface ScoringWeights {
  risk: number;
  performance: number;
  innovation: number;
  criticality: number;
  relationship: number;
  market: number;
  complexity: number;
}

// Scoring weights (total = 100 points)
export const SCORING_WEIGHTS: ScoringWeights = {
  risk: 20,        // Risk management is critical
  performance: 25, // Performance is the primary indicator
  innovation: 15,  // Innovation drives competitive advantage
  criticality: 15, // Business impact is important
  relationship: 10, // Relationship maturity affects collaboration
  market: 10,      // Market dynamics affect sourcing strategy
  complexity: 5,   // Complexity affects management overhead
};

// Convert categorical values to numeric scores (0-1 scale)
export const getComplexityScore = (complexity: "low" | "medium" | "high"): number => {
  const scores = { low: 1, medium: 0.6, high: 0.2 };
  return scores[complexity];
};

export const getMarketScore = (availability: "many_alternatives" | "limited_alternatives" | "few_alternatives" | "monopolistic"): number => {
  const scores = { many_alternatives: 1, limited_alternatives: 0.7, few_alternatives: 0.4, monopolistic: 0.1 };
  return scores[availability];
};

export const getCriticalityScore = (criticality: "routine" | "important" | "critical" | "strategic"): number => {
  const scores = { routine: 0.2, important: 0.5, critical: 0.8, strategic: 1 };
  return scores[criticality];
};

export const getRelationshipScore = (relationship: "transactional" | "collaborative" | "partnership" | "integration"): number => {
  const scores = { transactional: 0.2, collaborative: 0.5, partnership: 0.8, integration: 1 };
  return scores[relationship];
};

// Calculate comprehensive supplier score (0-100)
export const calculateSupplierScore = (criteria: SupplierCriteria): number => {
  const {
    riskScore,
    performanceScore,
    innovationPotential,
    supplierComplexity,
    marketAvailability,
    businessCriticality,
    relationshipType
  } = criteria;

  // Normalize and weight each component
  const riskComponent = (11 - riskScore) / 10 * SCORING_WEIGHTS.risk; // Invert risk (lower risk = higher score)
  const performanceComponent = (performanceScore / 100) * SCORING_WEIGHTS.performance;
  const innovationComponent = (innovationPotential / 10) * SCORING_WEIGHTS.innovation;
  const criticalityComponent = getCriticalityScore(businessCriticality) * SCORING_WEIGHTS.criticality;
  const relationshipComponent = getRelationshipScore(relationshipType) * SCORING_WEIGHTS.relationship;
  const marketComponent = getMarketScore(marketAvailability) * SCORING_WEIGHTS.market;
  const complexityComponent = getComplexityScore(supplierComplexity) * SCORING_WEIGHTS.complexity;

  const totalScore = riskComponent + performanceComponent + innovationComponent + 
                    criticalityComponent + relationshipComponent + marketComponent + complexityComponent;

  return Math.round(totalScore * 10) / 10; // Round to 1 decimal place
};

// Define segment types
export type SegmentType = "trusted_suppliers" | "switch_candidates" | "commodity_partnerships" | "innovative_partnerships" | "proprietary_information" | "supplier_integration";

// Determine supplier segment based on comprehensive scoring and specific criteria
export const determineSupplierSegment = (criteria: SupplierCriteria): SegmentType => {
  const {
    riskScore,
    performanceScore,
    innovationPotential,
    businessCriticality,
    relationshipType
  } = criteria;

  const totalScore = calculateSupplierScore(criteria);

  // Rule-based segmentation logic combining total score with specific criteria
  
  // Switch Candidates: Poor overall performance or high risk with poor metrics
  if (totalScore < 35 || (riskScore >= 8 && performanceScore < 60)) {
    return "switch_candidates";
  }

  // Supplier Integration: Integration relationship with high business criticality
  if (relationshipType === "integration" && 
      (businessCriticality === "critical" || businessCriticality === "strategic")) {
    return "supplier_integration";
  }

  // Proprietary Information: Critical/Strategic suppliers with specialized knowledge requirements
  if ((businessCriticality === "critical" || businessCriticality === "strategic") &&
      totalScore >= 60 && riskScore <= 6) {
    return "proprietary_information";
  }

  // Innovative Partnerships: High innovation potential with partnership relationships
  if (innovationPotential >= 7 && 
      (relationshipType === "partnership" || relationshipType === "integration") &&
      totalScore >= 65) {
    return "innovative_partnerships";
  }

  // Trusted Suppliers: High performance with low risk
  if (performanceScore >= 85 && riskScore <= 4 && totalScore >= 70) {
    return "trusted_suppliers";
  }

  // Default to Commodity Partnerships for remaining suppliers
  return "commodity_partnerships";
};

// Get segment recommendation with score breakdown
export interface SegmentRecommendation {
  segment: SegmentType;
  totalScore: number;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  scoreBreakdown: {
    risk: number;
    performance: number;
    innovation: number;
    criticality: number;
    relationship: number;
    market: number;
    complexity: number;
  };
}

export const getSegmentRecommendation = (criteria: SupplierCriteria): SegmentRecommendation => {
  const segment = determineSupplierSegment(criteria);
  const totalScore = calculateSupplierScore(criteria);
  
  // Calculate score breakdown
  const scoreBreakdown = {
    risk: Math.round(((11 - criteria.riskScore) / 10 * SCORING_WEIGHTS.risk) * 10) / 10,
    performance: Math.round((criteria.performanceScore / 100 * SCORING_WEIGHTS.performance) * 10) / 10,
    innovation: Math.round((criteria.innovationPotential / 10 * SCORING_WEIGHTS.innovation) * 10) / 10,
    criticality: Math.round((getCriticalityScore(criteria.businessCriticality) * SCORING_WEIGHTS.criticality) * 10) / 10,
    relationship: Math.round((getRelationshipScore(criteria.relationshipType) * SCORING_WEIGHTS.relationship) * 10) / 10,
    market: Math.round((getMarketScore(criteria.marketAvailability) * SCORING_WEIGHTS.market) * 10) / 10,
    complexity: Math.round((getComplexityScore(criteria.supplierComplexity) * SCORING_WEIGHTS.complexity) * 10) / 10,
  };

  // Determine confidence level
  let confidence: "high" | "medium" | "low" = "medium";
  if (totalScore >= 80 || totalScore <= 20) confidence = "high";
  else if (totalScore >= 65 || totalScore <= 35) confidence = "medium";
  else confidence = "low";

  // Generate reasoning
  const segmentNames = {
    trusted_suppliers: "Trusted Suppliers",
    switch_candidates: "Switch Candidates", 
    commodity_partnerships: "Commodity Partnerships",
    innovative_partnerships: "Innovative Partnerships",
    proprietary_information: "Proprietary Information",
    supplier_integration: "Supplier Integration",
  };

  const reasoning = `Assigned to ${segmentNames[segment]} based on total score of ${totalScore}/100. Key factors: ${
    scoreBreakdown.performance >= 20 ? "High Performance, " : 
    scoreBreakdown.performance <= 10 ? "Low Performance, " : ""
  }${
    scoreBreakdown.risk >= 16 ? "Low Risk, " : 
    scoreBreakdown.risk <= 8 ? "High Risk, " : ""
  }${
    scoreBreakdown.innovation >= 12 ? "High Innovation, " : ""
  }${
    scoreBreakdown.criticality >= 12 ? "Strategic Importance, " : ""
  }${
    scoreBreakdown.relationship >= 8 ? "Strong Partnership" : "Transactional Relationship"
  }`.replace(/,\s*$/, "");

  return {
    segment,
    totalScore,
    confidence,
    reasoning,
    scoreBreakdown
  };
};