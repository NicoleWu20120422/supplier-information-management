namespace SupplierInformationManagement.Api.Models
{
    /// <summary>
    /// Supplier model with fields for supplier segmentation and risk analysis.
    /// Matches the TypeORM entity and frontend schema for comprehensive supplier management.
    /// </summary>
    public class Supplier
    {
        public int Id { get; set; }
        
        // Basic Information
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Product/service category
        public string Commodity { get; set; } = string.Empty; // Legacy field, kept for backward compatibility
        public string ContactEmail { get; set; } = string.Empty;
        
        // Segmentation Fields - used by frontend to categorize suppliers into strategic segments
        public string SegmentType { get; set; } = string.Empty; // e.g., trusted_suppliers, switch_candidates, commodity_partnerships, etc.
        
        // Financial and Performance Metrics
        public decimal AnnualSpend { get; set; } = 0; // Total annual spend with this supplier
        public decimal RiskScore { get; set; } = 0; // Risk score (0-10 scale)
        public decimal PerformanceScore { get; set; } = 0; // Performance score (0-100 scale)
        public int InnovationPotential { get; set; } = 0; // Innovation potential rating
        
        // Kraljic Matrix and Segmentation Criteria
        public string SupplierComplexity { get; set; } = string.Empty; // low, medium, high
        public string MarketAvailability { get; set; } = string.Empty; // many_alternatives, limited_alternatives, etc.
        public string BusinessCriticality { get; set; } = string.Empty; // routine, important, critical, strategic
        public string RelationshipType { get; set; } = string.Empty; // transactional, collaborative, partnership, integration
        
        // Additional Information
        public string? ContactInfo { get; set; } // JSON string with contact details
        public string? Tags { get; set; } // Comma-separated or JSON array of tags
        public string? Notes { get; set; } // General notes about the supplier
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
