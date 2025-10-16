using LibraryManagement.API.Data;
using LibraryManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly LibraryDbContext _db;

        public SeedController(LibraryDbContext db)
        {
            _db = db;
        }

        // POST api/seed/bootstrap
        // Tạo dữ liệu demo: LibraryCard (Id=1), sample Books nếu thiếu, và BookItems Available
        [HttpPost("bootstrap")]
        public async Task<IActionResult> Bootstrap()
        {
            // Ensure books exist (create samples if none)
            if (!await _db.Books.AnyAsync())
            {
                var sampleBooks = new List<Book>
                {
                    new Book { Title = "Database System Concepts", Isbn = "9780073523323", Genre = "Computer Science", PublicationYear = 2010, Publisher = "McGraw-Hill" },
                    new Book { Title = "Clean Code", Isbn = "9780132350884", Genre = "Programming", PublicationYear = 2008, Publisher = "Prentice Hall" },
                    new Book { Title = "The Pragmatic Programmer", Isbn = "9780201616224", Genre = "Programming", PublicationYear = 1999, Publisher = "Addison-Wesley" }
                };
                _db.Books.AddRange(sampleBooks);
                await _db.SaveChangesAsync();
            }

            // Ensure each book has at least one available BookItem
            var books = await _db.Books.Include(b => b.BookItems).ToListAsync();
            foreach (var b in books)
            {
                if (!b.BookItems.Any())
                {
                    _db.BookItems.Add(new BookItem
                    {
                        BookId = b.Id,
                        ControlNumber = $"CTRL-{b.Id}-1",
                        Status = BookItemStatus.Available,
                        Notes = "Seeded item"
                    });
                }
            }
            await _db.SaveChangesAsync();

            // Ensure LibraryCard with Id=1 exists and is Active
            var card1 = await _db.LibraryCards.FirstOrDefaultAsync(c => c.Id == 1);
            if (card1 == null)
            {
                // Try to set Id=1 explicitly; MySQL allows explicit auto_increment values if not duplicated
                card1 = new LibraryCard
                {
                    Id = 1,
                    StudentName = "Demo User",
                    ExpiryDate = DateTime.UtcNow.AddYears(1),
                    Status = CardStatus.Active
                };
                _db.LibraryCards.Add(card1);
                try
                {
                    await _db.SaveChangesAsync();
                }
                catch
                {
                    // If cannot set Id=1 (already taken), just ensure there's at least one Active card
                }
            }

            // If Id=1 still not Active, ensure there's at least one Active card and return its Id
            card1 = await _db.LibraryCards.FirstOrDefaultAsync(c => c.Id == 1);
            if (card1 == null)
            {
                var existingActive = await _db.LibraryCards.FirstOrDefaultAsync(c => c.Status == CardStatus.Active);
                if (existingActive == null)
                {
                    existingActive = new LibraryCard
                    {
                        StudentName = "Demo User",
                        ExpiryDate = DateTime.UtcNow.AddYears(1),
                        Status = CardStatus.Active
                    };
                    _db.LibraryCards.Add(existingActive);
                    await _db.SaveChangesAsync();
                }
                return Ok(new { message = "Seeded", libraryCardId = existingActive.Id });
            }

            return Ok(new { message = "Seeded", libraryCardId = 1 });
        }
    }
}
