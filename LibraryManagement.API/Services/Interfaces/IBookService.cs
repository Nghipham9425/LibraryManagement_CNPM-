using LibraryManagement.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.API.Services.Interfaces
{
    public interface IBookService
    {
        Task<IEnumerable<Book>> GetAllBooksAsync();
        Task<Book?> GetBookByIdAsync(int id);
        Task AddBookAsync(Book book);
        Task UpdateBookAsync(Book book);
        Task DeleteBookAsync(int id);
        Task<IEnumerable<Book>> SearchBooksAsync(string? title, string? author, string? genre);
    }
}