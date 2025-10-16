namespace LibraryManagement.API.Models
{
    public class BookInputDto
    {
        public string Title { get; set; } = string.Empty;
        public List<int> AuthorIds { get; set; } = new List<int>();
        public string? Isbn { get; set; }
        public string? Genre { get; set; }
        public int? PublicationYear { get; set; }
        public string? Publisher { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
    }
}