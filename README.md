# Supplier Information Management

A simple web application to manage supplier information and associated documents.

---

## Features

- RESTful backend API (`.NET 8`, C#, EF Core, SQL Server)
- Minimal React + Vite frontend (TypeScript)
- Azure SQL or local SQL Server database supported
- Add, view, and manage suppliers and their documents

---

## Prerequisites

- **.NET 8 SDK**: [Download here](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- **Node.js >= 18**: [Download here](https://nodejs.org/)
- **SQL Server**: Local (Express/Dev edition), Docker, or [Azure SQL](https://portal.azure.com/)

---

## Database Setup

### Local SQL Server

1. **Create the database:**
   - Using SSMS, Azure Data Studio, or `sqlcmd`:
     ```sql
     CREATE DATABASE SupplierInfo;
     ```

2. **Create tables:**
   - Run [`infrastructure/suppliers.sql`](infrastructure/suppliers.sql) against the `SupplierInfo` database:
     ```sql
     USE SupplierInfo;

     CREATE TABLE Suppliers (
         Id INT IDENTITY(1,1) PRIMARY KEY,
         Name NVARCHAR(128) NOT NULL,
         Commodity NVARCHAR(64) NOT NULL,
         ContactEmail NVARCHAR(128) NOT NULL,
         CreatedAt DATETIME NOT NULL DEFAULT(GETUTCDATE())
     );

     CREATE TABLE Documents (
         Id INT IDENTITY(1,1) PRIMARY KEY,
         FileName NVARCHAR(256) NOT NULL,
         BlobUri NVARCHAR(512) NOT NULL,
         SupplierId INT NOT NULL,
         UploadedAt DATETIME NOT NULL DEFAULT(GETUTCDATE()),
         CONSTRAINT FK_Documents_Suppliers FOREIGN KEY (SupplierId) REFERENCES Suppliers(Id)
     );
     ```

3. **Update backend connection string** (in `backend/appsettings.json`):

    ```json
    {
      "ConnectionStrings": {
        "SIMConnection": "Server=localhost;Database=SupplierInfo;User Id=sa;Password=yourStrong(!)Password;TrustServerCertificate=True;"
      }
    }
    ```

### Azure SQL

- [How to create Azure SQL Database](https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart).
- Update `backend/appsettings.json` with your Azure SQL connection string.

---

## Backend Setup

1. **Install dependencies:**

    ```
    cd backend
    dotnet restore
    ```

2. **Run the server:**

    ```
    dotnet run
    ```

    By default, the API is available at `https://localhost:5001` (Swagger UI at `/swagger`).

---

## Frontend Setup

1. **Install dependencies:**

    ```
    cd frontend
    npm install
    ```

2. **Run in development mode:**

    ```
    npm run dev
    ```

    The app runs at `http://localhost:3000`.

3. **Configure API endpoint:**

    Edit `frontend/src/api/supplierApi.ts` if needed:
    ```typescript
    const API_BASE = 'http://localhost:5000/api'; // or update for production/Azure
    ```

---

## Usage

- Visit [http://localhost:3000](http://localhost:3000) for the web frontend.
- Visit [https://localhost:5001/swagger](https://localhost:5001/swagger) for API docs/testing.
- Manage suppliers and documents via the interface.

---

## Notes

- If running backend and frontend on different ports/hosts, you may need to [enable CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors) in backend `Program.cs`.
- Update connection strings for your environment (local/Azure/production).
- For full CRUD (edit/add/delete) on frontend, extend React components with forms and API calls.

---

## Troubleshooting

- Make sure all dependencies are installed for both backend and frontend.
- "Cannot connect to database?" — check your connection string, firewall, SQL server status.
- "Frontend cannot access API?" — check ports, API_BASE, and CORS settings.

---

## License

MIT
