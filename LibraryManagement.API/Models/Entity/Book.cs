using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.Models
{
    public class Book
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Tiêu đề sách là bắt buộc.")]
        [StringLength(255, MinimumLength = 1, ErrorMessage = "Tiêu đề sách phải từ 1 đến 255 ký tự.")]
        public string Title { get; set; } = null!;
        [Required(ErrorMessage = "Tác giả là bắt buộc.")]
        
        [StringLength(20, ErrorMessage = "ISBN không được vượt quá 20 ký tự.")]
        public string? Isbn { get; set; }
        [StringLength(100, ErrorMessage = "Thể loại không được vượt quá 100 ký tự.")]
        public string Genre { get; set; } = string.Empty; 
        [Range(1000, 2100, ErrorMessage = "Năm xuất bản phải từ 1000 đến 2100.")]
        public int? PublicationYear { get; set; }
        [StringLength(255, ErrorMessage = "Nhà xuất bản không được vượt quá 255 ký tự.")]
        public string Publisher { get; set; } = string.Empty; 
        
        public string? Description { get; set; }
    public string? ImageUrl { get; set; }

    // Quan hệ 1N với BookItem
    public ICollection<BookItem> BookItems { get; set; } = new List<BookItem>();

    // Quan hệ nhiều-nhiều với Author thông qua BookAuthor
    public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
    }
}