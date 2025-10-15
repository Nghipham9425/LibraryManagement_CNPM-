namespace LibraryManagement.API.Models
{
    //Dùng để hiển thị trên UI
    public class AuthorViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int BookCount { get; set; }
    }
}