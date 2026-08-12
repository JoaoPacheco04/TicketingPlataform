using System.ComponentModel.DataAnnotations;

namespace TicketingPlataform.Entities
{
    public class Seat
    {
        public Guid Id { get; set; }
        public String Row { get; set; } = string.Empty;
        public String Number { get; set; } = string.Empty;

        public Guid SectionId { get; set; }
        public Section Section { get; set; } = null!;

        [Timestamp]
        public byte[] RowVersion { get; set; } = null!;
    }
}

