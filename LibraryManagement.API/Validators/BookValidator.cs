using FluentValidation;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Validators
{
    public class BookValidator : AbstractValidator<Book>
    {
        public BookValidator()
        {
            RuleFor(book => book.Title)
                .NotEmpty().WithMessage("Tiêu đề sách là bắt buộc.")
                .Length(1, 255).WithMessage("Tiêu đề sách phải từ 1 đến 255 ký tự.");


            RuleFor(book => book.Isbn)
                .MaximumLength(20).WithMessage("ISBN không được vượt quá 20 ký tự.");

            RuleFor(book => book.PublicationYear)
                .InclusiveBetween(1300, 2100).WithMessage("Năm xuất bản phải từ 1300 đến 2100.")
                .When(book => book.PublicationYear.HasValue);

            RuleFor(book => book.Publisher)
                .MaximumLength(255).WithMessage("Nhà xuất bản không được vượt quá 255 ký tự.");

            RuleFor(book => book.ImageUrl)
                .Must(BeAValidUrl).WithMessage("URL hình ảnh không hợp lệ.")
                .When(book => !string.IsNullOrWhiteSpace(book.ImageUrl));
        }

        private bool BeAValidUrl(string? url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }
    }
}