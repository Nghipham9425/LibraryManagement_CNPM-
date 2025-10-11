using LibraryManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Data
{
    public class LibraryDbContext : DbContext
    {
        public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; }
        public DbSet<BookItem> BookItems { get; set; }
        public DbSet<LibraryCard> LibraryCards { get; set; } // Thêm cho thẻ thư viện
        public DbSet<Borrowing> Borrowings { get; set; } // Thêm cho giao dịch mượn
    }
}