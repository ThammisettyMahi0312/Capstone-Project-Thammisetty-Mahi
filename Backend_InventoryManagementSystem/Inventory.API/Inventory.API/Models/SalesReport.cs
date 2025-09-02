namespace Inventory.API.Models
{
    public class SalesReport
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalItemsSold { get; set; }
        public List<SalesByCategory> SalesByCategory { get; set; } = new();
        public List<TopSellingProduct> TopSellingProducts { get; set; } = new();
    }

    public class SalesByCategory
    {
        public string CategoryName { get; set; } = string.Empty;
        public int ItemsSold { get; set; }
        public decimal Revenue { get; set; }
    }

    public class TopSellingProduct
    {
        public string ProductName { get; set; } = string.Empty;
        public int QuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
