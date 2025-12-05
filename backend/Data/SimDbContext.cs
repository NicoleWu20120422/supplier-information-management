using Microsoft.EntityFrameworkCore;
using SupplierInformationManagement.Api.Models;

namespace SupplierInformationManagement.Api.Data
{
    public class SimDbContext : DbContext
    {
        public SimDbContext(DbContextOptions<SimDbContext> options)
            : base(options)
        {
        }

        public DbSet<Supplier> Suppliers => Set<Supplier>();
        public DbSet<Document> Documents => Set<Document>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Category).IsRequired();
                entity.Property(e => e.SegmentType).IsRequired();
                
                // Configure decimal precision for financial and performance metrics
                entity.Property(e => e.AnnualSpend).HasColumnType("decimal(12,2)");
                entity.Property(e => e.RiskScore).HasColumnType("decimal(3,1)");
                entity.Property(e => e.PerformanceScore).HasColumnType("decimal(5,2)");
                
                // Set default values for timestamps
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            modelBuilder.Entity<Document>(entity =>
            {
                entity.HasKey(d => d.Id);
                entity.Property(d => d.FileName).IsRequired();
                entity.HasOne(d => d.Supplier)
                      .WithMany()
                      .HasForeignKey(d => d.SupplierId);
            });
        }
    }
}
