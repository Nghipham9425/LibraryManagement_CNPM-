using AutoMapper;
using LibraryManagement.API.DTOs.User;
using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;
using LibraryManagement.API.Utils;

namespace LibraryManagement.API.Services;

public class UserService
{
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(UserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user == null ? null : _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        // Validate username exists
        if (await _userRepository.UsernameExistsAsync(dto.UserName))
        {
            throw new ApiException(400, "Tên đăng nhập đã tồn tại");
        }

        // Validate email exists
        if (await _userRepository.EmailExistsAsync(dto.Email))
        {
            throw new ApiException(400, "Email đã tồn tại");
        }

        // Map DTO to User entity
        var user = _mapper.Map<User>(dto);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var createdUser = await _userRepository.CreateAsync(user);
        return _mapper.Map<UserDto>(createdUser);
    }

    public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto dto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        // Validate email exists for other users
        if (dto.Email != null && await _userRepository.EmailExistsAsync(dto.Email, id))
        {
            throw new ApiException(400, "Email đã tồn tại");
        }

        // Map only non-null fields from DTO to user entity
        _mapper.Map(dto, user);

        var updatedUser = await _userRepository.UpdateAsync(user);
        return _mapper.Map<UserDto>(updatedUser);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        // Soft delete: chỉ vô hiệu hóa user thay vì xóa
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        user.IsActive = false;
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<bool> ActivateUserAsync(int id)
    {
        // Kích hoạt lại user
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        user.IsActive = true;
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        // Verify current password
        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
        {
            throw new ApiException(400, "Mật khẩu hiện tại không đúng");
        }

        // Hash new password
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _userRepository.UpdateAsync(user);

        return true;
    }

    public async Task<bool> ChangePasswordDirectAsync(int userId, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _userRepository.UpdateAsync(user);

        return true;
    }
}
