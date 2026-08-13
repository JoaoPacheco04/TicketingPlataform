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
    public class SectionsController : ControllerBase
    {
        private readonly TicketingDbContext _context;

        public SectionsController(TicketingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSections()
        {
            var sections = await _context.Sections
                .Include(s => s.Venue)
                .Include(s => s.Seats)
                .ToListAsync();
            return Ok(sections);
        }

        [HttpPost]
        [Authorize(Roles = "Organizer")]

        public async Task<IActionResult> CreateSection(CreateSectionDto dto)
        {
            var venueExists = await _context.Venues.AnyAsync(v => v.Id == dto.VenueId);
            if (!venueExists)
            {
                return NotFound("Venue not found");
            }

            var newSection = new Section
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                BasePrice = dto.BasePrice,
                VenueId = dto.VenueId
                , LayoutType = dto.LayoutType
            };

            _context.Sections.Add(newSection);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSections), new { id = newSection.Id }, newSection);
        }
    }
}

