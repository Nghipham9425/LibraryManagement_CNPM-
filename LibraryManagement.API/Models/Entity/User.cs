using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace LibraryManagement.API.Models
{
    public class User
    {
        [Key] 
        public int Id { get; set; }

        public string UserName { get; set; } = string.Empty; 

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string? FullName { get; set; }

        public string? Phone { get; set; } 

        [Column(TypeName = "TEXT")] 
        public string? Address { get; set; }

        [Column(TypeName = "ENUM('Admin', 'Librarian', 'Reader')")]
        public string Role { get; set; } = "Reader"; 

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        public string? Department { get; set; } 

        public DateOnly? HireDate { get; set; }

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}