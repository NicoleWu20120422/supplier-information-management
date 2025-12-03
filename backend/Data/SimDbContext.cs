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
