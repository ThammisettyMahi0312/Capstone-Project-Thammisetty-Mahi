using Inventory.API.Data;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Services
{
    public class ReportsService : IReportsService
    {
        private readonly ApplicationDbContext _context;
        public ReportsService(ApplicationDbContext context) => _context = context;

        public async Task<InventoryReport> GenerateInventoryReportAsync()
        {
            var products = await _context.Products
                .Where(p => p.IsActive)
                .Include(p => p.Supplier)
                .Include(p => p.Category)
                .ToListAsync();

            return new InventoryReport
            {
                TotalProducts = products.Count,
                LowStockItems = products.Count(p => p.Quantity > 0 && p.Quantity <= p.LowStockThreshold),
                OutOfStockItems = products.Count(p => p.Quantity == 0),
                TotalInventoryValue = products.Sum(p => p.Price * p.Quantity),
                TopProducts = products.OrderByDescending(p => p.Quantity).Take(10).ToList(),
                RecentlyAddedProducts = products.OrderByDescending(p => p.CreatedAt).Take(5).ToList()
            };
        }

        public async Task<SalesReport> GenerateSalesReportAsync(DateTime startDate, DateTime endDate)
        {
            // Mock data until sales tables exist
            var report = new SalesReport
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalOrders = 0,
                TotalRevenue = 0,
                TotalItemsSold = 0
            };

            if (await _context.Products.AnyAsync())
            {
                var products = await _context.Products.Where(p => p.IsActive).Include(p => p.Category).Take(5).ToListAsync();
                var rand = new Random();

                report.TopSellingProducts = products.Select(p => new TopSellingProduct
                {
                    ProductName = p.Name,
                    QuantitySold = rand.Next(1, 50),
                    TotalRevenue = p.Price * rand.Next(1, 50)
                }).ToList();

                report.SalesByCategory = products
                    .GroupBy(p => p.Category?.Name ?? "Uncategorized")
                    .Select(g => new SalesByCategory
                    {
                        CategoryName = g.Key,
                        ItemsSold = g.Sum(_ => rand.Next(1, 20)),
                        Revenue = g.Sum(p => p.Price * rand.Next(1, 20))
                    }).ToList();

                report.TotalOrders = rand.Next(10, 100);
                report.TotalRevenue = report.SalesByCategory.Sum(c => c.Revenue);
                report.TotalItemsSold = report.SalesByCategory.Sum(c => c.ItemsSold);
            }

            return report;
        }

        public async Task<StockMovementReport> GenerateStockMovementReportAsync(int productId, DateTime startDate, DateTime endDate)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId && p.IsActive)
                ?? throw new ArgumentException("Product not found");

            var report = new StockMovementReport
            {
                ProductId = productId,
                ProductName = product.Name,
                StartDate = startDate,
                EndDate = endDate,
                StartingQuantity = 100, // placeholder
                EndingQuantity = product.Quantity,
                TotalIncoming = 50,     // placeholder
                TotalOutgoing = 30,     // placeholder
                Movements = new List<StockMovement>
                {
                    new StockMovement { Date = startDate.AddDays(1), Type = "IN", Quantity = 20, Reference = "PO-001", Description = "Purchase order delivery" },
                    new StockMovement { Date = startDate.AddDays(3), Type = "OUT", Quantity = 15, Reference = "SALE-001", Description = "Customer sale" },
                    new StockMovement { Date = startDate.AddDays(5), Type = "IN", Quantity = 30, Reference = "PO-002", Description = "Purchase order delivery" },
                    new StockMovement { Date = startDate.AddDays(7), Type = "OUT", Quantity = 25, Reference = "SALE-002", Description = "Customer sale" }
                }
            };

            return report;
        }
    }
}
