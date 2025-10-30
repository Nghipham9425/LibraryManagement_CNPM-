using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.API.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }
        
        public string Token { get; set; } = string.Empty;
        
        public int UserId { get; set; }
        
        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime Created { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("UserId")] 
        public User? User { get; set; }
    }
}