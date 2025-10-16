using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.API.Models
{
    [Table("Users")] // Chỉ định rõ tên bảng là "Users"
    public class User
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("UserName")]
        public string UserName { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("Email")]
        public string Email { get; set; }

        [Required]
        [Column("PasswordHash")]
        public string PasswordHash { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("FullName")]
        public string FullName { get; set; }

        [MaxLength(20)]
        [Column("Phone")]
        public string? Phone { get; set; } // Dấu ? cho phép giá trị null

        [Column("Address")]
        public string? Address { get; set; }

        [Required]
        [Column("Role")]
        public string Role { get; set; }

        [Column("IsActive")]
        public bool IsActive { get; set; } = true; // Giá trị mặc định

        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Giá trị mặc định
    }
}