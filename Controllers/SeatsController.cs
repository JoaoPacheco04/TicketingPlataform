using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketingPlataform.Data;
using TicketingPlataform.DTOs;
using TicketingPlataform.Entities;

namespace TicketingPlataform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatsController : ControllerBase
    {
        private readonly TicketingDbContext _context;

        public SeatsController(TicketingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSeats()
        {
            var seats = await _context.Seats
                .Include(s => s.Section)
                .ToListAsync();
            return Ok(seats);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSeats(CreateSeatDto dto)
        {
            var sectionExists = await _context.Sections.AnyAsync(s => s.Id == dto.SectionId);
            if (!sectionExists)
            {
                return NotFound("Section not found");
            }

            var newSeat = new Seat
            {
                Id = Guid.NewGuid(),
                Row = dto.Row,
                Number = dto.Number,
                SectionId = dto.SectionId
            };

            _context.Seats.Add(newSeat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSeats), new { id = newSeat.Id }, newSeat);
        }
    }
}

   
