using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketingPlataform.Data;
using TicketingPlataform.DTOs;
using TicketingPlataform.Entities;

namespace TicketingPlataform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly TicketingDbContext _context;

        public ReservationsController(TicketingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Seat)
                .Include(r => r.Event)
                .ToListAsync();

            return Ok(reservations);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReservation(CreateReservationDto dto)
        {
            var seat = await _context.Seats.FirstOrDefaultAsync(s => s.Id == dto.SeatId);
            if (seat == null)
            {
                return NotFound("Seat not found");
            }

            var eventExists = await _context.Events.AnyAsync(e => e.Id == dto.EventId);
            if (!eventExists)
            {
                return NotFound("Event not found");
            }

            var hasActiveReservation = await _context.Reservations.AnyAsync(r =>
                r.SeatId == dto.SeatId &&
                r.EventId == dto.EventId &&
                (r.Status == ReservationStatus.Pending || r.Status == ReservationStatus.Confirmed));

            if (hasActiveReservation)
            {
                return Conflict("Seat is already reserved for this event.");
            }

            var reservation = new Reservation
            {
                Id = Guid.NewGuid(),
                SeatId = dto.SeatId,
                EventId = dto.EventId,
                UserId = dto.UserId,
                Status = ReservationStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10)
            };

            _context.Entry(seat).State = EntityState.Modified;
            _context.Reservations.Add(reservation);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("This seat was just reserved by someone else. Please try another seat.");
            }

            return CreatedAtAction(nameof(GetReservations), new { id = reservation.Id }, reservation);
        }
    }
}