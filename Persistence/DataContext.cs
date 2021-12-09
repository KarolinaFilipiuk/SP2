using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    // public class DataContext : DbContext
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<Cloth> Clothes { get; set; }

        public DbSet<ClothAttendee> ClothAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }

        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ClothAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.ClothId}));

            builder.Entity<ClothAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Clothes)
                .HasForeignKey(aa => aa.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ClothAttendee>()
                .HasOne(u => u.Cloth)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ClothId)
                .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<Comment>()
                .HasOne(a => a.Cloth)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
