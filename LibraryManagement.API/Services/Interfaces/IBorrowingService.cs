using LibraryManagement.API.Models;
using LibraryManagement.API.DTOs;

namespace LibraryManagement.API.Services.Interfaces
{
    public interface IBorrowingService
    {
        Task<Borrowing> BorrowAsync(BorrowRequestDto request);
        Task<Borrowing> ReturnAsync(ReturnRequestDto request);
        Task<Borrowing> RenewAsync(RenewRequestDto request);
        Task<List<BorrowingViewDto>> GetActiveAsync(int libraryCardId);
        Task<List<BorrowingViewDto>> GetHistoryAsync(int libraryCardId);
        Task<List<BorrowingViewDto>> GetOverdueAsync(int libraryCardId);
    }
}
