var builder = WebApplication.CreateBuilder(args);

// Configuration via environment variables (with defaults for standalone runs).
var backendPort = Environment.GetEnvironmentVariable("BACKEND_PORT") ?? "5122";
var frontendPort = Environment.GetEnvironmentVariable("FRONTEND_PORT") ?? "5173";
var message = Environment.GetEnvironmentVariable("MESSAGE") ?? "Hello world";

builder.WebHost.UseUrls($"http://localhost:{backendPort}");

// Allow the React dev server (Vite) to call this API during development.
const string CorsPolicy = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins($"http://localhost:{frontendPort}")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors(CorsPolicy);

app.MapGet("/api/hello", () => new { message });

app.Run();
