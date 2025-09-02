// Controllers/UsersController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Inventory.API.Data;
using Inventory.API.Models;

namespace Inventory.API.Controllers
{
    [ApiController]
    [Route("api/identity/users")] // exact path the frontend will call
    [Authorize(Roles = "Admin")]   // adjust policy/roles as required
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ApplicationDbContext db, ILogger<UsersController> logger)
        {
            _db = db;
            _logger = logger;
        }

        // GET /api/identity/users
        // GET /api/identity/users
        [HttpGet]
        public ActionResult<IEnumerable<object>> GetAll()
        {
            var users = _db.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    // Remove Email if it doesn't exist on your entity
                    // Email = u.Email,
                    u.Role,
                    Active = true
                })
                .ToList();

            return Ok(users);
        }


        // DELETE /api/identity/users/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
