using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LibraryManagement.API.Models
{
    public enum CardStatus
    {
        Active,   // Sử dụng được
        Inactive  // Không sử dụng
    }

    public class LibraryCard
    {
        [Key]
        public int Id { get; set; } // Số thẻ
        
        [Required]
        public int UserId { get; set; } // FK tới User
        
        [Required]
        public string CardNumber { get; set; } = string.Empty; // Mã thẻ (LIB000001)
        
        [Required]
        public string StudentName { get; set; } = string.Empty; // Họ tên sinh viên
        
        [Required]
        public DateTime ExpiryDate { get; set; } // Ngày hết hạn
        
        public CardStatus Status { get; set; } = CardStatus.Active; // Tình trạng thẻ
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Ngày tạo thẻ

        // Navigation Properties
        [JsonIgnore]
        public User? User { get; set; } // Quan hệ 1:1 với User
        
        // Quan hệ 1:N với Borrowing
        [JsonIgnore]
        public ICollection<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
    }
}