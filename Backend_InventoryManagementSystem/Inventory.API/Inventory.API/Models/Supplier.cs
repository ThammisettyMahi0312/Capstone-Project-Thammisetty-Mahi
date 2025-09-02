using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Inventory.API.Models
{
    [Table("Suppliers")]
    public class Supplier
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
        [MaxLength(100)] public string? ContactPerson { get; set; }
        [EmailAddress, MaxLength(100)] public string? Email { get; set; }
        [Phone, MaxLength(20)] public string? Phone { get; set; }
        [MaxLength(500)] public string? Address { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        [JsonIgnore] public virtual ICollection<Product> Products { get; set; } = new HashSet<Product>();
    }
}
