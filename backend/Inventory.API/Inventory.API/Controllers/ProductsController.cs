using Inventory.API.Data;
using Inventory.API.Models;
using Inventory.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Inventory.API.Controllers
{
    [Route("api/products")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductsController> _logger;
        private readonly IEmailService _emailService;
        private readonly IImageService _imageService;
        private readonly IBarcodeService _barcodeService;

        public ProductsController(
            ApplicationDbContext context,
            ILogger<ProductsController> logger,
            IEmailService emailService,
            IImageService imageService,
            IBarcodeService barcodeService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
            _imageService = imageService;
            _barcodeService = barcodeService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            try
            {
                var items = await _context.Products
                    .Where(p => p.IsActive)
                    .Include(p => p.Supplier)
                    .Include(p => p.Category)
                    .ToListAsync();

                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products");
                return StatusCode(500, new { message = "An error occurred while retrieving products", error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Supplier)
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

                if (product == null) return NotFound();
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the product", error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<Product>> PostProduct([FromBody] Product product)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                product.CreatedAt = DateTime.UtcNow;
                product.UpdatedAt = DateTime.UtcNow;
                product.IsActive = true;

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                if (product.Quantity <= product.LowStockThreshold)
                    await _emailService.SendLowStockAlertAsync(product);

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "Unknown";
                _logger.LogInformation("Product {ProductId} created by {UserId}", product.Id, userId);

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, new { message = "An error occurred while creating the product", error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> PutProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var original = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
                if (original == null) return NotFound(new { message = "Product not found" });

                product.UpdatedAt = DateTime.UtcNow;
                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                if (original.Quantity > product.LowStockThreshold && product.Quantity <= product.LowStockThreshold)
                    await _emailService.SendLowStockAlertAsync(product);

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "Unknown";
                _logger.LogInformation("Product {ProductId} updated by {UserId}", id, userId);

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id && e.IsActive)) return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the product", error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null) return NotFound();

                product.IsActive = false;
                product.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "Unknown";
                _logger.LogInformation("Product {ProductId} soft-deleted by {UserId}", id, userId);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the product", error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpGet("low-stock")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<Product>>> GetLowStockProducts()
        {
            try
            {
                var items = await _context.Products
                    .Where(p => p.IsActive && p.Quantity > 0 && p.Quantity <= p.LowStockThreshold)
                    .Include(p => p.Supplier)
                    .Include(p => p.Category)
                    .ToListAsync();

                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving low stock products");
                return StatusCode(500, new { message = "An error occurred while retrieving low stock products", error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpGet("out-of-stock")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<Product>>> GetOutOfStockProducts()
        {
            try
            {
                var items = await _context.Products
                    .Where(p => p.IsActive && p.Quantity == 0)
                    .Include(p => p.Supplier)
                    .Include(p => p.Category)
                    .ToListAsync();

                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving out of stock products");
                return StatusCode(500, new { message = "An error occurred while retrieving out of stock products", error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpPost("upload-image/{productId}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UploadImage(int productId, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0) return BadRequest("No file uploaded");

                var product = await _context.Products.FindAsync(productId);
                if (product == null) return NotFound();

                if (!string.IsNullOrEmpty(product.ImagePublicId))
                    await _imageService.DeleteImageAsync(product.ImagePublicId);

                var imageUrl = await _imageService.UploadImageAsync(file);
                product.ImageUrl = imageUrl;
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image for product {ProductId}", productId);
                return StatusCode(500, new { message = "An error occurred while uploading the image", error = ex.Message });
            }
        }

        [HttpPost("{productId}/generate-barcode")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> GenerateBarcode(int productId)
        {
            try
            {
                var barcode = await _barcodeService.GenerateAndAssignBarcodeAsync(productId);
                return Ok(new { barcode });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating barcode for product {ProductId}", productId);
                return StatusCode(500, new { message = "An error occurred while generating the barcode", error = ex.Message });
            }
        }

        [HttpGet("barcode/{barcode}")]
        [AllowAnonymous]
        public async Task<ActionResult<Product>> GetProductByBarcode(string barcode)
        {
            try
            {
                var product = await _barcodeService.GetProductByBarcodeAsync(barcode);
                if (product == null) return NotFound();
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product by barcode {Barcode}", barcode);
                return StatusCode(500, new { message = "An error occurred while retrieving the product", error = ex.Message });
            }
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Product>>> SearchProducts(
            [FromQuery] string? searchTerm,
            [FromQuery] int? categoryId,
            [FromQuery] int? supplierId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int? minQuantity,
            [FromQuery] int? maxQuantity,
            [FromQuery] bool? lowStockOnly = false,
            [FromQuery] bool? outOfStockOnly = false)
        {
            try
            {
                var query = _context.Products
                    .Where(p => p.IsActive)
                    .Include(p => p.Supplier)
                    .Include(p => p.Category)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(p =>
                        p.Name.Contains(searchTerm) ||
                        (p.Description != null && p.Description.Contains(searchTerm)) ||
                        (p.Barcode != null && p.Barcode.Contains(searchTerm)) ||
                        (p.SKU != null && p.SKU.Contains(searchTerm)));
                }
                if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId.Value);
                if (supplierId.HasValue) query = query.Where(p => p.SupplierId == supplierId.Value);
                if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
                if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);
                if (minQuantity.HasValue) query = query.Where(p => p.Quantity >= minQuantity.Value);
                if (maxQuantity.HasValue) query = query.Where(p => p.Quantity <= maxQuantity.Value);
                if (lowStockOnly == true) query = query.Where(p => p.Quantity > 0 && p.Quantity <= p.LowStockThreshold);
                if (outOfStockOnly == true) query = query.Where(p => p.Quantity == 0);

                var products = await query.ToListAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products");
                return StatusCode(500, new { message = "An error occurred while searching products", error = ex.Message });
            }
        }
    }
}
