using FluentValidation;
using LibraryManagement.API.DTOs.User;

namespace LibraryManagement.API.Validators;

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Tên đăng nhập không được để trống")
            .Length(3, 255).WithMessage("Tên đăng nhập phải từ 3 đến 255 ký tự")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống")
            .EmailAddress().WithMessage("Định dạng email không hợp lệ")
            .MaximumLength(255).WithMessage("Email không được vượt quá 255 ký tự");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống")
            .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự")
            .MaximumLength(100).WithMessage("Mật khẩu không được vượt quá 100 ký tự");

        RuleFor(x => x.FullName)
            .MaximumLength(255).WithMessage("Họ tên không được vượt quá 255 ký tự")
            .When(x => !string.IsNullOrEmpty(x.FullName));

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("Số điện thoại không được vượt quá 20 ký tự")
            .Matches(@"^[\d\s\-\+\(\)]+$").WithMessage("Định dạng số điện thoại không hợp lệ")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Vai trò không được để trống")
            .Must(role => role == "Admin" || role == "Librarian" || role == "Reader")
            .WithMessage("Vai trò phải là Admin, Librarian hoặc Reader");

        // Reader không được có phòng ban hoặc ngày vào làm
        When(x => x.Role == "Reader", () =>
        {
            RuleFor(x => x.Department)
                .Must(d => string.IsNullOrEmpty(d))
                .WithMessage("Độc giả không được có phòng ban");

            RuleFor(x => x.HireDate)
                .Must(h => !h.HasValue)
                .WithMessage("Độc giả không được có ngày vào làm");
        });

        // Admin và Librarian phải có phòng ban
        When(x => x.Role == "Admin" || x.Role == "Librarian", () =>
        {
            RuleFor(x => x.Department)
                .NotEmpty().WithMessage("Admin và Librarian phải có phòng ban");
        });

        RuleFor(x => x.Department)
            .MaximumLength(100).WithMessage("Phòng ban không được vượt quá 100 ký tự")
            .When(x => !string.IsNullOrEmpty(x.Department));
    }
}

public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
{
    public UpdateUserDtoValidator()
    {
        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Định dạng email không hợp lệ")
            .MaximumLength(255).WithMessage("Email không được vượt quá 255 ký tự")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.FullName)
            .MaximumLength(255).WithMessage("Họ tên không được vượt quá 255 ký tự")
            .When(x => !string.IsNullOrEmpty(x.FullName));

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("Số điện thoại không được vượt quá 20 ký tự")
            .Matches(@"^[\d\s\-\+\(\)]+$").WithMessage("Định dạng số điện thoại không hợp lệ")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Role)
            .Must(role => role == "Admin" || role == "Librarian" || role == "Reader")
            .WithMessage("Vai trò phải là Admin, Librarian hoặc Reader")
            .When(x => !string.IsNullOrEmpty(x.Role));

        RuleFor(x => x.Department)
            .MaximumLength(100).WithMessage("Phòng ban không được vượt quá 100 ký tự")
            .When(x => !string.IsNullOrEmpty(x.Department));
    }
}

public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
{
    public ChangePasswordDtoValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Mật khẩu hiện tại không được để trống");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Mật khẩu mới không được để trống")
            .MinimumLength(6).WithMessage("Mật khẩu mới phải có ít nhất 6 ký tự")
            .MaximumLength(100).WithMessage("Mật khẩu mới không được vượt quá 100 ký tự")
            .NotEqual(x => x.CurrentPassword).WithMessage("Mật khẩu mới phải khác mật khẩu hiện tại");
    }
}

