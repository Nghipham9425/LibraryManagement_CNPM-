using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? FullName { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Column(TypeName = "TEXT")]
        public string? Address { get; set; }

        [Required]
        [Column(TypeName = "ENUM('Admin', 'Librarian', 'Reader')")]
        public string Role { get; set; } = "Reader";  // Mặc định Reader

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        public DateOnly? HireDate { get; set; }

        // Navigation property cho RefreshTokens
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}