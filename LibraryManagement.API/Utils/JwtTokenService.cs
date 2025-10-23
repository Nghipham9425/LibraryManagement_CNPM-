using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibraryManagement.API.Utils
{
    public class JwtTokenService
    {
        private readonly IConfiguration _config;
        private readonly AuthRepository _authRepository;

        public JwtTokenService(IConfiguration config, AuthRepository authRepository)
        {
            _config = config;
            _authRepository = authRepository;
        }

        public string GenerateJwtToken(User user)
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

        public async Task<string> RefreshToken(string refreshToken)
        {
            var token = await _authRepository.GetRefreshTokenAsync(refreshToken);
            if (token == null || token.IsRevoked || token.Expires < DateTime.UtcNow)
                throw new ApiException(401, "Invalid or expired refresh token");

            var user = await _authRepository.GetUserByIdAsync(token.UserId);
            if (user == null || !user.IsActive)
                throw new ApiException(401, "User not found or inactive");

            var newToken = GenerateJwtToken(user);
            var newRefreshToken = await GenerateRefreshToken(user.Id);

            // Revoke old refresh token
            token.IsRevoked = true;
            await _authRepository.UpdateRefreshTokenAsync(token);

            return newToken;
        }
    }
}