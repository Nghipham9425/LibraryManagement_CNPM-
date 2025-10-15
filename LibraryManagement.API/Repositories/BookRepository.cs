using LibraryManagement.API.Models;
using LibraryManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.API.Utils;

namespace LibraryManagement.API.Repositories
{
    public class BookRepository
    {
        private readonly LibraryDbContext _context;

        public BookRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<List<Book>> GetAllAsync() => await _context.Books
            .Include(b => b.BookAuthors)
            .ThenInclude(ba => ba.Author)
            .ToListAsync();
        public async Task<Book?> GetByIdAsync(int id) => await _context.Books
            .Include(b => b.BookAuthors)
            .ThenInclude(ba => ba.Author)
            .FirstOrDefaultAsync(b => b.Id == id);
        public async Task AddAsync(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Book book)
        {
            var existingBook = await _context.Books
                .Include(b => b.BookAuthors)
                .FirstOrDefaultAsync(b => b.Id == book.Id);
            if (existingBook == null)
            {
                throw new ApiException(404, "Book not found");
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
        public async Task DeleteAsync(int id)
        {
            var book = await GetByIdAsync(id);
            if (book != null)
            {
                _context.Books.Remove(book);
                await _context.SaveChangesAsync();
            }
        }
    }
}