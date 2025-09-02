using Microsoft.AspNetCore.Mvc;
using Inventory.API.Services;
using Inventory.API.Models;

namespace Inventory.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(loginRequest.Username) || string.IsNullOrWhiteSpace(loginRequest.Password))
                    return BadRequest(new { message = "Username and password are required" });

                var response = await _authService.Authenticate(loginRequest);
                if (response == null || string.IsNullOrEmpty(response.Token))
                    return Unauthorized(new { message = "Invalid username or password" });

                _logger.LogInformation("User {Username} logged in", loginRequest.Username);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for {Username}", loginRequest.Username);
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest registerRequest)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(registerRequest.Username) || string.IsNullOrWhiteSpace(registerRequest.Password))
                    return BadRequest(new { message = "Username and password are required" });
                if (string.IsNullOrWhiteSpace(registerRequest.Role))
                    return BadRequest(new { message = "Role is required" });

                var user = await _authService.RegisterUser(registerRequest.Username, registerRequest.Password, registerRequest.Role);
                var token = _authService.GenerateJwtToken(user);

                return Ok(new LoginResponse
                {
                    Token = token,
                    User = new UserResponse { Id = user.Id, Username = user.Username, Role = user.Role }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for {Username}", registerRequest.Username);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("validate")]
        public IActionResult Validate() => Ok(new { message = "Token is valid" });

        [HttpGet("test-db")]
        public IActionResult TestDatabase()
        {
            try { return Ok(new { message = "Database connection test endpoint is working" }); }
            catch (Exception ex) { return StatusCode(500, new { message = $"Database connection failed: {ex.Message}" }); }
        }
    }
}
