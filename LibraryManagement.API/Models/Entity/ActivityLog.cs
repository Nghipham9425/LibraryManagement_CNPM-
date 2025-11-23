namespace LibraryManagement.API.Models.Entity
{
    public class ActivityLog
    {
        public int Id { get; set; }
        public int? UserId { get; set; }  // Nullable vì có thể là system action
        public string UserName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;  // Create, Update, Delete, Login, etc.
        public string Entity { get; set; } = string.Empty;  // Book, User, Borrowing, etc.
        public int? EntityId { get; set; }  // ID của entity bị tác động
        public string Description { get; set; } = string.Empty;  // Mô tả chi tiết
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public User? User { get; set; }
    }
}
