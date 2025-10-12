using FluentValidation;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Validators
{
    public class AuthorValidator : AbstractValidator<Author>
    {
        public AuthorValidator()
        {
            RuleFor(a => a.Name)
                .NotEmpty().WithMessage("Tên tác giả là bắt buộc.")
                .Length(1, 255).WithMessage("Tên tác giả phải từ 1 đến 255 ký tự.");
        }
    }
}
