using Inventory.API.Models;
using Inventory.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;
        private readonly ILogger<ReportsController> _logger;

        public ReportsController(IReportsService reportsService, ILogger<ReportsController> logger)
        {
            _reportsService = reportsService;
            _logger = logger;
        }

        [HttpGet("inventory-summary")]
        public async Task<ActionResult<object>> GetInventorySummary()
        {
            try
            {
                var report = await _reportsService.GenerateInventoryReportAsync();
                return Ok(new
                {
                    report.TotalProducts,
                    report.LowStockItems,
                    report.OutOfStockItems,
                    report.TotalInventoryValue,
                    TopProducts = report.TopProductSummaries,
                    RecentlyAddedProducts = report.RecentProductSummaries
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating inventory summary");
                return StatusCode(500, new { message = "An error occurred while generating the inventory report", error = ex.Message });
            }
        }

        [HttpGet("sales")]
        public async Task<ActionResult<SalesReport>> GetSalesReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate) return BadRequest("Start date cannot be after end date");
                var report = await _reportsService.GenerateSalesReportAsync(startDate, endDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating sales report");
                return StatusCode(500, new { message = "An error occurred while generating the sales report", error = ex.Message });
            }
        }

        [HttpGet("stock-movement/{productId}")]
        public async Task<ActionResult<StockMovementReport>> GetStockMovementReport(int productId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate) return BadRequest("Start date cannot be after end date");
                var report = await _reportsService.GenerateStockMovementReportAsync(productId, startDate, endDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating stock movement report for product {ProductId}", productId);
                return StatusCode(500, new { message = "An error occurred while generating the stock movement report", error = ex.Message });
            }
        }
    }
}
