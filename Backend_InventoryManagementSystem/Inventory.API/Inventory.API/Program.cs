//using Inventory.API.Data;
//using Inventory.API.Models;
//using Inventory.API.Services;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.OpenApi.Models;
//using System.Text;

//var builder = WebApplication.CreateBuilder(args);

//// Controllers
//builder.Services.AddControllers();

//// DbContext
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//// JWT
//var jwtSettings = builder.Configuration.GetSection("JwtSettings");
//var secretKey = jwtSettings["SecretKey"] ?? throw new Exception("JWT SecretKey is not configured");
//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        ValidIssuer = jwtSettings["Issuer"],
//        ValidAudience = jwtSettings["Audience"],
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
//        ClockSkew = TimeSpan.Zero
//    };
//});

//// Authorization policies
//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
//    options.AddPolicy("AdminOrManager", policy => policy.RequireRole("Admin", "Manager"));
//    options.AddPolicy("AllStaff", policy => policy.RequireRole("Admin", "Manager", "Staff"));
//});

//// CORS - UPDATED to include Vite dev server ports
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReactApp", policy =>
//        policy
//            .WithOrigins(
//                "http://localhost:5173",
//                "http://localhost:5174",
//                "http://localhost:5175",
//                "http://localhost:3000"
//            )
//            .AllowAnyHeader()
//            .AllowAnyMethod()
//            .WithExposedHeaders("Content-Disposition") // for file downloads, optional
//            .SetPreflightMaxAge(TimeSpan.FromMinutes(10))
//            .AllowCredentials() // keep only if you actually use credentials
//    );
//});


//// DI
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IEmailService, EmailService>();
//builder.Services.AddScoped<IImageService, CloudinaryImageService>();
//builder.Services.AddScoped<IBarcodeService, BarcodeService>();
//builder.Services.AddScoped<IReportsService, ReportsService>();
//builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
//builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
//builder.Services.AddLogging();
//builder.Services.AddHttpClient();

//// Swagger
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen(c =>
//{
//    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Inventory API", Version = "v1" });
//    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//    {
//        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
//        Name = "Authorization",
//        In = ParameterLocation.Header,
//        Type = SecuritySchemeType.ApiKey,
//        Scheme = "Bearer"
//    });
//    c.AddSecurityRequirement(new OpenApiSecurityRequirement
//    {
//        {
//            new OpenApiSecurityScheme {
//                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
//                Scheme = "oauth2", Name = "Bearer", In = ParameterLocation.Header
//            },
//            new List<string>()
//        }
//    });
//});

//var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();
//app.UseCors("AllowReactApp");  // CORS must come before Authentication/Authorization
//app.UseAuthentication();
//app.UseAuthorization();
//app.MapControllers();

//// Ensure database and seed
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    try
//    {
//        var context = services.GetRequiredService<ApplicationDbContext>();
//        context.Database.EnsureCreated();
//        await SeedData.Initialize(services);
//    }
//    catch (Exception ex)
//    {
//        var logger = services.GetRequiredService<ILogger<Program>>();
//        logger.LogError(ex, "An error occurred while creating the database.");
//    }
//}

//app.Run();

using Inventory.API.Data;
using Inventory.API.Models;
using Inventory.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new Exception("JWT SecretKey is not configured");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("AdminOrManager", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("AllStaff", policy => policy.RequireRole("Admin", "Manager", "Staff"));
});

// CORS - UPDATED with proper configuration
const string DevCors = "AllowReactApp";
builder.Services.AddCors(options =>
{
    options.AddPolicy(DevCors, policy =>
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10))
            .AllowCredentials()
    );
});

// DI
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IImageService, CloudinaryImageService>();
builder.Services.AddScoped<IBarcodeService, BarcodeService>();
builder.Services.AddScoped<IReportsService, ReportsService>();
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddLogging();
builder.Services.AddHttpClient();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Inventory API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                Scheme = "oauth2", Name = "Bearer", In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware order (CRITICAL):
app.UseHttpsRedirection();
app.UseCors(DevCors); // ← This must come before Authentication/Authorization
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Ensure database and seed
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();
        await SeedData.Initialize(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while creating the database.");
    }
}

app.Run();