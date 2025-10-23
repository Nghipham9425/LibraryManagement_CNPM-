using System.ComponentModel.DataAnnotations; // Thêm dòng này cho [Key]
using System.ComponentModel.DataAnnotations.Schema; // Cho [ForeignKey]

namespace LibraryManagement.API.Models
{
    public class RefreshToken
    {
        [Key] // Giữ lại cho EF Core
        public int Id { get; set; }
        
        public string Token { get; set; } = string.Empty; // Bỏ [Required] và [MaxLength] - dùng validator
        
        public int UserId { get; set; } // Bỏ [Required] - dùng validator
        
        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime Created { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        [ForeignKey("UserId")] // Giữ lại cho EF Core
        public User? User { get; set; }
    }
}