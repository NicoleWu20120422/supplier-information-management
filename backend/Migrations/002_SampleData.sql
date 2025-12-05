-- Sample Data: Supplier Segmentation Test Data
-- Description: Inserts sample supplier data across all six supplier segments for testing
-- Date: 2025-12-05
-- Note: This script can be run multiple times safely using INSERT ... WHERE NOT EXISTS

BEGIN TRANSACTION;

-- Trusted Suppliers - High performance, low risk, established relationship
INSERT INTO Suppliers (Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                       InnovationPotential, SupplierComplexity, MarketAvailability, 
                       BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                       CreatedAt, UpdatedAt)
SELECT * FROM (VALUES
    ('TechCore Solutions', 'IT Services', 'trusted_suppliers', 2500000.00, 2.5, 95.50, 
     8, 'medium', 'limited_alternatives', 'strategic', 'partnership',
     'IT Hardware', 'contact@techcore.com', GETUTCDATE(), GETUTCDATE()),
    ('GlobalMfg Partners', 'Manufacturing', 'trusted_suppliers', 3200000.00, 1.8, 97.20, 
     7, 'high', 'few_alternatives', 'critical', 'partnership',
     'Manufacturing', 'info@globalmfg.com', GETUTCDATE(), GETUTCDATE()),
    ('Reliable Logistics Inc', 'Logistics', 'trusted_suppliers', 1800000.00, 2.2, 94.80, 
     5, 'low', 'many_alternatives', 'important', 'collaborative',
     'Logistics', 'support@reliablelogistics.com', GETUTCDATE(), GETUTCDATE())
) AS SampleData(Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                InnovationPotential, SupplierComplexity, MarketAvailability, 
                BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                CreatedAt, UpdatedAt)
WHERE NOT EXISTS (
    SELECT 1 FROM Suppliers WHERE Name = SampleData.Name
);

-- Switch Candidates - Poor performance, high cost, needs replacement
INSERT INTO Suppliers (Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                       InnovationPotential, SupplierComplexity, MarketAvailability, 
                       BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                       CreatedAt, UpdatedAt)
SELECT * FROM (VALUES
    ('OldTech Services', 'IT Services', 'switch_candidates', 450000.00, 8.5, 65.30, 
     2, 'low', 'many_alternatives', 'routine', 'transactional',
     'IT Support', 'help@oldtech.com', GETUTCDATE(), GETUTCDATE()),
    ('Budget Components Co', 'Components', 'switch_candidates', 320000.00, 7.8, 68.50, 
     1, 'low', 'many_alternatives', 'routine', 'transactional',
     'Parts', 'sales@budgetcomponents.com', GETUTCDATE(), GETUTCDATE())
) AS SampleData(Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                InnovationPotential, SupplierComplexity, MarketAvailability, 
                BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                CreatedAt, UpdatedAt)
WHERE NOT EXISTS (
    SELECT 1 FROM Suppliers WHERE Name = SampleData.Name
);

-- Commodity Partnerships - Standard suppliers for routine purchases
INSERT INTO Suppliers (Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                       InnovationPotential, SupplierComplexity, MarketAvailability, 
                       BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                       CreatedAt, UpdatedAt)
SELECT * FROM (VALUES
    ('Office Supplies Plus', 'Office Supplies', 'commodity_partnerships', 180000.00, 3.5, 82.40, 
     3, 'low', 'many_alternatives', 'routine', 'transactional',
     'Office Supplies', 'orders@officesuppliesplus.com', GETUTCDATE(), GETUTCDATE()),
    ('Standard Parts Inc', 'Parts', 'commodity_partnerships', 280000.00, 4.2, 79.80, 
     2, 'low', 'many_alternatives', 'routine', 'transactional',
     'Generic Parts', 'info@standardparts.com', GETUTCDATE(), GETUTCDATE()),
    ('Bulk Materials Co', 'Raw Materials', 'commodity_partnerships', 520000.00, 3.8, 81.20, 
     3, 'low', 'many_alternatives', 'important', 'transactional',
     'Raw Materials', 'sales@bulkmaterials.com', GETUTCDATE(), GETUTCDATE())
) AS SampleData(Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                InnovationPotential, SupplierComplexity, MarketAvailability, 
                BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                CreatedAt, UpdatedAt)
