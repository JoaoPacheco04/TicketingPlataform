namespace TicketingPlataform.DTOs
{
    public class CreateReservationDto
    {
        public Guid SeatId { get; set; }
        public Guid EventId { get; set; }
    }
}