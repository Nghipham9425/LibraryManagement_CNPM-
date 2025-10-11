using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.API.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly LibraryDbContext _context;

        public BookRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<List<Book>> GetAllAsync() => await _context.Books.ToListAsync();
        public async Task<Book?> GetByIdAsync(int id) => await _context.Books.FindAsync(id);
        public async Task AddAsync(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Book book)
        {
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var book = await GetByIdAsync(id);
            if (book != null)
            {
                _context.Books.Remove(book);
                await _context.SaveChangesAsync();
            }
        }
    }
}