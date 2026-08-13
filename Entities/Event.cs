namespace TicketingPlataform.Entities
{
    public class Event
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime SalesOpenDate { get; set; }
        public DateTime SalesCloseDate { get; set; }

        public Guid VenueId { get; set; }
        public Venue Venue { get; set; } = null!;
        public EventLogStatus Status { get; set; }
    }

    public enum EventLogStatus
    {
        Draft,
        Published,
        SoldOut,
        Cancelled
    }
}
