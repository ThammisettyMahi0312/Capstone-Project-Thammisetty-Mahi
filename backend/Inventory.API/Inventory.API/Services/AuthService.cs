using Inventory.API.Data;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Inventory.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<LoginResponse> Authenticate(LoginRequest loginRequest)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginRequest.Username);
            if (user == null || !VerifyPassword(loginRequest.Password, user.PasswordHash))
                return new LoginResponse();

            var token = GenerateJwtToken(user);
            return new LoginResponse
            {
                Token = token,
                User = new UserResponse { Id = user.Id, Username = user.Username, Role = user.Role }
            };
        }

        public async Task<User> RegisterUser(string username, string password, string role)
        {
            if (await _context.Users.AnyAsync(u => u.Username == username))
                throw new Exception("Username already exists");

            if (!new[] { "Admin", "Manager", "Staff" }.Contains(role))
                throw new Exception("Invalid role. Must be Admin, Manager, or Staff");

            var user = new User
            {
                Username = username,
                PasswordHash = HashPassword(password),
                Role = role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new Exception("JWT Secret Key is not configured");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(Convert.ToDouble(jwtSettings["ExpiryHours"] ?? "2")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "YourFixedSaltHere"));
            return Convert.ToBase64String(hashedBytes);
        }

        private static bool VerifyPassword(string password, string storedHash)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(storedHash)) return false;
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "YourFixedSaltHere"));
            var inputHash = Convert.ToBase64String(hashedBytes);
            return inputHash == storedHash;
        }
    }
}
