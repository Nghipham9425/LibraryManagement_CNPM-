using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.API.Data;
using LibraryManagement.API.Repositories;
using LibraryManagement.API.Services;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Services.Interfaces;
using LibraryManagement.API.Configurations;
using FluentValidation.AspNetCore;
using FluentValidation;
using LibraryManagement.API.Validators;
using MySqlConnector;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Change the backend port to 5000 as per the user's updated request
builder.WebHost.UseUrls("http://localhost:5000");

// Get connection string from env
var conn = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ??
           builder.Configuration.GetConnectionString("DefaultConnection");

// Ensure connection string is not null or empty
if (string.IsNullOrEmpty(conn))
{
    throw new InvalidOperationException("Connection string is not configured.");
}

// Optional: ensure database exists (for MySQL) if connection string has Database
try
{
    var csb = new MySqlConnectionStringBuilder(conn);
    var databaseName = csb.Database;
    if (!string.IsNullOrWhiteSpace(databaseName))
    {
        var adminCsb = new MySqlConnectionStringBuilder(conn) { Database = string.Empty };
        using var adminConn = new MySqlConnection(adminCsb.ConnectionString);
        adminConn.Open();
        using var cmd = adminConn.CreateCommand();
        cmd.CommandText = $"CREATE DATABASE IF NOT EXISTS `{databaseName}`";
        cmd.ExecuteNonQuery();
    }
}
catch
{
    // Ignore create DB errors (might be limited permissions); rely on existing DB
}

// Register DbContext
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseMySql(conn, ServerVersion.AutoDetect(conn)));

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSwaggerGen();

// CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:5173",
                  "http://127.0.0.1:5173",
                  "http://localhost:5176" // keep previous in case it's used elsewhere
              ) // Allow Vite dev server origins
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register repositories and services (inject trực tiếp class, không dùng interface)
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IAuthorRepository, AuthorRepository>();
builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IBorrowingRepository, BorrowingRepository>();
builder.Services.AddScoped<IBorrowingService, BorrowingService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

builder.Services.AddFluentValidationAutoValidation().AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<BookValidator>();

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();
// Use error handling middleware (global exception handler)
app.UseMiddleware<LibraryManagement.API.Middlewares.ErrorHandlingMiddleware>();

// Ensure database is created/migrated on startup (useful for MySQL dev environment)
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<LibraryManagement.API.Data.LibraryDbContext>();
    // For simple dev scenario without migrations, EnsureCreated will create missing tables
    db.Database.EnsureCreated();
}
catch { /* best-effort, don't block app start */ }

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Conditionally enable HTTPS redirection only in non-development environments
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowFrontend");

// Map controllers
app.MapControllers();

app.Run();