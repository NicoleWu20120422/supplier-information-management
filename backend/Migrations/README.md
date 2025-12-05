# Database Migrations

This folder contains SQL migration scripts for the Supplier Information Management database.

## Migration Scripts

1. **001_AddSupplierSegmentationFields.sql** - Adds new columns to the Suppliers table to support supplier segmentation and risk analysis features
2. **002_SampleData.sql** - Inserts sample supplier data across all six supplier segments for testing

## How to Run Migrations

### Using SQL Server Management Studio (SSMS)
1. Open SSMS and connect to your SQL Server instance
2. Open the migration script file
3. Ensure you're connected to the correct database (SupplierInfo)
4. Execute the script (F5 or click Execute)

### Using sqlcmd Command Line
```bash
sqlcmd -S localhost -d SupplierInfo -U supplier -P TimothyZhou_123 -i 001_AddSupplierSegmentationFields.sql
sqlcmd -S localhost -d SupplierInfo -U supplier -P TimothyZhou_123 -i 002_SampleData.sql
```

### Using Entity Framework Migrations (Alternative)
If you prefer to use EF Core migrations instead of manual SQL scripts:

```bash
cd backend
dotnet ef migrations add AddSupplierSegmentationFields
dotnet ef database update
```

## Migration Order

Run migrations in numerical order:
1. 001_AddSupplierSegmentationFields.sql - Adds the required columns
2. 002_SampleData.sql - Populates with test data

## Testing the Changes

After running the migrations, verify the data:

```sql
-- Check table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Suppliers'
ORDER BY ORDINAL_POSITION;

-- View sample data by segment
SELECT SegmentType, COUNT(*) as Count, 
       FORMAT(SUM(AnnualSpend), 'C') as TotalSpend
FROM Suppliers
GROUP BY SegmentType;
```

## Notes

- All migration scripts are idempotent and can be run multiple times safely
- Sample data script checks for existing records before inserting
- Make sure to backup your database before running migrations in production
- The connection string in appsettings.json should match your SQL Server configuration
