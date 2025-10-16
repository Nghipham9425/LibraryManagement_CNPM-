using LibraryManagement.API.Dtos;
using LibraryManagement.API.Services.Interfaces; // Chúng ta sẽ tạo IAuthService ngay sau đây
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // URL sẽ là /api/auth
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // Hệ thống sẽ inject IAuthService vào đây, tương tự như AuthorsController
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")] // Xử lý yêu cầu POST đến /api/auth/register
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                await _authService.RegisterUserAsync(registerDto);
                return Ok(new { message = "Đăng ký thành công!" });
            }
            catch (System.Exception ex)
            {
                // Trả về lỗi nếu email đã tồn tại hoặc có lỗi khác
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")] // Xử lý yêu cầu POST đến /api/auth/login
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginUserAsync(loginDto);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return Unauthorized(new { message = ex.Message }); // Dùng 401 cho lỗi đăng nhập
            }
        }
    }
}