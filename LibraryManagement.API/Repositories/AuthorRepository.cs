using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.API.Repositories
{
    public class AuthorRepository : IAuthorRepository
    {
        private readonly LibraryDbContext _context;

        public AuthorRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<List<Author>> GetAllAsync() => await _context.Authors.ToListAsync();
        
        public async Task<List<Author>> GetAllWithBookCountAsync() => await _context.Authors
            .Include(a => a.BookAuthors)
            .ToListAsync();
        
        public async Task<Author?> GetByIdAsync(int id) => await _context.Authors.FindAsync(id);
        public async Task<List<Author>> GetByIdsAsync(IEnumerable<int> ids) => await _context.Authors.Where(a => ids.Contains(a.Id)).ToListAsync();
        public async Task AddAsync(Author author)
        {
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Author author)
        {
            _context.Authors.Update(author);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var author = await GetByIdAsync(id);
            if (author != null)
            {
                _context.Authors.Remove(author);
                await _context.SaveChangesAsync();
            }
        }
    }
}
