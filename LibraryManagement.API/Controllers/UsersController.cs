using LibraryManagement.API.DTOs.User;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ActivityLogService _activityLogService;

    public UsersController(UserService userService, ActivityLogService activityLogService)
    {
        _userService = userService;
        _activityLogService = activityLogService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        return Ok(user);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ" });
        }

        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        return Ok(user);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        var user = await _userService.CreateUserAsync(dto);
        
        // Log activity
        await _activityLogService.LogAsync("Create", "User", user.Id, $"Đã tạo người dùng '{user.UserName}' với role {user.Role}");
        
        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await _userService.UpdateUserAsync(id, dto);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Log activity
        await _activityLogService.LogAsync("Update", "User", id, $"Đã cập nhật thông tin người dùng '{user.UserName}'");

        return Ok(user);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UpdateUserDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ" });
        }

        if (dto.Role != null)
        {
            return BadRequest(new { message = "Bạn không thể thay đổi vai trò của chính mình" });
        }

        var user = await _userService.UpdateUserAsync(userId, dto);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        return Ok(user);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim != null && int.TryParse(userIdClaim, out int currentUserId) && currentUserId == id)
        {
            return BadRequest(new { message = "Bạn không thể vô hiệu hóa tài khoản của chính mình" });
        }

        var result = await _userService.DeleteUserAsync(id);
        if (!result)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        return Ok(new { message = "Đã vô hiệu hóa người dùng thành công" });
    }

    [HttpPost("{id}/activate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ActivateUser(int id)
    {
        var result = await _userService.ActivateUserAsync(id);
        if (!result)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        return Ok(new { message = "Đã kích hoạt người dùng thành công" });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ" });
        }

        var result = await _userService.ChangePasswordAsync(userId, dto);
        if (!result)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        return Ok(new { message = "Đổi mật khẩu thành công" });
    }

    [HttpPost("{id}/change-password-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ChangePasswordAdmin(int id, [FromBody] ChangePasswordAdminDto dto)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        if (user.Role != "Admin" && user.Role != "Librarian")
        {
            return BadRequest(new { message = "Chỉ có thể đổi mật khẩu cho Admin và Librarian" });
        }

        var result = await _userService.ChangePasswordDirectAsync(id, dto.NewPassword);
        if (!result)
        {
            return BadRequest(new { message = "Không thể đổi mật khẩu" });
        }

        return Ok(new { message = "Đổi mật khẩu thành công" });
    }
}

public class ChangePasswordAdminDto
{
    public string NewPassword { get; set; } = string.Empty;
}
