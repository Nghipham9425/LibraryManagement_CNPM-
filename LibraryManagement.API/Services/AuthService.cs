using LibraryManagement.API.Data;
using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.API.Utils;
using Microsoft.AspNetCore.Http;

namespace LibraryManagement.API.Services
{
    public class AuthService
    {
        private readonly AuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(AuthRepository authRepository, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _authRepository = authRepository;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task Register(string username, string email, string password)
        {
            if (await _authRepository.GetUserByUsernameAsync(username) != null)
                throw new ApiException(400, "Username already exists");

            if (await _authRepository.GetUserByEmailAsync(email) != null)
                throw new ApiException(400, "Email already exists");

            var user = new User
            {
                UserName = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "Reader",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _authRepository.AddUserAsync(user);
        }

        public async Task Login(string username, string password)
        {
            var user = await _authRepository.GetUserByUsernameAsync(username);
            if (user == null)
                throw new ApiException(401, "User not found");

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new ApiException(401, "Invalid password");

            if (!user.IsActive)
                throw new ApiException(401, "Account is inactive");

            user.LastLoginAt = DateTime.UtcNow;
            await _authRepository.UpdateUserAsync(user);

            var token = GenerateJwtToken(user);

            // Set cookies
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext != null)
            {
                httpContext.Response.Cookies.Append("accessToken", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,  // Set to false for development (localhost)
                    SameSite = SameSiteMode.Lax,  // Changed to Lax for localhost
                    Domain = "localhost",  // Share cookie across localhost ports
                    Expires = DateTime.UtcNow.AddMinutes(60)
                });
            }
        }

        public async Task<string> GenerateRefreshToken(int userId)
        {
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                Token = Guid.NewGuid().ToString(),
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow
            };

            await _authRepository.AddRefreshTokenAsync(refreshToken);

            return refreshToken.Token;
        }

        public async Task RevokeRefreshToken(string token)
        {
            var refreshToken = await _authRepository.GetRefreshTokenAsync(token);
            if (refreshToken != null)
            {
                refreshToken.IsRevoked = true;
                await _authRepository.UpdateRefreshTokenAsync(refreshToken);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:ExpiryInMinutes"] ?? "60")),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _authRepository.GetUserByUsernameAsync(username);
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _authRepository.GetUserByIdAsync(id);
        }

        public async Task Logout()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            // Clear cookies
            if (httpContext != null)
            {
                httpContext.Response.Cookies.Delete("accessToken");

            }
        }
    }
}