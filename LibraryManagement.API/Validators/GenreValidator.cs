using FluentValidation;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Validators
{
    public class GenreValidator : AbstractValidator<Genre>
    {
        public GenreValidator()
        {
            RuleFor(g => g.Name)
                .NotEmpty().WithMessage("Tên thể loại là bắt buộc.")
                .Length(1, 100).WithMessage("Tên thể loại phải từ 1 đến 100 ký tự.");

            RuleFor(g => g.Description)
                .MaximumLength(500).WithMessage("Mô tả thể loại không được vượt quá 500 ký tự.")
                .When(g => !string.IsNullOrEmpty(g.Description));
        }
    }
}