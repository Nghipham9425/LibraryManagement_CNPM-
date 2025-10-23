using LibraryManagement.API.Data;
using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;
using BCrypt.Net;
using LibraryManagement.API.Utils;
using Microsoft.AspNetCore.Http;

namespace LibraryManagement.API.Services
{
    public class AuthService
    {
        private readonly AuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JwtTokenService _jwtTokenService;

        public AuthService(AuthRepository authRepository, IConfiguration config, IHttpContextAccessor httpContextAccessor, JwtTokenService jwtTokenService)
        {
            _authRepository = authRepository;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _jwtTokenService = jwtTokenService;
        }

        public async Task Register(string username, string email, string password, string role = "Reader")
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
                Role = role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _authRepository.AddUserAsync(user);
        }

        public async Task<string> Login(string username, string password)
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

            var token = _jwtTokenService.GenerateJwtToken(user);

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

            return token;
        }

        public async Task<string> GenerateRefreshToken(int userId)
        {
            return await _jwtTokenService.GenerateRefreshToken(userId);
        }

        public async Task RevokeRefreshToken(string token)
        {
            await _jwtTokenService.RevokeRefreshToken(token);
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

        public async Task<string> RefreshToken(string refreshToken)
        {
            return await _jwtTokenService.RefreshToken(refreshToken);
        }
    }
}