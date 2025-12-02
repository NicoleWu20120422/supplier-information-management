namespace SupplierInformationManagement.Api.Models
{
    public class Document
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string BlobUri { get; set; } = string.Empty;
        public int SupplierId { get; set; }
        public Supplier? Supplier { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
