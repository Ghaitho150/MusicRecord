using Microsoft.EntityFrameworkCore;
using MusicRecord.Server.Models;

namespace MusicRecord.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ArtistRecord> Artists { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ArtistRecord>()
                .Property(a => a.Rate)
                .HasPrecision(12, 8);

            modelBuilder.Entity<ArtistRecord>()
                .Property(a => a.Payout)
                .HasPrecision(18, 2);
        }
    }
}
