namespace TicketingPlataform.DTOs
{
    public class CreateEventDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime SalesOpenDate { get; set; }
        public DateTime SalesCloseDate { get; set; }
        public Guid VenueId { get; set; }
    }
}
