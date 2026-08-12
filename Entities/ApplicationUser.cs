using Microsoft.AspNetCore.Identity;
namespace TicketingPlataform.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer";
    }
}
