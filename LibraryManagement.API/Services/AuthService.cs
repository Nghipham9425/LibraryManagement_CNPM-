using LibraryManagement.API.Data;
using LibraryManagement.API.Dtos;
using LibraryManagement.API.Models;
using LibraryManagement.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace LibraryManagement.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly LibraryDbContext _context;

        public AuthService(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task RegisterUserAsync(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                throw new System.Exception("Email đã được sử dụng."); 
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

           var user = new User
         {
            FullName = registerDto.Name, // Dùng FullName thay vì Name
            UserName = registerDto.Email, // Có thể tạm dùng email làm username
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            Role = "Reader" 
            // Các trường khác như IsActive, CreatedAt sẽ có giá trị mặc định
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<object> LoginUserAsync(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new System.Exception("Email hoặc mật khẩu không hợp lệ.");
            }

            // Logic tạo JWT token sẽ ở đây (sẽ thêm sau)
            var token = "fake-jwt-token-for-now"; 

            return new { 
                user = new { name = user.FullName, email = user.Email }, 
                token = token 
            };
        }
    }
}