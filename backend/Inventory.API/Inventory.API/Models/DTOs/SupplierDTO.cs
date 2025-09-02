using System.ComponentModel.DataAnnotations;

namespace Inventory.API.Models.DTOs
{
    public class SupplierCreateDTO
    {
        [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
        [MaxLength(100)] public string? ContactPerson { get; set; }
        [EmailAddress, MaxLength(100)] public string? Email { get; set; }
        [Phone, MaxLength(20)] public string? Phone { get; set; }
        [MaxLength(500)] public string? Address { get; set; }
    }

    public class SupplierUpdateDTO : SupplierCreateDTO
    {
        [Required] public int Id { get; set; }
    }

    public class SupplierResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int ProductCount { get; set; }
    }
}
