using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using TicketingPlataform.Data;
using TicketingPlataform.DTOs;
using TicketingPlataform.Entities;

namespace TicketingPlataform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly TicketingDbContext _context;
        private readonly IConnectionMultiplexer _redis;

        public EventsController(TicketingDbContext context, IConnectionMultiplexer redis)
        {
            _context = context;
            _redis = redis;
        }

        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _context.Events
                .Include(e => e.Venue)
                .ToListAsync();
            return Ok(events);
        }

        [HttpPost]
        [Authorize(Roles = "Organizer")]

        public async Task<IActionResult> CreateEvent(CreateEventDto dto)
        {
            var venueExists = await _context.Venues.AnyAsync(v => v.Id == dto.VenueId);
            if (!venueExists)
            {
                return NotFound("Venue not found");
            }

            var newEvent = new Event
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                SalesOpenDate = dto.SalesOpenDate,
                SalesCloseDate = dto.SalesCloseDate,
                VenueId = dto.VenueId,
                Status = EventLogStatus.Draft
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvents), new { id = newEvent.Id }, newEvent);
        }

        [HttpGet("{id}/availability")]
        public async Task<IActionResult> GetAvailability(Guid id)
        {
            var cacheKey = $"event:{id}:availability";
            var cachedValue = await _redis.GetDatabase().StringGetAsync(cacheKey);

            if (cachedValue.HasValue)
            {
                return Ok(new { availableSeats = int.Parse(cachedValue!), fromCache = true });
            }

            var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.Id == id);
            if (eventEntity == null)
            {
                return NotFound("Event not found");
            }

            var totalSeats = await _context.Seats
                .Where(s => s.Section.VenueId == eventEntity.VenueId)
                .CountAsync();

            var reservedSeats = await _context.Reservations
                .Where(r => r.EventId == id && (r.Status == ReservationStatus.Pending || r.Status == ReservationStatus.Confirmed))
                .CountAsync();

            var availableSeats = totalSeats - reservedSeats;

            await _redis.GetDatabase().StringSetAsync(cacheKey, availableSeats.ToString(), TimeSpan.FromSeconds(10));

            return Ok(new { availableSeats, fromCache = false });
        }
        [HttpGet("{id}/dashboard")]
        public async Task<IActionResult> GetDashboard(Guid id)
        {
            var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.Id == id);
            if (eventEntity == null)
            {
                return NotFound("Event not found");
            }

            var totalSeats = await _context.Seats
                .Where(s => s.Section.VenueId == eventEntity.VenueId)
                .CountAsync();

            var reservations = await _context.Reservations
                .Where(r => r.EventId == id)
                .ToListAsync();

            var confirmedCount = reservations.Count(r => r.Status == ReservationStatus.Confirmed);
            var pendingCount = reservations.Count(r => r.Status == ReservationStatus.Pending);
            var expiredCount = reservations.Count(r => r.Status == ReservationStatus.Expired);
            var cancelledCount = reservations.Count(r => r.Status == ReservationStatus.Cancelled);
            var checkedInCount = reservations.Count(r => r.CheckedIn);

            var occupiedSeats = confirmedCount + pendingCount;
            var occupancyRate = totalSeats == 0 ? 0 : Math.Round((double)occupiedSeats / totalSeats * 100, 1);

            var revenue = await _context.Reservations
                .Where(r => r.EventId == id && r.Status == ReservationStatus.Confirmed)
                .Include(r => r.Seat)
                    .ThenInclude(s => s.Section)
                .SumAsync(r => r.Seat.Section.BasePrice);

            return Ok(new
            {
                eventId = eventEntity.Id,
                eventName = eventEntity.Name,
                totalSeats,
                occupiedSeats,
                availableSeats = totalSeats - occupiedSeats,
                occupancyRate,
                reservationsByStatus = new
                {
                    confirmed = confirmedCount,
                    pending = pendingCount,
                    expired = expiredCount,
                    cancelled = cancelledCount
                },
                checkedInCount,
                revenue
            });
        }

    }
}