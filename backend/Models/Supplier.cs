namespace SupplierInformationManagement.Api.Models
{
    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Commodity { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
