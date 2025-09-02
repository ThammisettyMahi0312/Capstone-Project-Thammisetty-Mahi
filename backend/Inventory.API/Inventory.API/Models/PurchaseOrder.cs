using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventory.API.Models
{
    [Table("PurchaseOrders")]
    public class PurchaseOrder
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, MaxLength(50)] public string OrderNumber { get; set; } = string.Empty;
        [Required] public int SupplierId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? ExpectedDeliveryDate { get; set; }

        [Required, MaxLength(20)] public string Status { get; set; } = "Pending"; // Pending, Approved, Delivered, Cancelled
        [Range(0, double.MaxValue)] public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey(nameof(SupplierId))] public virtual Supplier Supplier { get; set; } = null!;
        public virtual ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    }
}
