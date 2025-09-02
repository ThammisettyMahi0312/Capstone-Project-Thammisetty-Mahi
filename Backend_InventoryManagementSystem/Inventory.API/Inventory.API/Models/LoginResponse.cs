namespace Inventory.API.Models
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserResponse User { get; set; } = new UserResponse();
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
