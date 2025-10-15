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
builder.Services.AddScoped<BookRepository>();
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<AuthorRepository>();
builder.Services.AddScoped<AuthorService>();

builder.Services.AddValidatorsFromAssemblyContaining<BookValidator>();

// Add controllers
builder.Services.AddControllers();

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

// Map controllers
app.MapControllers();

app.Run();