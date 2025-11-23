using LibraryManagement.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly LibraryDbContext _db;

        public DashboardController(LibraryDbContext db)
        {
            _db = db;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalBooks = await _db.Books.CountAsync();
            var totalMembers = await _db.Users.CountAsync(u => u.IsActive);
            var totalLibraryCards = await _db.LibraryCards.CountAsync();
            var borrowingCount = await _db.Borrowings.CountAsync(b => b.Status == BorrowingStatus.Borrowed);
            var returnsToday = await _db.Borrowings.CountAsync(b => b.ReturnDate.HasValue && b.ReturnDate.Value.Date == DateTime.UtcNow.Date);

            return Ok(new
            {
                totalBooks,
                totalMembers,
                totalLibraryCards,
                borrowingCount,
                returnsToday
            });
        }

        [HttpGet("borrowing-trend")]
        public async Task<IActionResult> GetBorrowingTrend([FromQuery] int months = 6)
        {
            var startDate = DateTime.UtcNow.AddMonths(-months);
            
            var data = await _db.Borrowings
                .Where(b => b.BorrowDate >= startDate)
                .GroupBy(b => new { b.BorrowDate.Year, b.BorrowDate.Month })
                .Select(g => new
                {
                    Month = $"{g.Key.Month:D2}/{g.Key.Year}",
                    Year = g.Key.Year,
                    MonthNum = g.Key.Month,
                    Count = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.MonthNum)
                .ToListAsync();
            
            return Ok(data);
        }

        [HttpGet("top-books")]
        public async Task<IActionResult> GetTopBooks([FromQuery] int limit = 10)
        {
            var topBooks = await _db.Borrowings
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                .GroupBy(b => new { b.BookItem.Book.Id, b.BookItem.Book.Title })
                .Select(g => new
                {
                    BookTitle = g.Key.Title,
                    BorrowCount = g.Count()
                })
                .OrderByDescending(x => x.BorrowCount)
                .Take(limit)
                .ToListAsync();
            
            return Ok(topBooks);
        }

        [HttpGet("genre-distribution")]
        public async Task<IActionResult> GetGenreDistribution()
        {
            var genreData = await _db.BookGenres
                .Include(bg => bg.Genre)
                .Where(bg => bg.Genre != null)
                .GroupBy(bg => bg.Genre!.Name)
                .Select(g => new
                {
                    Genre = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .Take(8)
                .ToListAsync();
            
            return Ok(genreData);
        }

        [HttpGet("overdue-stats")]
        public async Task<IActionResult> GetOverdueStats()
        {
            var now = DateTime.UtcNow;
            
            var overdue = await _db.Borrowings
                .Where(b => b.Status == BorrowingStatus.Borrowed && b.DueDate < now)
                .CountAsync();
            
            var dueThisWeek = await _db.Borrowings
                .Where(b => b.Status == BorrowingStatus.Borrowed && b.DueDate >= now && b.DueDate <= now.AddDays(7))
                .CountAsync();
            
            return Ok(new
            {
                Overdue = overdue,
                DueThisWeek = dueThisWeek
            });
        }
    }
}