namespace LibraryManagement.API.Models.DTOs
{
    public class DamagedBookReportDto
    {
        public int BorrowingId { get; set; }
        public string Status { get; set; } = string.Empty; // "Lost" hoặc "Damaged"
        public DateTime ReportDate { get; set; } // ReturnDate khi báo mất/hỏng
        
        // Book info
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public string Isbn { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public int? PublicationYear { get; set; }
        
        // BookItem info
        public int BookItemId { get; set; }
        public string ControlNumber { get; set; } = string.Empty;
        
        // User info
        public string StudentName { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // Fine info
        public decimal? FineAmount { get; set; }
        public bool? IsPaid { get; set; }
        public DateTime? PaidDate { get; set; }
    }
}
