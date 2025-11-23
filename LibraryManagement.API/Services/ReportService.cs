using LibraryManagement.API.Data;
using LibraryManagement.API.Models;
using LibraryManagement.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services
{
    public class ReportService
    {
        private readonly LibraryDbContext _db;

        public ReportService(LibraryDbContext db)
        {
            _db = db;
        }

        public async Task<List<DamagedBookReportDto>> GetDamagedBooksReportAsync(int? year = null)
        {
            // Default to current year if not specified
            var targetYear = year ?? DateTime.Now.Year;

            var query = _db.Borrowings
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                .Include(b => b.LibraryCard)
                    .ThenInclude(lc => lc.User)
                .Where(b => (b.Status == BorrowingStatus.Lost || b.Status == BorrowingStatus.Damaged)
                         && b.ReturnDate.HasValue
                         && b.ReturnDate.Value.Year == targetYear)
                .OrderByDescending(b => b.ReturnDate);

            var borrowings = await query.ToListAsync();
            
            // Get borrowing IDs
            var borrowingIds = borrowings.Select(b => b.Id).ToList();
            
            // Get fines for these borrowings
            var fines = await _db.Fines
                .Where(f => borrowingIds.Contains(f.BorrowingId))
                .ToDictionaryAsync(f => f.BorrowingId);

            return borrowings.Select(b =>
            {
                var fine = fines.ContainsKey(b.Id) ? fines[b.Id] : null;
                
                return new DamagedBookReportDto
                {
                    BorrowingId = b.Id,
                    Status = b.Status == BorrowingStatus.Lost ? "Lost" : "Damaged",
                    ReportDate = b.ReturnDate ?? DateTime.UtcNow,
                    
                    // Book info
                    BookId = b.BookItem.Book?.Id ?? 0,
                    BookTitle = b.BookItem.Book?.Title ?? "N/A",
                    Isbn = b.BookItem.Book?.Isbn ?? "",
                    Publisher = b.BookItem.Book?.Publisher ?? "",
                    PublicationYear = b.BookItem.Book?.PublicationYear,
                    
                    // BookItem info
                    BookItemId = b.BookItemId,
                    ControlNumber = b.BookItem.ControlNumber,
                    
                    // User info
                    StudentName = b.LibraryCard?.StudentName ?? "N/A",
                    CardNumber = b.LibraryCard?.CardNumber ?? "",
                    Email = b.LibraryCard?.User?.Email ?? "",
                    
                    // Fine info
                    FineAmount = fine?.Amount,
                    IsPaid = fine?.IsPaid,
                    PaidDate = fine?.PaidDate
                };
            }).ToList();
        }
    }
}
