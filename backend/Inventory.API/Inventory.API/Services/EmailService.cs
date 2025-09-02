using Inventory.API.Models;

namespace Inventory.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        public EmailService(ILogger<EmailService> logger) => _logger = logger;

        public async Task SendLowStockAlertAsync(Product product)
        {
            try
            {
                _logger.LogWarning("LOW STOCK ALERT: '{Name}' Qty {Qty} Threshold {Thresh}", product.Name, product.Quantity, product.LowStockThreshold);
                await Task.Delay(50);
                _logger.LogInformation("Low stock alert sent for product {Id}", product.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send low stock alert for product {Id}", product.Id);
            }
        }

        public async Task SendPurchaseOrderConfirmationAsync(PurchaseOrder purchaseOrder)
        {
            try
            {
                _logger.LogInformation("PURCHASE ORDER: #{OrderNumber} for supplier {SupplierName}", purchaseOrder.OrderNumber, purchaseOrder.Supplier.Name);
                await Task.Delay(50);
                _logger.LogInformation("Purchase order confirmation sent for {OrderNumber}", purchaseOrder.OrderNumber);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send purchase order confirmation for {OrderNumber}", purchaseOrder.OrderNumber);
            }
        }
    }
}
