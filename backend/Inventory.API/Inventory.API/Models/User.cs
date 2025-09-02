using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Inventory.API.Models
{
    [Table("Users")]
    public class User
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(50)] public string Username { get; set; } = string.Empty;
        [Required, JsonIgnore] public string PasswordHash { get; set; } = string.Empty;
        [Required, MaxLength(20)] public string Role { get; set; } = string.Empty; // Admin, Manager, Staff
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
