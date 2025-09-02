using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventory.API.Models
{
    [Table("InventoryMovements")]
    public class InventoryMovement
    {
        [Key] public int Id { get; set; }
        [Required] public int ProductId { get; set; }
        public Product? Product { get; set; }
        [Required] public int QuantityChanged { get; set; }
        [Required, MaxLength(20)] public string MovementType { get; set; } = string.Empty; // IN, OUT, ADJUSTMENT
        [MaxLength(255)] public string? Reason { get; set; }
        public DateTime MovementDate { get; set; } = DateTime.UtcNow;
        [Required, MaxLength(450)] public string UserId { get; set; } = string.Empty;
        [MaxLength(100)] public string? ReferenceNumber { get; set; }
    }
}
