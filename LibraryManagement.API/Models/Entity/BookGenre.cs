using System.Text.Json.Serialization;

namespace LibraryManagement.API.Models
{
    public class BookGenre
    {
        public int BookId { get; set; }
        public int GenreId { get; set; }

        [JsonIgnore]
        public Book? Book { get; set; }
        [JsonIgnore]
        public Genre? Genre { get; set; }
    }
}