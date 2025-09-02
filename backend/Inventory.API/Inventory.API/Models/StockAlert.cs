using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventory.API.Models
{
    [Table("StockAlerts")]
    public class StockAlert
    {
        [Key] public int Id { get; set; }
        [Required] public int ProductId { get; set; }
        public Product? Product { get; set; }

        [Required] public int PreviousQuantity { get; set; }
        [Required] public int NewQuantity { get; set; }

        [Required, MaxLength(20)] public string AlertType { get; set; } = string.Empty; // LOW_STOCK, OUT_OF_STOCK
        public DateTime AlertDate { get; set; } = DateTime.UtcNow;
        public bool IsResolved { get; set; } = false;
        public DateTime? ResolvedDate { get; set; }
        [MaxLength(450)] public string? ResolvedBy { get; set; }
    }
}
