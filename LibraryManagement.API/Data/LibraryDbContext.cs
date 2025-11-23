using LibraryManagement.API.Models;
using LibraryManagement.API.Models.Entity;
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
        public DbSet<BookAuthor> BookAuthors { get; set; }
        public DbSet<BookGenre> BookGenres { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Notification> Notifications { get; set; } // Thông báo
        public DbSet<Fine> Fines { get; set; } // Tiền phạt/bồi thường
        public DbSet<Setting> Settings { get; set; } // Cấu hình hệ thống
        public DbSet<ActivityLog> ActivityLogs { get; set; } // Nhật ký hoạt động

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<BookAuthor>()
                .HasKey(ba => new { ba.BookId, ba.AuthorId });
            
            modelBuilder.Entity<BookGenre>()
                .HasKey(bg => new { bg.BookId, bg.GenreId });
            
            modelBuilder.Entity<Author>().ToTable("Authors");
        }
    }
}