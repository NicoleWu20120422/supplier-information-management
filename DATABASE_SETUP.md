# Quick Start Guide - Database Setup

This guide helps you set up the database for the Supplier Information Management application.

## Prerequisites

- SQL Server installed and running (SQL Server 2019+, SQL Server Express, or SQL Server in Docker)
- .NET 8.0 SDK installed
- Node.js 16+ installed

## Step-by-Step Database Setup

### Option 1: Using SQL Server Management Studio (SSMS) - Recommended

1. **Open SSMS** and connect to your SQL Server instance (localhost)

2. **Create the database:**
   ```sql
   CREATE DATABASE SupplierInfo;
   GO
   ```

3. **Create the user (if needed):**
   ```sql
   USE master;
   GO
   CREATE LOGIN supplier WITH PASSWORD = 'TimothyZhou_123';
   GO
   USE SupplierInfo;
   GO
   CREATE USER supplier FOR LOGIN supplier;
   GO
   ALTER ROLE db_owner ADD MEMBER supplier;
   GO
   ```

4. **Run the migration scripts:**
   - Open `backend/Migrations/001_AddSupplierSegmentationFields.sql` in SSMS
   - Ensure you're connected to the `SupplierInfo` database
   - Execute the script (F5)
   - Open `backend/Migrations/002_SampleData.sql`
   - Execute the script (F5)

5. **Verify the setup:**
   ```sql
   USE SupplierInfo;
   GO
   
   -- Check table exists and has the new columns
   SELECT TOP 1 * FROM Suppliers;
   
   -- Count suppliers by segment
   SELECT SegmentType, COUNT(*) as Count
   FROM Suppliers
   GROUP BY SegmentType;
   ```
   You should see 13 suppliers across 6 segments.

### Option 2: Using sqlcmd Command Line

1. **Create database and user:**
   ```bash
   # Connect as admin user (adjust credentials as needed)
   sqlcmd -S localhost -U sa -P YourSaPassword
   
   # Then run:
   CREATE DATABASE SupplierInfo;
   GO
   CREATE LOGIN supplier WITH PASSWORD = 'TimothyZhou_123';
   GO
   USE SupplierInfo;
   GO
   CREATE USER supplier FOR LOGIN supplier;
   GO
   ALTER ROLE db_owner ADD MEMBER supplier;
   GO
   EXIT
   ```

2. **Run migrations:**
   ```bash
   cd backend/Migrations
   sqlcmd -S localhost -d SupplierInfo -U supplier -P TimothyZhou_123 -i 001_AddSupplierSegmentationFields.sql
   sqlcmd -S localhost -d SupplierInfo -U supplier -P TimothyZhou_123 -i 002_SampleData.sql
   ```

### Option 3: Using SQL Server in Docker (Mac/Linux)

1. **Start SQL Server container:**
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Password" \
      -p 1433:1433 --name sql_server_dev \
      -d mcr.microsoft.com/mssql/server:2022-latest
   ```

2. **Create database:**
   ```bash
   docker exec -it sql_server_dev /opt/mssql-tools/bin/sqlcmd \
      -S localhost -U sa -P "YourStrong@Password" \
      -Q "CREATE DATABASE SupplierInfo"
   ```

3. **Copy migration files to container:**
   ```bash
   cd backend/Migrations
   docker cp 001_AddSupplierSegmentationFields.sql sql_server_dev:/tmp/
   docker cp 002_SampleData.sql sql_server_dev:/tmp/
   ```

4. **Run migrations:**
   ```bash
   docker exec -it sql_server_dev /opt/mssql-tools/bin/sqlcmd \
      -S localhost -U sa -P "YourStrong@Password" \
      -d SupplierInfo -i /tmp/001_AddSupplierSegmentationFields.sql
   
   docker exec -it sql_server_dev /opt/mssql-tools/bin/sqlcmd \
      -S localhost -U sa -P "YourStrong@Password" \
      -d SupplierInfo -i /tmp/002_SampleData.sql
   ```

5. **Update connection string in `backend/appsettings.json`:**
   ```json
   {
     "ConnectionStrings": {
       "SIMConnection": "Server=localhost;Database=SupplierInfo;User Id=sa;Password=YourStrong@Password;TrustServerCertificate=True;"
     }
   }
   ```

## Verify Database Setup

Run this query to confirm everything is set up correctly:

```sql
USE SupplierInfo;
GO

-- Check table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Suppliers'
ORDER BY ORDINAL_POSITION;

-- Verify data
SELECT 
    SegmentType,
    COUNT(*) as SupplierCount,
    FORMAT(SUM(AnnualSpend), 'C', 'en-US') as TotalSpend,
    FORMAT(AVG(RiskScore), 'N1') as AvgRisk
FROM Suppliers
GROUP BY SegmentType;
```

Expected output: 6 rows showing different segment types with supplier counts.

## Start the Application

Once the database is set up:

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   dotnet run
   ```
   Wait for: `Now listening on: http://localhost:5000`
   
   **Test backend is working:**
   - Open http://localhost:5000/api/supplier in browser
   - Should see JSON array with 13 suppliers

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm install  # First time only
   npm run dev
   ```
   Opens: http://localhost:3000

3. **View the application:**
   - Navigate to http://localhost:3000
   - Dashboard should show supplier segments with data

## Troubleshooting

### Backend Returns HTTP 500 Error

**Error:** `localhost is currently unable to handle this request. HTTP ERROR 500`

**Cause:** Database connection failed or migrations not run.

**Solution:**
1. Check SQL Server is running
2. Verify connection string in `backend/appsettings.json`
3. Run the migration scripts (see options above)
4. Check backend terminal for detailed error message
5. Restart backend: `dotnet run`

### "Invalid object name 'Suppliers'" Error

**Cause:** Migrations not run yet.

**Solution:**
Run the migration scripts in order:
1. `001_AddSupplierSegmentationFields.sql`
2. `002_SampleData.sql`

### "Login failed for user 'supplier'" Error

**Cause:** User doesn't exist or wrong password.

**Solution:**
1. Create the user (see Option 1 or 2 above)
2. Or update `appsettings.json` with correct credentials
3. Ensure user has db_owner role on SupplierInfo database

### Port 1433 Already in Use

**Cause:** Another SQL Server instance or process is using port 1433.

**Solution:**
- Find and stop the conflicting process, OR
- Use a different port and update connection string, OR
- Use the existing SQL Server instance

## Additional Resources

- [SQL Server Installation Guide](https://docs.microsoft.com/en-us/sql/database-engine/install-windows/install-sql-server)
- [SQL Server Docker Setup](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Full troubleshooting guide
- [backend/Migrations/README.md](./backend/Migrations/README.md) - Migration details
