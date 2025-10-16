namespace LibraryManagement.API.Models.Entity
{
    public enum NotificationType
    {
        General,
        BorrowSuccess,
        ReturnSuccess,
        RenewSuccess,
        DueSoon,
        Overdue
    }

    public class Notification
    {
        public int Id { get; set; }
        public int LibraryCardId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public int? BorrowingId { get; set; }

        // Navigation properties
        public LibraryCard? LibraryCard { get; set; }
        public Borrowing? Borrowing { get; set; }
    }
}