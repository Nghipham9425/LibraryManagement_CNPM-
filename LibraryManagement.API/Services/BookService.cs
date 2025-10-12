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
            // Kiểm tra ISBN không trùng
            if (!string.IsNullOrEmpty(book.Isbn))
            {
                var existingBooks = await _bookRepository.GetAllAsync();
                if (existingBooks.Any(b => b.Isbn == book.Isbn))
                {
                    throw new LibraryManagement.API.Utils.ApiException(400, "ISBN đã tồn tại", new[] { "ISBN này đã có trong hệ thống" });
                }
            }
            await _bookRepository.AddAsync(book);
        }

        public async Task UpdateBookAsync(Book book)
        {

            await _bookRepository.UpdateAsync(book);
        }

        public async Task DeleteBookAsync(int id) => await _bookRepository.DeleteAsync(id);

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