namespace LibraryManagement.API.DTOs
{
    /// <summary>
    /// DTO for displaying borrowing information to end users
    /// </summary>
    public class BorrowingViewDto
    {
        public int Id { get; set; }
        public int LibraryCardId { get; set; }
        public int BookItemId { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int Status { get; set; }
        
        // User information (for admin)
        public string? UserName { get; set; }
        public string? CardNumber { get; set; } // Mã thẻ thư viện
        public int? LibraryCardStatus { get; set; }
        
        // Book information for display
        public BookItemViewDto? BookItem { get; set; }
    }

    public class BookItemViewDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string ControlNumber { get; set; } = string.Empty;
        public int Status { get; set; }
        
        // Nested book details
        public BookBasicDto? Book { get; set; }
    }

    public class BookBasicDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public List<string> Genres { get; set; } = new();
        public int? PublicationYear { get; set; }
        public string Publisher { get; set; } = string.Empty;
        public List<string> Authors { get; set; } = new();
    }
}