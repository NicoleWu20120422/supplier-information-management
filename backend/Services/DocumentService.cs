using SupplierInformationManagement.Api.Data;
using SupplierInformationManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace SupplierInformationManagement.Api.Services
{
    public class DocumentService
    {
        private readonly SimDbContext _db;

        public DocumentService(SimDbContext db)
        {
            _db = db;
        }

        public async Task<List<Document>> GetDocumentsBySupplierAsync(int supplierId)
        {
            return await _db.Documents
                .Where(d => d.SupplierId == supplierId)
                .ToListAsync();
        }

        public async Task<Document?> GetDocumentAsync(int id)
        {
            return await _db.Documents.FindAsync(id);
        }

        public async Task<Document> AddDocumentAsync(Document doc)
        {
            _db.Documents.Add(doc);
            await _db.SaveChangesAsync();
            return doc;
        }

        public async Task<bool> DeleteDocumentAsync(int id)
        {
            var doc = await _db.Documents.FindAsync(id);
            if (doc == null)
                return false;
            _db.Documents.Remove(doc);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
