using Inventory.API.Models;

namespace Inventory.API.Services
{
    public interface IEmailService
    {
        Task SendLowStockAlertAsync(Product product);
        Task SendPurchaseOrderConfirmationAsync(PurchaseOrder purchaseOrder);
    }
}
