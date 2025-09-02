using Inventory.API.Data;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Services
{
    public class BarcodeService : IBarcodeService
    {
        private readonly ApplicationDbContext _context;
        public BarcodeService(ApplicationDbContext context) => _context = context;

        public string GenerateBarcode(string productId) => $"INV{productId.PadLeft(8, '0')}{DateTime.UtcNow:yyMMdd}";

        public async Task<Product?> GetProductByBarcodeAsync(string barcode)
        {
            return await _context.Products
                .Include(p => p.Supplier)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Barcode == barcode && p.IsActive);
        }

        public async Task<string> GenerateAndAssignBarcodeAsync(int productId)
        {
            var product = await _context.Products.FindAsync(productId) ?? throw new ArgumentException("Product not found");
            if (string.IsNullOrEmpty(product.Barcode))
            {
                product.Barcode = GenerateBarcode(productId.ToString());
                product.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            return product.Barcode!;
        }
    }
}
