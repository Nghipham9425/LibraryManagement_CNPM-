using LibraryManagement.API.Data;
using LibraryManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Repositories
{
    public class BookItemRepository
    {
        private readonly LibraryDbContext _context;

        public BookItemRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<List<BookItem>> GetAllByBookIdAsync(int bookId)
        {
            return await _context.BookItems
                .Where(bi => bi.BookId == bookId)
                .OrderBy(bi => bi.ControlNumber)
                .ToListAsync();
        }

        public async Task<BookItem?> GetByIdAsync(int id)
        {
            return await _context.BookItems.FindAsync(id);
        }

        public async Task<BookItem> CreateAsync(BookItem bookItem)
        {
            _context.BookItems.Add(bookItem);
            await _context.SaveChangesAsync();
            return bookItem;
        }

        public async Task<BookItem> UpdateAsync(BookItem bookItem)
        {
            _context.BookItems.Update(bookItem);
            await _context.SaveChangesAsync();
            return bookItem;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var bookItem = await _context.BookItems.FindAsync(id);
            if (bookItem == null) return false;

            _context.BookItems.Remove(bookItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int bookId, string controlNumber)
        {
            return await _context.BookItems
                .AnyAsync(bi => bi.BookId == bookId && bi.ControlNumber == controlNumber);
        }
    }
}
