using LibraryManagement.API.Data;
using LibraryManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Repositories
{
    public class BorrowingRepository
    {
        private readonly LibraryDbContext _db;

        public BorrowingRepository(LibraryDbContext db)
        {
            _db = db;
        }

        public async Task<Borrowing?> GetByIdAsync(int id)
        {
            return await _db.Borrowings
                .Include(b => b.BookItem)
                .ThenInclude(bi => bi.Book)
                    .ThenInclude(book => book.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .Include(b => b.LibraryCard)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<Borrowing>> GetActiveByCardAsync(int libraryCardId)
        {
            return await _db.Borrowings
                .Where(b => b.LibraryCardId == libraryCardId && b.Status == BorrowingStatus.Borrowed)
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                    .ThenInclude(book => book.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .OrderByDescending(b => b.BorrowDate)
                .ToListAsync();
        }

        public async Task<List<Borrowing>> GetHistoryByCardAsync(int libraryCardId)
        {
            return await _db.Borrowings
                .Where(b => b.LibraryCardId == libraryCardId && b.Status == BorrowingStatus.Returned)
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                    .ThenInclude(book => book.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .OrderByDescending(b => b.ReturnDate)
                .ToListAsync();
        }

        public async Task<List<Borrowing>> GetOverdueByCardAsync(int libraryCardId, DateTime today)
        {
            return await _db.Borrowings
                .Where(b => b.LibraryCardId == libraryCardId && b.Status == BorrowingStatus.Borrowed && b.DueDate < today)
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                    .ThenInclude(book => book.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .OrderBy(b => b.DueDate)
                .ToListAsync();
        }

        public async Task<Borrowing> AddAsync(Borrowing borrowing)
        {
            _db.Borrowings.Add(borrowing);
            await _db.SaveChangesAsync();
            return borrowing;
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}