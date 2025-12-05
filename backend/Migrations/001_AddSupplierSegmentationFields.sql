-- Migration: Add Supplier Segmentation Fields
-- Description: Adds new columns to the Suppliers table to support supplier segmentation and risk analysis
-- Date: 2025-12-05

-- Check if the columns already exist before adding them
-- This makes the migration idempotent

BEGIN TRANSACTION;

-- Add Category column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'Category')
BEGIN
    ALTER TABLE Suppliers ADD Category NVARCHAR(255) NOT NULL DEFAULT '';
END

-- Add SegmentType column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'SegmentType')
BEGIN
    ALTER TABLE Suppliers ADD SegmentType NVARCHAR(100) NOT NULL DEFAULT '';
END

-- Add AnnualSpend column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'AnnualSpend')
BEGIN
    ALTER TABLE Suppliers ADD AnnualSpend DECIMAL(12,2) NOT NULL DEFAULT 0;
END

-- Add RiskScore column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'RiskScore')
BEGIN
    ALTER TABLE Suppliers ADD RiskScore DECIMAL(3,1) NOT NULL DEFAULT 0;
END

-- Add PerformanceScore column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'PerformanceScore')
BEGIN
    ALTER TABLE Suppliers ADD PerformanceScore DECIMAL(5,2) NOT NULL DEFAULT 0;
END

-- Add InnovationPotential column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'InnovationPotential')
BEGIN
    ALTER TABLE Suppliers ADD InnovationPotential INT NOT NULL DEFAULT 0;
END

-- Add SupplierComplexity column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'SupplierComplexity')
BEGIN
    ALTER TABLE Suppliers ADD SupplierComplexity NVARCHAR(50) NOT NULL DEFAULT '';
END

-- Add MarketAvailability column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'MarketAvailability')
BEGIN
    ALTER TABLE Suppliers ADD MarketAvailability NVARCHAR(50) NOT NULL DEFAULT '';
END

-- Add BusinessCriticality column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'BusinessCriticality')
BEGIN
    ALTER TABLE Suppliers ADD BusinessCriticality NVARCHAR(50) NOT NULL DEFAULT '';
END

-- Add RelationshipType column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'RelationshipType')
BEGIN
    ALTER TABLE Suppliers ADD RelationshipType NVARCHAR(50) NOT NULL DEFAULT '';
END

-- Add ContactInfo column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'ContactInfo')
BEGIN
    ALTER TABLE Suppliers ADD ContactInfo NVARCHAR(MAX) NULL;
END

-- Add Tags column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'Tags')
BEGIN
    ALTER TABLE Suppliers ADD Tags NVARCHAR(MAX) NULL;
END

-- Add Notes column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'Notes')
BEGIN
    ALTER TABLE Suppliers ADD Notes NVARCHAR(MAX) NULL;
END

-- Add UpdatedAt column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Suppliers' AND COLUMN_NAME = 'UpdatedAt')
BEGIN
    ALTER TABLE Suppliers ADD UpdatedAt DATETIME NOT NULL DEFAULT GETUTCDATE();
END

COMMIT TRANSACTION;

PRINT 'Migration 001_AddSupplierSegmentationFields completed successfully.';
