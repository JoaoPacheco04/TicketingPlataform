using TicketingPlataform.Entities;

namespace TicketingPlataform.DTOs
{
    public class CreateSectionDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public Guid VenueId { get; set; }
        public SeatLayoutType LayoutType { get; set; } = SeatLayoutType.Rows;
    }
}
