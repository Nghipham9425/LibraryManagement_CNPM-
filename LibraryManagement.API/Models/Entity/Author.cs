using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LibraryManagement.API.Models
{
    public class Author
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation property: nhiều-nhiều với Book
        [JsonIgnore]
        public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
    }
}
