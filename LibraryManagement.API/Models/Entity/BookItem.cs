using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.API.Models
{
    public enum BookItemStatus
    {
        Available, // Còn
        Borrowed,  // Cho mượn
        Lost,      // Mất
        Damaged    // Hỏng
    }
        
    public class BookItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookId { get; set; }
        [ForeignKey("BookId")]
        public Book Book { get; set; } = null!;

        [Required]
        public string ControlNumber { get; set; } = string.Empty; 

        public BookItemStatus Status { get; set; } = BookItemStatus.Available;

        public string Notes { get; set; } = string.Empty; 
    }
}