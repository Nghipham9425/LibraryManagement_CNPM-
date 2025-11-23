using LibraryManagement.API.Models;

namespace LibraryManagement.API.Models.DTOs;

public class LibraryCardDto
{
    public int Id { get; set; }
    public string CardNumber { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public CardStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateLibraryCardDto
{
    public int UserId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
}

public class RegisterLibraryCardDto
{
    public string StudentName { get; set; } = string.Empty;
}

public class UpdateLibraryCardDto
{
    public string? StudentName { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public CardStatus? Status { get; set; }
}

public class CompensateDto
{
    public decimal Amount { get; set; }
    public string Notes { get; set; } = string.Empty;
}