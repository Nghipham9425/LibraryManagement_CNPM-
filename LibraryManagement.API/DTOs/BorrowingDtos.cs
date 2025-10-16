using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.DTOs
{
    public class BorrowRequestDto
    {
        [Required]
        public int LibraryCardId { get; set; }

        [Required]
        public int BookItemId { get; set; }

        // Optional number of days to borrow (default 15)
        [Range(1, 60)]
        public int? Days { get; set; }
    }

    public class RenewRequestDto
    {
        [Required]
        public int BorrowingId { get; set; }

        [Range(1, 30)]
        public int ExtendDays { get; set; } = 7;
    }

    public class ReturnRequestDto
    {
        [Required]
        public int BorrowingId { get; set; }
    }
}