WHERE NOT EXISTS (
    SELECT 1 FROM Suppliers WHERE Name = SampleData.Name
);

-- Innovative Partnerships - Suppliers driving innovation and development
INSERT INTO Suppliers (Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                       InnovationPotential, SupplierComplexity, MarketAvailability, 
                       BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                       CreatedAt, UpdatedAt)
SELECT * FROM (VALUES
    ('InnovateTech Labs', 'R&D', 'innovative_partnerships', 1900000.00, 4.5, 91.30, 
     9, 'high', 'few_alternatives', 'strategic', 'partnership',
     'Technology', 'innovation@innovatetech.com', GETUTCDATE(), GETUTCDATE()),
    ('NextGen Materials', 'Advanced Materials', 'innovative_partnerships', 2100000.00, 3.8, 92.50, 
     10, 'high', 'limited_alternatives', 'strategic', 'partnership',
     'Materials', 'research@nextgenmaterials.com', GETUTCDATE(), GETUTCDATE())
) AS SampleData(Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                InnovationPotential, SupplierComplexity, MarketAvailability, 
                BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                CreatedAt, UpdatedAt)
WHERE NOT EXISTS (
    SELECT 1 FROM Suppliers WHERE Name = SampleData.Name
);

-- Proprietary Information - Suppliers with access to sensitive information
INSERT INTO Suppliers (Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                       InnovationPotential, SupplierComplexity, MarketAvailability, 
                       BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                       CreatedAt, UpdatedAt)
SELECT * FROM (VALUES
    ('SecureData Systems', 'Data Services', 'proprietary_information', 1500000.00, 3.2, 93.80, 
     7, 'high', 'limited_alternatives', 'critical', 'partnership',
     'Data Management', 'security@securedata.com', GETUTCDATE(), GETUTCDATE()),
    ('Confidential Consulting', 'Consulting', 'proprietary_information', 980000.00, 2.9, 94.20, 
     6, 'medium', 'few_alternatives', 'strategic', 'partnership',
     'Consulting', 'contact@confidentialconsulting.com', GETUTCDATE(), GETUTCDATE())
) AS SampleData(Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                InnovationPotential, SupplierComplexity, MarketAvailability, 
                BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                CreatedAt, UpdatedAt)
WHERE NOT EXISTS (
    SELECT 1 FROM Suppliers WHERE Name = SampleData.Name
);

-- Supplier Integration - Deeply integrated operational partners
INSERT INTO Suppliers (Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                       InnovationPotential, SupplierComplexity, MarketAvailability, 
                       BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                       CreatedAt, UpdatedAt)
SELECT * FROM (VALUES
    ('IntegratedSystems Corp', 'ERP Systems', 'supplier_integration', 4200000.00, 4.1, 93.50, 
     8, 'high', 'monopolistic', 'critical', 'integration',
     'Enterprise Software', 'integration@integratedsystems.com', GETUTCDATE(), GETUTCDATE()),
    ('Core Operations Ltd', 'Operations', 'supplier_integration', 3800000.00, 3.5, 95.10, 
     7, 'high', 'few_alternatives', 'critical', 'integration',
     'Operations Management', 'ops@coreoperations.com', GETUTCDATE(), GETUTCDATE())
) AS SampleData(Name, Category, SegmentType, AnnualSpend, RiskScore, PerformanceScore, 
                InnovationPotential, SupplierComplexity, MarketAvailability, 
                BusinessCriticality, RelationshipType, Commodity, ContactEmail, 
                CreatedAt, UpdatedAt)
WHERE NOT EXISTS (
    SELECT 1 FROM Suppliers WHERE Name = SampleData.Name
);

COMMIT TRANSACTION;

-- Display summary of inserted data
SELECT SegmentType, COUNT(*) as SupplierCount, 
       FORMAT(SUM(AnnualSpend), 'C', 'en-US') as TotalSpend,
       FORMAT(AVG(RiskScore), 'N1') as AvgRisk,
       FORMAT(AVG(PerformanceScore), 'N1') as AvgPerformance
FROM Suppliers
GROUP BY SegmentType
ORDER BY SUM(AnnualSpend) DESC;

PRINT 'Sample data inserted successfully.';
