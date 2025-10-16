using LibraryManagement.API.Models;

namespace LibraryManagement.API.Repositories.Interfaces
{
    public interface IBorrowingRepository
    {
        Task<Borrowing?> GetByIdAsync(int id);
        Task<List<Borrowing>> GetActiveByCardAsync(int libraryCardId);
        Task<List<Borrowing>> GetHistoryByCardAsync(int libraryCardId);
        Task<List<Borrowing>> GetOverdueByCardAsync(int libraryCardId, DateTime today);
        Task<Borrowing> AddAsync(Borrowing borrowing);
        Task SaveChangesAsync();
    }
}
