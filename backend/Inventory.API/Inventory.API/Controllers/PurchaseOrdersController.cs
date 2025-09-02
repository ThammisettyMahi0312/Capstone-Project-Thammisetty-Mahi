using Inventory.API.Data;
using Inventory.API.Models;
using Inventory.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Inventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager")]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<PurchaseOrdersController> _logger;

        public PurchaseOrdersController(ApplicationDbContext context, IEmailService emailService, ILogger<PurchaseOrdersController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseOrder>>> GetPurchaseOrders()
        {
            try
            {
                var orders = await _context.PurchaseOrders
                    .Include(po => po.Supplier)
                    .Include(po => po.Items).ThenInclude(i => i.Product)
                    .OrderByDescending(po => po.OrderDate)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving purchase orders");
                return StatusCode(500, new { message = "An error occurred while retrieving purchase orders", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseOrder>> GetPurchaseOrder(int id)
        {
            try
            {
                var order = await _context.PurchaseOrders
                    .Include(po => po.Supplier)
                    .Include(po => po.Items).ThenInclude(i => i.Product)
                    .FirstOrDefaultAsync(po => po.Id == id);

                if (order == null) return NotFound();
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving purchase order {OrderId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the purchase order", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<PurchaseOrder>> CreatePurchaseOrder([FromBody] PurchaseOrder purchaseOrder)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                purchaseOrder.OrderNumber = GenerateOrderNumber();
                purchaseOrder.CreatedAt = DateTime.UtcNow;
                purchaseOrder.Status = "Pending";
                purchaseOrder.TotalAmount = purchaseOrder.Items.Sum(item => item.TotalPrice);

                _context.PurchaseOrders.Add(purchaseOrder);
                await _context.SaveChangesAsync();

                await _emailService.SendPurchaseOrderConfirmationAsync(purchaseOrder);

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "Unknown";
                _logger.LogInformation("Purchase order {OrderNumber} created by {UserId}", purchaseOrder.OrderNumber, userId);

                return CreatedAtAction(nameof(GetPurchaseOrder), new { id = purchaseOrder.Id }, purchaseOrder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating purchase order");
                return StatusCode(500, new { message = "An error occurred while creating the purchase order", error = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdatePurchaseOrderStatus(int id, [FromBody] string status)
        {
            try
            {
                var validStatuses = new[] { "Pending", "Approved", "Delivered", "Cancelled" };
                if (!validStatuses.Contains(status))
                    return BadRequest("Invalid status. Valid values are: Pending, Approved, Delivered, Cancelled");

                var order = await _context.PurchaseOrders.FindAsync(id);
                if (order == null) return NotFound();

                order.Status = status;
                order.UpdatedAt = DateTime.UtcNow;

                if (status == "Delivered")
                    await UpdateStockLevels(order.Id);

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating purchase order {OrderId} status", id);
                return StatusCode(500, new { message = "An error occurred while updating the purchase order status", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePurchaseOrder(int id)
        {
            try
            {
                var order = await _context.PurchaseOrders.Include(po => po.Items).FirstOrDefaultAsync(po => po.Id == id);
                if (order == null) return NotFound();
                if (order.Status == "Delivered") return BadRequest("Cannot delete a delivered purchase order");

                _context.PurchaseOrders.Remove(order);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting purchase order {OrderId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the purchase order", error = ex.Message });
            }
        }

        private string GenerateOrderNumber() =>
            $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()}";

        private async Task UpdateStockLevels(int purchaseOrderId)
        {
            var order = await _context.PurchaseOrders.Include(po => po.Items).FirstOrDefaultAsync(po => po.Id == purchaseOrderId);
            if (order == null) return;

            foreach (var item in order.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.Quantity += item.Quantity;
                    product.UpdatedAt = DateTime.UtcNow;
                }
            }
            await _context.SaveChangesAsync();
        }
    }
}
