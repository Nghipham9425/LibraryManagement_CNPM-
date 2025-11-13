namespace LibraryManagement.API.Models
{
    //Dùng để nhận dữ liệu từ client
    public class BookInputDto
    {
        public string Title { get; set; } = string.Empty;
        public List<int> AuthorIds { get; set; } = new List<int>();
        public string? Isbn { get; set; }
        public List<int> GenreIds { get; set; } = new List<int>();
        public int? PublicationYear { get; set; }
        public string? Publisher { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        
        // Số lượng bản sao muốn tạo (chỉ dùng khi CREATE book)
        public int? NumberOfCopies { get; set; }
    }
}