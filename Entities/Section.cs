using System.ComponentModel.DataAnnotations.Schema;

namespace TicketingPlataform.Entities
{
    public class Section
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal BasePrice { get; set; }

        public Guid VenueId { get; set; }
        public Venue Venue { get; set; } = null!;

        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}