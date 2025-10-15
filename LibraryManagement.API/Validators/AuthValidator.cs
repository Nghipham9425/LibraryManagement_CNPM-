using FluentValidation;
using LibraryManagement.API.Models.DTOs;

namespace LibraryManagement.API.Validators
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Tên đăng nhập không được để trống")
                .MaximumLength(255).WithMessage("Tên đăng nhập không được vượt quá 255 ký tự");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không hợp lệ")
                .MaximumLength(255).WithMessage("Email không được vượt quá 255 ký tự");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Mật khẩu không được để trống")
                .MinimumLength(6).WithMessage("Mật khẩu phải ít nhất 6 ký tự");
        }
    }

    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Tên đăng nhập không được để trống");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Mật khẩu không được để trống");
        }
    }
}