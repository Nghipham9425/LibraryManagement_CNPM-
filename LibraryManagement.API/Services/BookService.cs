using LibraryManagement.API.Repositories;
using LibraryManagement.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using AutoMapper;
using LibraryManagement.API.Utils;

namespace LibraryManagement.API.Services
{
    public class BookService
    {
        private readonly BookRepository _bookRepository;
        private readonly AuthorRepository _authorRepository;
        private readonly IMapper _mapper;

        public BookService(BookRepository bookRepository, AuthorRepository authorRepository, IMapper mapper)
        {
            _bookRepository = bookRepository;
            _authorRepository = authorRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            var books = await _bookRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<BookDto>>(books);
        }

        public async Task<BookDto?> GetBookByIdAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null) return null;

            return _mapper.Map<BookDto>(book);
        }

        public async Task AddBookAsync(Book book)
        {
            // Kiểm tra ISBN không trùng
            if (!string.IsNullOrEmpty(book.Isbn))
            {
                var existingBooks = await _bookRepository.GetAllAsync();
                if (existingBooks.Any(b => b.Isbn == book.Isbn))
                {
                    throw new ApiException(400, "ISBN đã tồn tại", new[] { "ISBN này đã có trong hệ thống" });
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
                query = query.Where(b => b.BookAuthors.Any(ba => ba.Author != null && ba.Author.Name.Contains(author, StringComparison.OrdinalIgnoreCase)));
            }
            if (!string.IsNullOrEmpty(genre))
            {
                query = query.Where(b => b.BookGenres.Any(bg => bg.Genre != null && bg.Genre.Name.Contains(genre, StringComparison.OrdinalIgnoreCase)));
            }
            return query.ToList();
        }
    }
}