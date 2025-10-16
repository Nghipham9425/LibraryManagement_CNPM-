using LibraryManagement.API.Repositories;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Services.Interfaces;
using LibraryManagement.API.Models;
using LibraryManagement.API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace LibraryManagement.API.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        private readonly IAuthorRepository _authorRepository;
        private readonly LibraryDbContext _context;

        public BookService(IBookRepository bookRepository, IAuthorRepository authorRepository, LibraryDbContext context)
        {
            _bookRepository = bookRepository;
            _authorRepository = authorRepository;
            _context = context;
        }

        public async Task<IEnumerable<BookViewModel>> GetAllBooksAsync()
        {
            var books = await _bookRepository.GetAllAsync();
            return books.Select(b => new BookViewModel
            {
                Id = b.Id,
                Title = b.Title,
                Isbn = b.Isbn,
                Genre = b.Genre,
                PublicationYear = b.PublicationYear,
                Publisher = b.Publisher,
                ImageUrl = b.ImageUrl,
                Description = b.Description,
                BookItems = b.BookItems.ToList(),
                BookAuthors = b.BookAuthors.Select(ba => new BookAuthorViewModel
                {
                    BookId = ba.BookId,
                    AuthorId = ba.AuthorId,
                    AuthorName = ba.Author?.Name ?? ""
                }).ToList()
            });
        }

        public async Task<BookViewModel?> GetBookByIdAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null) return null;

            return new BookViewModel
            {
                Id = book.Id,
                Title = book.Title,
                Isbn = book.Isbn,
                Genre = book.Genre,
                PublicationYear = book.PublicationYear,
                Publisher = book.Publisher,
                ImageUrl = book.ImageUrl,
                Description = book.Description,
                BookItems = book.BookItems.ToList(),
                BookAuthors = book.BookAuthors.Select(ba => new BookAuthorViewModel
                {
                    BookId = ba.BookId,
                    AuthorId = ba.AuthorId,
                    AuthorName = ba.Author?.Name ?? ""
                }).ToList()
            };
        }

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
            // Load existing book with relationships
            var existingBook = await _bookRepository.GetByIdAsync(book.Id);
            if (existingBook == null)
            {
                throw new Exception("Book not found");
            }

            // Update basic properties
            existingBook.Title = book.Title;
            existingBook.Isbn = book.Isbn;
            existingBook.Genre = book.Genre;
            existingBook.PublicationYear = book.PublicationYear;
            existingBook.Publisher = book.Publisher;
            existingBook.ImageUrl = book.ImageUrl;
            existingBook.Description = book.Description;

            // Remove existing BookAuthor relationships
            _context.BookAuthors.RemoveRange(existingBook.BookAuthors);

            // Add new BookAuthor relationships
            foreach (var bookAuthor in book.BookAuthors)
            {
                _context.BookAuthors.Add(new BookAuthor
                {
                    BookId = book.Id,
                    AuthorId = bookAuthor.AuthorId
                });
            }

            await _context.SaveChangesAsync();
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
                query = query.Where(b => b.Genre.Contains(genre, StringComparison.OrdinalIgnoreCase));
            }
            return query.ToList();
        }

        public async Task<Book> CreateBookFromDto(BookInputDto bookInput)
        {
            var authors = await _authorRepository.GetByIdsAsync(bookInput.AuthorIds);
            
            return new Book
            {
                Title = bookInput.Title,
                Isbn = bookInput.Isbn,
                Genre = bookInput.Genre ?? "",
                PublicationYear = bookInput.PublicationYear,
                Publisher = bookInput.Publisher ?? "",
                ImageUrl = bookInput.ImageUrl,
                Description = bookInput.Description,
                BookAuthors = authors.Select(author => new BookAuthor { AuthorId = author.Id }).ToList()
            };
        }

        public async Task<Book> UpdateBookFromDto(int id, BookInputDto bookInput)
        {
            var authors = await _authorRepository.GetByIdsAsync(bookInput.AuthorIds);
            
            return new Book
            {
                Id = id,
                Title = bookInput.Title,
                Isbn = bookInput.Isbn,
                Genre = bookInput.Genre ?? "",
                PublicationYear = bookInput.PublicationYear,
                Publisher = bookInput.Publisher ?? "",
                ImageUrl = bookInput.ImageUrl,
                Description = bookInput.Description,
                BookAuthors = authors.Select(author => new BookAuthor { BookId = id, AuthorId = author.Id }).ToList()
            };
        }
    }
}