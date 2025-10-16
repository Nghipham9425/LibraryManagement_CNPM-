using LibraryManagement.API.Dtos;
using System.Threading.Tasks;

namespace LibraryManagement.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task RegisterUserAsync(RegisterDto registerDto);
        Task<object> LoginUserAsync(LoginDto loginDto); // Trả về object chứa user và token
    }
}