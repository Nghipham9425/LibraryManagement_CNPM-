namespace LibraryManagement.API.Models.Entity
{
    public class Setting
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string DataType { get; set; } = "int"; // int, decimal, string
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
