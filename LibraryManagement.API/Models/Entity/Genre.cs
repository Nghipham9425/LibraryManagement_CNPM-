using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LibraryManagement.API.Models
{
    public class Genre
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Quan hệ nhiều-nhiều với Book thông qua BookGenre
        [JsonIgnore]
        public ICollection<BookGenre> BookGenres { get; set; } = new List<BookGenre>();
    }
}