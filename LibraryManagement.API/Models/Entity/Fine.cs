using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LibraryManagement.API.Models
{
    public class Fine
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int BorrowingId { get; set; }
        
        [ForeignKey("BorrowingId")]
        [JsonIgnore]
        public Borrowing Borrowing { get; set; } = null!;
        
        [Required]
        public decimal Amount { get; set; } // Số tiền phạt/bồi thường
        
        [Required]
        public string Reason { get; set; } = string.Empty; // Lý do: "Lost", "Damaged", "Overdue"
        
        public bool IsPaid { get; set; } = false; // Đã thanh toán chưa
        
        public DateTime? PaidDate { get; set; } // Ngày thanh toán
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
