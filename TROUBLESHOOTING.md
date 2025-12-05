# Troubleshooting Guide

This document provides solutions to common issues when running the Supplier Information Management application.

## Frontend Issues

### Error: "Unexpected token '<'" or "Failed to fetch supplier segment data"

**Symptoms:**
- Frontend displays "Error Loading Supplier Segments"
- Console shows error: `Unexpected token '<'`
- Cannot load data from backend API

**Root Cause:**
The backend API server is not running or not accessible. The frontend is trying to fetch from `/api/suppliers` but receiving HTML instead of JSON.

**Solution:**

1. **Ensure backend is running:**
   ```bash
   cd backend
   dotnet run
   ```
   You should see: `Now listening on: http://localhost:5000`

2. **Verify backend is accessible:**
   Open http://localhost:5000/api/supplier in your browser
   - Should return JSON array of suppliers
   - If you see "Cannot GET /api/supplier", check the route is correct

3. **Check port configuration:**
   - Backend runs on `http://localhost:5000` (HTTP) or `https://localhost:5001` (HTTPS)
   - Frontend proxy is configured to forward `/api/*` to backend
   - Vite dev server runs on `http://localhost:3000`

4. **Restart both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   dotnet run
   
   # Terminal 2 - Frontend (new terminal)
   cd frontend
   npm run dev
   ```

5. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or open in incognito/private window

### Frontend Not Loading After npm install

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Backend Issues

### Database Connection Failed

**Symptoms:**
- Backend crashes on startup
- Error: "Cannot open database"

**Solution:**

1. **Check SQL Server is running:**
   ```bash
   # On Windows with SQL Server
   # Check if MSSQL service is running in Services
   
   # On Mac/Linux with Docker
   docker ps | grep mssql
   ```

2. **Verify connection string in `appsettings.json`:**
   ```json
   {
     "ConnectionStrings": {
       "SIMConnection": "Server=localhost;Database=SupplierInfo;User Id=supplier;Password=YourPassword;TrustServerCertificate=True;"
     }
   }
   ```

3. **Run migrations:**
   ```bash
   cd backend/Migrations
   sqlcmd -S localhost -d SupplierInfo -U supplier -P YourPassword -i 001_AddSupplierSegmentationFields.sql
   sqlcmd -S localhost -d SupplierInfo -U supplier -P YourPassword -i 002_SampleData.sql
   ```

### CORS Errors

**Symptoms:**
- Browser console shows: "Access to fetch at 'http://localhost:5000/api/supplier' from origin 'http://localhost:3000' has been blocked by CORS policy"

**Solution:**
The CORS configuration in `Program.cs` should already be correct. If you're still seeing this:

1. Verify `Program.cs` has CORS configured:
   ```csharp
   builder.WithOrigins("http://localhost:3000")
   ```

2. Ensure middleware order is correct:
   ```csharp
   app.UseRouting();
   app.UseCors(MyAllowSpecificOrigins);  // Must be after UseRouting
   app.UseAuthorization();
   ```

3. Restart the backend after changes

### Port Already in Use

**Symptoms:**
- Error: "Unable to bind to http://localhost:5000"

**Solution:**
```bash
# Find and kill process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or change the port in appsettings.json
```

## Data Issues

### No Suppliers Showing in Segments

**Symptoms:**
- UI loads successfully
- No error messages
- Supplier segment cards show "0 suppliers"

**Solution:**

1. **Verify database has data:**
   ```sql
   SELECT COUNT(*) FROM Suppliers;
   SELECT SegmentType, COUNT(*) FROM Suppliers GROUP BY SegmentType;
   ```

2. **Re-run sample data script:**
   ```bash
   cd backend/Migrations
   sqlcmd -S localhost -d SupplierInfo -U supplier -P YourPassword -i 002_SampleData.sql
   ```

3. **Check API returns data:**
   Open http://localhost:5000/api/supplier in browser
   - Should return JSON array with 13 suppliers
   - Check each supplier has `segmentType` field (camelCase)

### Data Format Issues

**Symptoms:**
- Segments load but show NaN or incorrect values
- Console errors about parsing numbers

**Solution:**
This should be fixed with the latest changes. If persisting:

1. Check backend is using camelCase JSON serialization (Program.cs)
2. Verify frontend schema handles both string and number types
3. Clear browser cache and restart dev server

## Development Tips

### Quick Full Reset

```bash
# Stop all servers (Ctrl+C in terminals)

# Backend
cd backend
dotnet clean
dotnet build
dotnet run

# Frontend (new terminal)
cd frontend
rm -rf node_modules dist
npm install
npm run dev
```

### Check Everything is Working

```bash
# 1. Backend health check
curl http://localhost:5000/api/supplier

# 2. Should return JSON with 13 suppliers
# 3. Frontend should load at http://localhost:3000
# 4. Navigate to Dashboard - should see supplier segments
```

## Getting Help

If you're still experiencing issues:

1. Check the browser console (F12) for detailed error messages
2. Check backend terminal for error logs
3. Verify you've run database migrations
4. Ensure both backend and frontend are running
5. Try the "Quick Full Reset" steps above

## Common Environment Issues

### Node Version
Ensure Node.js version 16+ is installed:
```bash
node --version  # Should be v16.x or higher
```

### .NET Version
Ensure .NET 8.0 SDK is installed:
```bash
dotnet --version  # Should be 8.0.x
```

### SQL Server
Ensure SQL Server is installed and running:
- Windows: SQL Server 2019+ or SQL Server Express
- Mac/Linux: SQL Server in Docker container
