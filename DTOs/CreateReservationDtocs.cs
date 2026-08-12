namespace TicketingPlataform.DTOs
{
    public class CreateReservationDto
    {
        public Guid SeatId { get; set; }
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
    }
}