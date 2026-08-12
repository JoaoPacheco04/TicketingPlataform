using Microsoft.EntityFrameworkCore;
using TicketingPlataform.Entities;

namespace TicketingPlataform.Data
{
    public class TicketingDbContext : DbContext
    {
        public TicketingDbContext(DbContextOptions<TicketingDbContext> options) : base(options)
        {
        }
        public DbSet<Event> Events { get; set; } = null!;
        public DbSet<Venue> Venues { get; set; } = null!;
        public DbSet<Section> Sections { get; set; } = null!;
        public DbSet<Seat> Seats { get; set; } = null!;
        
    }
}