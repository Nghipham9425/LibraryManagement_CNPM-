using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.API.Data;
using LibraryManagement.API.Repositories;
using LibraryManagement.API.Services;
using LibraryManagement.API.Configurations;
using FluentValidation.AspNetCore;
using FluentValidation;
using LibraryManagement.API.Validators;
using LibraryManagement.API.Mappers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Get connection string from env
var conn = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ??
           builder.Configuration.GetConnectionString("DefaultConnection");

// Register DbContext
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseMySql(conn, ServerVersion.AutoDetect(conn)));

// Add services to the container.
// Learn more about configuring configuring Swagger/OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSwaggerGen();

// AutoMapper
builder.Services.AddAutoMapper(config => config.AddMaps(typeof(Program).Assembly));

// CORS for React frontend
builder.Services.AddCorsConfiguration();

// Register repositories and services
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<BookRepository>();
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<AuthorRepository>();
builder.Services.AddScoped<AuthorService>();
builder.Services.AddScoped<GenreRepository>();
builder.Services.AddScoped<GenreService>();
builder.Services.AddScoped<AuthRepository>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<BorrowingRepository>();
builder.Services.AddScoped<BorrowingService>();
builder.Services.AddScoped<NotificationService>();

builder.Services.AddValidatorsFromAssemblyContaining<BookValidator>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddAuthorization();

// Add controllers
builder.Services.AddControllers();

builder.Services.AddHttpContextAccessor();

var app = builder.Build();
// Use error handling middleware (global exception handler)
app.UseMiddleware<LibraryManagement.API.Middlewares.ErrorHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();