using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventory.API.Models
{
    [Table("Products")]
    public class Product
    {
        [Key] public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [MaxLength(50)]
        public string? SKU { get; set; }

        [MaxLength(50)]
        public string? Barcode { get; set; }

        [Range(0, int.MaxValue)]
        public int LowStockThreshold { get; set; } = 0;

        [Required] public int CategoryId { get; set; }
        [Required] public int SupplierId { get; set; }

        public bool IsActive { get; set; } = true;

        public string? ImageUrl { get; set; }
        public string? ImagePublicId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey(nameof(CategoryId))] public virtual Category? Category { get; set; }
        [ForeignKey(nameof(SupplierId))] public virtual Supplier? Supplier { get; set; }
    }
}
