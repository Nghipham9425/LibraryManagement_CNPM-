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
    }
}