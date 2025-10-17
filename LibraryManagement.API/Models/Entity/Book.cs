using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.API.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        
        public string? Isbn { get; set; }
        public int? PublicationYear { get; set; }
        public string Publisher { get; set; } = string.Empty; 
        
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }

        // Quan hệ 1N với BookItem
        public ICollection<BookItem> BookItems { get; set; } = new List<BookItem>();

        // Quan hệ nhiều-nhiều với Author thông qua BookAuthor
        public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();

        // Quan hệ nhiều-nhiều với Genre thông qua BookGenre
        public ICollection<BookGenre> BookGenres { get; set; } = new List<BookGenre>();
    }
}