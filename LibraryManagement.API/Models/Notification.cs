using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LibraryManagement.API.Models
{
    public enum NotificationType
    {
        BorrowSuccess,      // Mượn sách thành công
        ReturnSuccess,      // Trả sách thành công
        RenewSuccess,       // Gia hạn thành công
        DueSoon,            // Sắp đến hạn (3 ngày trước)
        Overdue,            // Quá hạn
        BookAvailable,      // Sách đã có sẵn (cho tính năng đặt trước)
        General             // Thông báo chung
    }

    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LibraryCardId { get; set; }  // Changed from UserId to match our system

        [Required]
        [StringLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public NotificationType Type { get; set; } = NotificationType.General;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Optional: link to related borrowing
        public int? BorrowingId { get; set; }
        [JsonIgnore]
        public Borrowing? Borrowing { get; set; }

        // Navigation to library card
        [JsonIgnore]
        public LibraryCard? LibraryCard { get; set; }
    }
}
