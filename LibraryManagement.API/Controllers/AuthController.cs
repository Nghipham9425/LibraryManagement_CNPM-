using LibraryManagement.API.Services;
using LibraryManagement.API.Models.DTOs; 
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using LibraryManagement.API.Utils;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authServices;
        private readonly IValidator<RegisterRequest> _registerValidator;
        private readonly IValidator<LoginRequest> _loginValidator;  // Thêm validator cho Login

        public AuthController(AuthService authService, IValidator<RegisterRequest> registerValidator, IValidator<LoginRequest> loginValidator)
        {
            _authServices = authService;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            //validate ne
            var validateRS = await _registerValidator.ValidateAsync(request);
            if (!validateRS.IsValid)
                throw new ApiException(400, string.Join(", ", validateRS.Errors.Select(e => e.ErrorMessage)));
            await _authServices.Register(request.Username, request.Email, request.Password);
            return Ok("Registered");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var validateRS = await _loginValidator.ValidateAsync(request);
            if (!validateRS.IsValid)
                throw new ApiException(400, string.Join(", ", validateRS.Errors.Select(e => e.ErrorMessage)));
            await _authServices.Login(request.Username, request.Password);
            return Ok(new { message = "Login successful" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _authServices.Logout();
            return Ok(new { message = "Logged out" });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var user = await _authServices.GetUserByIdAsync(int.Parse(userIdClaim));
            if (user == null) return NotFound();

            return Ok(new { user.UserName, user.Email, user.Role });
        }
    }
}