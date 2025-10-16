using System.ComponentModel.DataAnnotations;

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
        public string StudentName { get; set; } = string.Empty; // Họ tên sinh viên
        [Required]
        public DateTime ExpiryDate { get; set; } // Ngày hết hạn
        public CardStatus Status { get; set; } = CardStatus.Active; // Tình trạng thẻ

        // Quan hệ 1:N với Borrowing
        public ICollection<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
    }
}