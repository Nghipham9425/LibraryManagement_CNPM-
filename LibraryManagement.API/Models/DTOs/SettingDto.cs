namespace LibraryManagement.API.Models.DTOs
{
    public class SettingDto
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string DataType { get; set; } = "int";
        public DateTime UpdatedAt { get; set; }
    }

    public class UpdateSettingDto
    {
        public string Value { get; set; } = string.Empty;
    }
}
