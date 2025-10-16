namespace LibraryManagement.API.Models
{
    public class BookViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Isbn { get; set; }
        public string? Genre { get; set; }
        public int? PublicationYear { get; set; }
        public string? Publisher { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public List<BookItem> BookItems { get; set; } = new List<BookItem>();
        public List<BookAuthorViewModel> BookAuthors { get; set; } = new List<BookAuthorViewModel>();
    }

    public class BookAuthorViewModel
    {
        public int BookId { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
    }
}