using Microsoft.EntityFrameworkCore;
using TicketingPlataform.Entities;

namespace TicketingPlataform.Data
{
    public class TicketingDbContext : DbContext
    {
        public TicketingDbContext(DbContextOptions<TicketingDbContext> options) : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Reservation> Reservations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Seat)
                .WithMany()
                .HasForeignKey(r => r.SeatId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Event)
                .WithMany()
                .HasForeignKey(r => r.EventId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}