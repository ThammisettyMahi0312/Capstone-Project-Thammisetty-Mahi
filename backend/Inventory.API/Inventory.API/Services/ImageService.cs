using Microsoft.AspNetCore.Http;

namespace Inventory.API.Services
{
    public class CloudinaryImageService : IImageService
    {
        public Task<bool> DeleteImageAsync(string publicId) => Task.FromResult(true);

        public Task<string> UploadImageAsync(IFormFile file)
        {
            // Replace with Cloudinary SDK integration
            var url = $"https://res.cloudinary.com/demo/image/upload/v{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}/placeholder.jpg";
            return Task.FromResult(url);
        }
    }
}
