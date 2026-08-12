namespace TicketingPlataform.DTOs
{
    public class CreateSeatDto
    {
        public string Row { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public Guid SectionId { get; set; }
    }
}
