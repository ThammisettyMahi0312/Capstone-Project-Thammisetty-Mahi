namespace Inventory.API.Models
{
    public class StockMovementReport
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int StartingQuantity { get; set; }
        public int EndingQuantity { get; set; }
        public int TotalIncoming { get; set; }
        public int TotalOutgoing { get; set; }
        public List<StockMovement> Movements { get; set; } = new();
    }

    public class StockMovement
    {
        public DateTime Date { get; set; }
        public string Type { get; set; } = string.Empty; // IN or OUT
        public int Quantity { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
