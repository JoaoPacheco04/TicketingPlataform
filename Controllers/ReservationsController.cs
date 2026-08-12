using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using TicketingPlataform.Data;
using TicketingPlataform.DTOs;
using TicketingPlataform.Entities;
using TicketingPlataform.Hubs;

namespace TicketingPlataform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class ReservationsController : ControllerBase
    {
        private readonly TicketingDbContext _context;
        private readonly IHubContext<SeatReservationHub> _hubContext;

        public ReservationsController(TicketingDbContext context, IHubContext<SeatReservationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
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
        [HttpPost]
        public async Task<IActionResult> CreateReservation(CreateReservationDto dto)
        {
            var userIdClaim = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid token");
            }

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
                UserId = userId,
                Status = ReservationStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10)
            };

            _context.Entry(seat).State = EntityState.Modified;
            _context.Reservations.Add(reservation);

            try
            {
                await _context.SaveChangesAsync();
                await _hubContext.Clients.Group(dto.EventId.ToString())
                    .SendAsync("SeatReserved", new { seatId = dto.SeatId, status = "Pending" });
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("This seat was just reserved by someone else. Please try another seat.");
            }

            return CreatedAtAction(nameof(GetReservations), new { id = reservation.Id }, reservation);
        }

        [HttpPatch("{id}/confirm")]
        public async Task<IActionResult> ConfirmReservation(Guid id)
        {
            var reservation = await _context.Reservations.FirstOrDefaultAsync(r => r.Id == id);
            if (reservation == null)
            {
                return NotFound("Reservation not found");
            }

            if (reservation.Status != ReservationStatus.Pending)
            {
                return BadRequest($"Reservation cannot be confirmed because its current status is {reservation.Status}.");
            }

            if (reservation.ExpiresAt < DateTime.UtcNow)
            {
                reservation.Status = ReservationStatus.Expired;
                await _context.SaveChangesAsync();
                return BadRequest("Reservation has already expired.");
            }

            reservation.Status = ReservationStatus.Confirmed;
            reservation.QrCode = reservation.Id.ToString();
            await _context.SaveChangesAsync();

            return Ok(reservation);
        }

        [HttpGet("{id}/qrcode")]
        public async Task<IActionResult> GetQrCode(Guid id)
        {
            var reservation = await _context.Reservations.FirstOrDefaultAsync(r => r.Id == id);
            if (reservation == null || reservation.QrCode == null)
            {
                return NotFound("Reservation not found or not confirmed yet");
            }

            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(reservation.QrCode, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);
            var qrCodeImage = qrCode.GetGraphic(20);

            return File(qrCodeImage, "image/png");
        }

        [HttpPost("checkin")]
        [Authorize(Roles = "Organizer")]
        public async Task<IActionResult> CheckIn([FromQuery] string qrCode)
        {
            var reservation = await _context.Reservations.FirstOrDefaultAsync(r => r.QrCode == qrCode);
            if (reservation == null)
            {
                return NotFound("Invalid QR code");
            }

            if (reservation.Status != ReservationStatus.Confirmed)
            {
                return BadRequest($"Ticket is not valid for check-in. Status: {reservation.Status}");
            }

            if (reservation.CheckedIn)
            {
                return BadRequest("Ticket has already been used for check-in");
            }

            reservation.CheckedIn = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Check-in successful", reservationId = reservation.Id });
        }
    }
}