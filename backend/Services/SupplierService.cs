using SupplierInformationManagement.Api.Data;
using SupplierInformationManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace SupplierInformationManagement.Api.Services
{
    public class SupplierService
    {
        private readonly SimDbContext _db;

        public SupplierService(SimDbContext db)
        {
            _db = db;
        }

        public async Task<List<Supplier>> GetAllSuppliersAsync()
        {
            return await _db.Suppliers.ToListAsync();
        }

        public async Task<Supplier?> GetSupplierByIdAsync(int id)
        {
            return await _db.Suppliers.FindAsync(id);
        }

        public async Task<Supplier> CreateSupplierAsync(Supplier supplier)
        {
            _db.Suppliers.Add(supplier);
            await _db.SaveChangesAsync();
            return supplier;
        }

        public async Task<Supplier?> UpdateSupplierAsync(int id, Supplier updated)
        {
            var supplier = await _db.Suppliers.FindAsync(id);
            if (supplier == null)
                return null;

            supplier.Name = updated.Name;
            supplier.Commodity = updated.Commodity;
            supplier.ContactEmail = updated.ContactEmail;

            await _db.SaveChangesAsync();
            return supplier;
        }

        public async Task<bool> DeleteSupplierAsync(int id)
        {
            var supplier = await _db.Suppliers.FindAsync(id);
            if (supplier == null)
                return false;
            _db.Suppliers.Remove(supplier);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
