using Inventory.API.Models;

namespace Inventory.API.Services
{
    public interface IReportsService
    {
        Task<SalesReport> GenerateSalesReportAsync(DateTime startDate, DateTime endDate);
        Task<StockMovementReport> GenerateStockMovementReportAsync(int productId, DateTime startDate, DateTime endDate);
        Task<InventoryReport> GenerateInventoryReportAsync();
    }
}
