using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Inventory.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace Inventory.API.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider sp)
        {
            using var context = new ApplicationDbContext(
                sp.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            // Ensure database exists
            context.Database.EnsureCreated();

            // Seed Categories
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category { Name = "Electronics", Description = "Electronic devices and components" },
                    new Category { Name = "Clothing", Description = "Apparel and clothing items" },
                    new Category { Name = "Furniture", Description = "Office and home furniture" },
                    new Category { Name = "Stationery", Description = "Office supplies and stationery" },
                    new Category { Name = "Food & Beverages", Description = "Food and beverage products" }
                );
                await context.SaveChangesAsync();
            }

            // Seed Suppliers
            if (!context.Suppliers.Any())
            {
                context.Suppliers.AddRange(
                    new Supplier { Name = "Tech Supplies Inc.", Email = "contact@techsupplies.com", Phone = "555-0101", Address = "123 Tech Street, Tech City" },
                    new Supplier { Name = "Fashion World Ltd.", Email = "info@fashionworld.com", Phone = "555-0102", Address = "456 Fashion Ave, Style City" },
                    new Supplier { Name = "Office Solutions Co.", Email = "sales@officesolutions.com", Phone = "555-0103", Address = "789 Office Road, Business City" },
                    new Supplier { Name = "Food Distributors LLC", Email = "orders@fooddist.com", Phone = "555-0104", Address = "101 Food Lane, Nutrition City" },
                    new Supplier { Name = "Furniture Masters", Email = "support@furnituremasters.com", Phone = "555-0105", Address = "202 Design Blvd, Comfort City" }
                );
                await context.SaveChangesAsync();
            }

            // Seed Products
            if (!context.Products.Any())
            {
                var categories = await context.Categories.OrderBy(c => c.Id).ToListAsync();
                var suppliers = await context.Suppliers.OrderBy(s => s.Id).ToListAsync();

                if (categories.Count >= 5 && suppliers.Count >= 5)
                {
                    context.Products.AddRange(
                        new Product
                        {
                            Name = "Wireless Mouse",
                            Description = "Wireless optical mouse",
                            Price = 25.99m,
                            Quantity = 100,
                            CategoryId = categories[0].Id, // Electronics
                            SupplierId = suppliers[0].Id,  // Tech Supplies Inc.
                            SKU = "ELEC-001",
                            LowStockThreshold = 10,
                            IsActive = true
                        },
                        new Product
                        {
                            Name = "Office Chair",
                            Description = "Ergonomic office chair",
                            Price = 199.99m,
                            Quantity = 25,
                            CategoryId = categories[2].Id, // Furniture
                            SupplierId = suppliers[4].Id,  // Furniture Masters
                            SKU = "FURN-001",
                            LowStockThreshold = 5,
                            IsActive = true
                        },
                        new Product
                        {
                            Name = "Notebook Set",
                            Description = "Set of 5 notebooks",
                            Price = 15.50m,
                            Quantity = 200,
                            CategoryId = categories[3].Id, // Stationery
                            SupplierId = suppliers[2].Id,  // Office Solutions Co.
                            SKU = "STAT-001",
                            LowStockThreshold = 20,
                            IsActive = true
                        },
                        new Product
                        {
                            Name = "Coffee Machine",
                            Description = "Automatic coffee maker",
                            Price = 89.99m,
                            Quantity = 30,
                            CategoryId = categories[0].Id, // Electronics
                            SupplierId = suppliers[0].Id,  // Tech Supplies Inc.
                            SKU = "ELEC-002",
                            LowStockThreshold = 5,
                            IsActive = true
                        },
                        new Product
                        {
                            Name = "T-Shirt (Pack of 3)",
                            Description = "Cotton t-shirts pack",
                            Price = 29.99m,
                            Quantity = 150,
                            CategoryId = categories[1].Id, // Clothing
                            SupplierId = suppliers[1].Id,  // Fashion World Ltd.
                            SKU = "CLTH-001",
                            LowStockThreshold = 15,
                            IsActive = true
                        }
                    );
                    await context.SaveChangesAsync();
                }
            }

            // Seed Users
            if (!context.Users.Any())
            {
                var seedUsers = new[]
                {
                    new User { Username = "admin",   Role = "Admin",   CreatedAt = DateTime.UtcNow, PasswordHash = Hash("admin123") },
                    new User { Username = "manager", Role = "Manager", CreatedAt = DateTime.UtcNow, PasswordHash = Hash("manager123") },
                    new User { Username = "staff",   Role = "Staff",   CreatedAt = DateTime.UtcNow, PasswordHash = Hash("staff123") }
                };
                context.Users.AddRange(seedUsers);
                await context.SaveChangesAsync();
            }

            // Seed Inventory Movements
            if (!context.InventoryMovements.Any())
            {
                var products = await context.Products.OrderBy(p => p.Id).ToListAsync();
                var users = await context.Users.OrderBy(u => u.Id).ToListAsync();

                if (products.Count >= 2 && users.Count >= 3)
                {
                    context.InventoryMovements.AddRange(
                        new InventoryMovement
                        {
                            ProductId = products[0].Id,
                            QuantityChanged = 50,
                            MovementType = "IN",
                            Reason = "Initial Stock",
                            MovementDate = DateTime.UtcNow.AddDays(-30),
                            UserId = users[0].Id.ToString()
                        },
                        new InventoryMovement
                        {
                            ProductId = products[1].Id,
                            QuantityChanged = 25,
                            MovementType = "IN",
                            Reason = "Initial Stock",
                            MovementDate = DateTime.UtcNow.AddDays(-30),
                            UserId = users[1].Id.ToString()
                        },
                        new InventoryMovement
                        {
                            ProductId = products[2].Id,
                            QuantityChanged = -5,
                            MovementType = "OUT",
                            Reason = "Sale",
                            MovementDate = DateTime.UtcNow.AddDays(-15),
                            UserId = users[2].Id.ToString()
                        }
                    );
                    await context.SaveChangesAsync();
                }
            }
        }

        private static string Hash(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password + "YourFixedSaltHere"));
            return Convert.ToBase64String(bytes);
        }
    }
}