using LibraryManagement.API.Repositories;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Services.Interfaces;
using LibraryManagement.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace LibraryManagement.API.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;

        public BookService(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<IEnumerable<Book>> GetAllBooksAsync() => await _bookRepository.GetAllAsync();

        public async Task<Book?> GetBookByIdAsync(int id) => await _bookRepository.GetByIdAsync(id);

        public async Task AddBookAsync(Book book)
        {
            // Validation: Kiểm tra ISBN không trùng (nếu có)
            if (!string.IsNullOrEmpty(book.Isbn))
            {
                var existingBooks = await _bookRepository.GetAllAsync();
                if (existingBooks.Any(b => b.Isbn == book.Isbn))
                {
                    throw new ArgumentException("ISBN đã tồn tại");
                }
            }
            // Validation: Title và Author bắt buộc
            if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
            {
                throw new ArgumentException("Title và Author là bắt buộc");
            }
            await _bookRepository.AddAsync(book);
        }

        public async Task UpdateBookAsync(Book book)
        {
            // Validation: Title và Author bắt buộc
            if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
            {
                throw new ArgumentException("Title và Author là bắt buộc");
            }

            // Validation: Kiểm tra ISBN không trùng với sách khác (nếu có) - bỏ qua cho update để tránh lỗi duplicate
            // if (!string.IsNullOrEmpty(book.Isbn))
            // {
            //     var existingBooks = await _bookRepository.GetAllAsync();
            //     if (existingBooks.Any(b => b.Isbn == book.Isbn && b.Id != book.Id))
            //     {
            //         throw new ArgumentException("ISBN đã tồn tại");
            //     }
            // }

            await _bookRepository.UpdateAsync(book);
        }

        public async Task DeleteBookAsync(int id) => await _bookRepository.DeleteAsync(id);

        // Thêm logic tìm kiếm sách
        public async Task<IEnumerable<Book>> SearchBooksAsync(string? title, string? author, string? genre)
        {
            var books = await _bookRepository.GetAllAsync();
            var query = books.AsQueryable();
            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(b => b.Title.Contains(title, StringComparison.OrdinalIgnoreCase));
            }
            if (!string.IsNullOrEmpty(author))
            {
                query = query.Where(b => b.Author.Contains(author, StringComparison.OrdinalIgnoreCase));
            }
            if (!string.IsNullOrEmpty(genre))
            {
                query = query.Where(b => b.Genre.Contains(genre, StringComparison.OrdinalIgnoreCase));
            }
            return query.ToList();
        }
    }
}