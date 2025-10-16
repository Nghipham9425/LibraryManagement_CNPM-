namespace LibraryManagement.API.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? BorrowingId { get; set; }

        // Optional book info if related to borrowing
        public string? BookTitle { get; set; }
        public string? BookImageUrl { get; set; }
    }

    public class CreateNotificationDto
    {
        public int LibraryCardId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "General";
        public int? BorrowingId { get; set; }
    }
}