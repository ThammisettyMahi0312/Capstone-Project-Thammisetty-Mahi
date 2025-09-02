using Inventory.API.Models;

namespace Inventory.API.Services
{
    public interface IBarcodeService
    {
        string GenerateBarcode(string productId);
        Task<Product?> GetProductByBarcodeAsync(string barcode);
        Task<string> GenerateAndAssignBarcodeAsync(int productId);
    }
}
