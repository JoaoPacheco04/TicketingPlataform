namespace TicketingPlataform.Entities
{
    public class Reservation
    {
        public Guid Id { get; set; }
        public Guid SeatId { get; set; }
        public Seat Seat { get; set; } = null!;

        public Guid EventId { get; set; }
        public Event Event { get; set; } = null!;

        public Guid UserId { get; set; }

        public ReservationStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
    }

    public enum ReservationStatus
    {
        Pending,
        Confirmed,
        Expired,
        Cancelled
    }
}
