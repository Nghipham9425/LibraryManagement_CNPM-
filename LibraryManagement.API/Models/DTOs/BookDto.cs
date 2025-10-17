namespace LibraryManagement.API.Models
{
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Isbn { get; set; }
        public List<string> Genres { get; set; } = new List<string>();
        public int? PublicationYear { get; set; }
        public string? Publisher { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public List<BookItem> BookItems { get; set; } = new List<BookItem>();
        public List<BookAuthorDto> BookAuthors { get; set; } = new List<BookAuthorDto>();
    }

    public class BookAuthorDto
    {
        public int BookId { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
    }
}