﻿using Microsoft.AspNetCore.Http;

namespace Inventory.API.Services
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task<bool> DeleteImageAsync(string publicId);
    }
}
