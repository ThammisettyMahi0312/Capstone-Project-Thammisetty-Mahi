using Inventory.API.Data;
using Inventory.API.Models;
using Inventory.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager")]
    public class SuppliersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SuppliersController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierResponseDTO>>> GetSuppliers()
        {
            var suppliers = await _context.Suppliers
                .Include(s => s.Products)
                .Select(s => new SupplierResponseDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    ContactPerson = s.ContactPerson,
                    Email = s.Email,
                    Phone = s.Phone,
                    Address = s.Address,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    ProductCount = s.Products.Count
                })
                .ToListAsync();

            return Ok(suppliers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierResponseDTO>> GetSupplier(int id)
        {
            var supplier = await _context.Suppliers.Include(s => s.Products).FirstOrDefaultAsync(s => s.Id == id);
            if (supplier == null) return NotFound();

            var dto = new SupplierResponseDTO
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                CreatedAt = supplier.CreatedAt,
                UpdatedAt = supplier.UpdatedAt,
                ProductCount = supplier.Products.Count
            };
            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<SupplierResponseDTO>> CreateSupplier([FromBody] SupplierCreateDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var supplier = new Supplier
            {
                Name = dto.Name,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                CreatedAt = DateTime.UtcNow
            };
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            var res = new SupplierResponseDTO
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                CreatedAt = supplier.CreatedAt,
                ProductCount = 0
            };
            return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, res);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupplier(int id, [FromBody] SupplierUpdateDTO dto)
        {
            if (id != dto.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound();

            supplier.Name = dto.Name;
            supplier.ContactPerson = dto.ContactPerson;
            supplier.Email = dto.Email;
            supplier.Phone = dto.Phone;
            supplier.Address = dto.Address;
            supplier.UpdatedAt = DateTime.UtcNow;

            _context.Entry(supplier).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Suppliers.Any(e => e.Id == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _context.Suppliers.Include(s => s.Products).FirstOrDefaultAsync(s => s.Id == id);
            if (supplier == null) return NotFound();

            if (supplier.Products.Any())
                return BadRequest("Cannot delete supplier with associated products. Please reassign or delete the products first.");

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
