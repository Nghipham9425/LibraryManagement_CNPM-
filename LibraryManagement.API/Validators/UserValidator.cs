using FluentValidation;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Validators
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Tên đăng nhập không được để trống")
                .MaximumLength(255).WithMessage("Tên đăng nhập không được vượt quá 255 ký tự");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không hợp lệ")
                .MaximumLength(255).WithMessage("Email không được vượt quá 255 ký tự");

            RuleFor(x => x.PasswordHash)
                .NotEmpty().WithMessage("Mật khẩu không được để trống")
                .MaximumLength(500).WithMessage("Mật khẩu không được vượt quá 500 ký tự");

            RuleFor(x => x.FullName)
                .MaximumLength(255).WithMessage("Họ tên không được vượt quá 255 ký tự")
                .When(x => !string.IsNullOrEmpty(x.FullName));

            RuleFor(x => x.Phone)
                .MaximumLength(20).WithMessage("Số điện thoại không được vượt quá 20 ký tự")
                .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Vai trò không được để trống")
                .Must(role => new[] { "Admin", "Librarian", "Reader" }.Contains(role))
                .WithMessage("Vai trò phải là Admin, Librarian hoặc Reader");

            RuleFor(x => x.Department)
                .MaximumLength(255).WithMessage("Phòng ban không được vượt quá 255 ký tự")
                .When(x => !string.IsNullOrEmpty(x.Department));
        }
    }
}
