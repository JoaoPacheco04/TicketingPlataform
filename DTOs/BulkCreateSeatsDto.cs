namespace TicketingPlataform.DTOs
{
    public class BulkCreateSeatsDto
    {
        public Guid SectionId { get; set; }
        public int RowCount { get; set; }
        public int SeatsPerRow { get; set; }
    }
}
