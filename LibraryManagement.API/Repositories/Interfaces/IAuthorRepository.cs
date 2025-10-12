using LibraryManagement.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.API.Repositories.Interfaces
{
    public interface IAuthorRepository
    {
        Task<List<Author>> GetAllAsync();
        Task<List<Author>> GetAllWithBookCountAsync();
        Task<Author?> GetByIdAsync(int id);
        Task<List<Author>> GetByIdsAsync(IEnumerable<int> ids);
        Task AddAsync(Author author);
        Task UpdateAsync(Author author);
        Task DeleteAsync(int id);
    }
}
