using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketingPlataform.Data;
using TicketingPlataform.DTOs;
using TicketingPlataform.Entities;

namespace TicketingPlataform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VenuesController : ControllerBase
    {
        private readonly TicketingDbContext _context;

        public VenuesController(TicketingDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetVenues()
        {
            var venues = await _context.Venues
                .Include(v => v.Sections)
                .ToListAsync();

            return Ok(venues);
        }

        [HttpPost]
        [Authorize(Roles = "Organizer")]

        public async Task<IActionResult> CreateVenue(CreateVenueDto dto)
        {
            var venue = new Venue
            {
                Name = dto.Name,
                Address = dto.Address
            };
            _context.Venues.Add(venue);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVenues), new { id = venue.Id }, venue);
        }
    }
}
