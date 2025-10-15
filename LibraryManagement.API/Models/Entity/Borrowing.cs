using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.API.Models
{
    public enum BorrowingStatus
    {
        Borrowed, // Đang mượn
        Returned, // Đã trả
        Lost,     // Mất
        Damaged   // Hỏng
    }

    public class Borrowing
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int LibraryCardId { get; set; } // FK đến LibraryCard
        [ForeignKey("LibraryCardId")]
        public LibraryCard LibraryCard { get; set; } = null!;
        [Required]
        public int BookItemId { get; set; } // FK đến BookItem
        [ForeignKey("BookItemId")]
        public BookItem BookItem { get; set; } = null!;
        [Required]
        public DateTime BorrowDate { get; set; } // Ngày mượn
        [Required]
        public DateTime DueDate { get; set; } // Ngày hết hạn (tối đa 15 ngày)
        public DateTime? ReturnDate { get; set; } // Ngày trả (nullable)
        public BorrowingStatus Status { get; set; } = BorrowingStatus.Borrowed; // Tình trạng mượn
    }
}