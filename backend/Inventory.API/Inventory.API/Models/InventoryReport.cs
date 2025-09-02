using System.Text.Json.Serialization;

namespace Inventory.API.Models
{
    public class InventoryReport
    {
        public int TotalProducts { get; set; }
        public int LowStockItems { get; set; }
        public int OutOfStockItems { get; set; }
        public decimal TotalInventoryValue { get; set; }

        [JsonIgnore] public List<Product> TopProducts { get; set; } = new();
        [JsonIgnore] public List<Product> RecentlyAddedProducts { get; set; } = new();

        public List<ProductSummary> TopProductSummaries => TopProducts.Select(p => new ProductSummary(p)).ToList();
        public List<ProductSummary> RecentProductSummaries => RecentlyAddedProducts.Select(p => new ProductSummary(p)).ToList();
    }

    public class ProductSummary
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? CategoryName { get; set; }
        public string? SupplierName { get; set; }

        public ProductSummary(Product product)
        {
            Id = product.Id;
            Name = product.Name;
            Price = product.Price;
            Quantity = product.Quantity;
            CategoryName = product.Category?.Name;
            SupplierName = product.Supplier?.Name;
        }
    }
}
