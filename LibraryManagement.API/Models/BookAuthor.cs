using System.Text.Json.Serialization;
namespace LibraryManagement.API.Models
{
    public class BookAuthor
    {
    public int BookId { get; set; }
    public int AuthorId { get; set; }

        // Navigation properties
    [JsonIgnore]
    public Book? Book { get; set; }
    [JsonIgnore]
    public Author? Author { get; set; }
    }
}
