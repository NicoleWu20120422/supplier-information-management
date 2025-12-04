export const SUPPLIER_SEGMENTS = {
  trusted_suppliers: {
    label: "Trusted Suppliers",
    description: "Reliable partners with proven track record",
    color: "chart-3",
    bgClass: "segment-trusted",
    characteristics: "High performance, low risk, established relationship",
    management: "Maintain strong relationships, regular performance reviews"
  },
  switch_candidates: {
    label: "Switch Candidates", 
    description: "Underperforming suppliers to be replaced",
    color: "destructive",
    bgClass: "segment-switch",
    characteristics: "Poor performance, high cost, relationship issues",
    management: "Active replacement, performance improvement plans"
  },
  commodity_partnerships: {
    label: "Commodity Partnerships",
    description: "Standard suppliers for routine purchases",
    color: "muted-foreground", 
    bgClass: "segment-commodity",
    characteristics: "Standard products, market pricing, transactional",
    management: "Cost optimization, competitive bidding"
  },
  innovative_partnerships: {
    label: "Innovative Partnerships",
    description: "Suppliers driving innovation and development",
    color: "primary",
    bgClass: "segment-innovative",
    characteristics: "High innovation potential, collaborative, strategic value",
    management: "Joint development, long-term contracts, knowledge sharing"
  },
  proprietary_information: {
    label: "Proprietary Information",
    description: "Suppliers with access to sensitive information",
    color: "chart-4",
    bgClass: "segment-proprietary", 
    characteristics: "High confidentiality, specialized knowledge, security critical",
    management: "Strict contracts, security protocols, limited access"
  },
  supplier_integration: {
    label: "Supplier Integration",
    description: "Deeply integrated operational partners",
    color: "accent",
    bgClass: "segment-integration",
    characteristics: "Process integration, mutual dependency, strategic alignment",
    management: "Partnership governance, shared planning, integration management"
  },
} as const;

export const RISK_LEVELS = {
  low: { color: "chart-3", label: "Low Risk", className: "risk-low" },
  medium: { color: "chart-4", label: "Medium Risk", className: "risk-medium" },
  high: { color: "destructive", label: "High Risk", className: "risk-high" },
} as const;

export const SUPPLIER_COMPLEXITY = {
  low: { label: "Low", color: "chart-3", description: "Simple, standardized products/services" },
  medium: { label: "Medium", color: "chart-4", description: "Moderate complexity, some customization" },
  high: { label: "High", color: "destructive", description: "Complex, highly customized solutions" },
} as const;

export const MARKET_AVAILABILITY = {
  many_alternatives: { label: "Many Alternatives", color: "chart-3", description: "Highly competitive market" },
  limited_alternatives: { label: "Limited Alternatives", color: "chart-4", description: "Few viable options" },
  few_alternatives: { label: "Few Alternatives", color: "chart-4", description: "Very limited options" },
  monopolistic: { label: "Monopolistic", color: "destructive", description: "Single or dominant supplier" },
} as const;

export const BUSINESS_CRITICALITY = {
  routine: { label: "Routine", color: "muted-foreground", description: "Standard business operations" },
  important: { label: "Important", color: "chart-4", description: "Significant business impact" },
  critical: { label: "Critical", color: "destructive", description: "Essential for operations" },
  strategic: { label: "Strategic", color: "primary", description: "Key to business strategy" },
} as const;

export const RELATIONSHIP_TYPE = {
  transactional: { label: "Transactional", color: "muted-foreground", description: "Basic buyer-supplier relationship" },
  collaborative: { label: "Collaborative", color: "chart-4", description: "Working together on projects" },
  partnership: { label: "Partnership", color: "primary", description: "Strategic business partnership" },
  integration: { label: "Integration", color: "accent", description: "Deeply integrated operations" },
} as const;

export const ALERT_SEVERITIES = {
  low: { color: "muted-foreground", label: "Low" },
  medium: { color: "chart-4", label: "Medium" },
  high: { color: "destructive", label: "High" },
  critical: { color: "destructive", label: "Critical" },
} as const;

export const getRiskLevel = (score: number) => {
  if (score < 4) return "low";
  if (score < 7) return "medium";
  return "high";
};

export const formatCurrency = (amount: string | number) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `${num.toFixed(1)}%`;
};

// Import shared scoring functions
export { getSegmentRecommendation, calculateSupplierScore, determineSupplierSegment, type SupplierCriteria, type SegmentRecommendation } from "@shared/scoring";
