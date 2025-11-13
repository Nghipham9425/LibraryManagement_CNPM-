using FluentValidation;
using LibraryManagement.API.Models.DTOs;

namespace LibraryManagement.API.Validators;

public class CreateLibraryCardDtoValidator : AbstractValidator<CreateLibraryCardDto>
{
    public CreateLibraryCardDtoValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0)
            .WithMessage("UserId phải lớn hơn 0");

        RuleFor(x => x.StudentName)
            .NotEmpty()
            .WithMessage("Tên sinh viên không được để trống")
            .MaximumLength(100)
            .WithMessage("Tên sinh viên không được quá 100 ký tự");

        RuleFor(x => x.ExpiryDate)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Ngày hết hạn phải lớn hơn ngày hiện tại");
    }
}

public class RegisterLibraryCardDtoValidator : AbstractValidator<RegisterLibraryCardDto>
{
    public RegisterLibraryCardDtoValidator()
    {
        RuleFor(x => x.StudentName)
            .NotEmpty()
            .WithMessage("Tên sinh viên không được để trống")
            .MaximumLength(100)
            .WithMessage("Tên sinh viên không được quá 100 ký tự");
    }
}

public class UpdateLibraryCardDtoValidator : AbstractValidator<UpdateLibraryCardDto>
{
    public UpdateLibraryCardDtoValidator()
    {
        When(x => !string.IsNullOrEmpty(x.StudentName), () =>
        {
            RuleFor(x => x.StudentName)
                .MaximumLength(100)
                .WithMessage("Tên sinh viên không được quá 100 ký tự");
        });

        When(x => x.ExpiryDate.HasValue, () =>
        {
            RuleFor(x => x.ExpiryDate)
                .GreaterThan(DateTime.UtcNow.AddDays(-1))
                .WithMessage("Ngày hết hạn không hợp lệ");
        });

        When(x => x.Status.HasValue, () =>
        {
            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Trạng thái thẻ không hợp lệ");
        });
    }
}