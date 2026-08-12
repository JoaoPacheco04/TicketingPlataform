namespace TicketingPlataform.Entities
{
    public class Venue
    {
        public Guid Id { get; set; }
        public String Name { get; set; } = string.Empty;
        public String Address { get; set; } = string.Empty;

        public ICollection<Section> Sections { get; set; } = new List<Section>();
    }
}
