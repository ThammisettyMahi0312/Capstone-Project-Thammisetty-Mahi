using Inventory.API.Models;

namespace Inventory.API.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> Authenticate(LoginRequest loginRequest);
        Task<User> RegisterUser(string username, string password, string role);
        string GenerateJwtToken(User user);
    }
}
