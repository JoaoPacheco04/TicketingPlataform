using Microsoft.EntityFrameworkCore;
using TicketingPlataform.Data;
using TicketingPlataform.Entities;

namespace TicketingPlataform.Services
{
    public class ReservationExpirationService
    {
        private readonly TicketingDbContext _context;

        public ReservationExpirationService(TicketingDbContext context)
        {
            _context = context;
        }

        public async Task ExpireOverdueReservationsAsync()
        {
            var overdueReservations = await _context.Reservations
                .Where(r => r.Status == ReservationStatus.Pending && r.ExpiresAt < DateTime.UtcNow)
                .ToListAsync();

            if (overdueReservations.Count == 0)
            {
                return;
            }

            foreach (var reservation in overdueReservations)
            {
                reservation.Status = ReservationStatus.Expired;
            }

            await _context.SaveChangesAsync();
        }
    }
}