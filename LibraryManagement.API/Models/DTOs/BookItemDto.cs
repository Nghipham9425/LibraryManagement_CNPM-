namespace LibraryManagement.API.Models.DTOs
{
    public class BookItemDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string ControlNumber { get; set; } = string.Empty;
        public int Status { get; set; } // 0=Available, 1=Borrowed, 2=Lost, 3=Damaged
        public string Notes { get; set; } = string.Empty;
    }

    public class CreateBookItemDto
    {
        public string? ControlNumber { get; set; } // Nếu null sẽ tự động tạo
        public string? Notes { get; set; }
    }

    public class UpdateBookItemDto
    {
        public int Status { get; set; }
        public string? Notes { get; set; }
    }
}
