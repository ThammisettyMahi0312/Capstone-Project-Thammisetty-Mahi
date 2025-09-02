using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventory.API.Models
{
    [Table("PurchaseOrderItems")]
    public class PurchaseOrderItem
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required] public int PurchaseOrderId { get; set; }
        [Required] public int ProductId { get; set; }
        [Required, Range(1, int.MaxValue)] public int Quantity { get; set; }
        [Required, Range(0, double.MaxValue)] public decimal UnitPrice { get; set; }

        [NotMapped] public decimal TotalPrice => Quantity * UnitPrice;

        [ForeignKey(nameof(PurchaseOrderId))] public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;
        [ForeignKey(nameof(ProductId))] public virtual Product Product { get; set; } = null!;
    }
}
