using LibraryManagement.API.Models;
using LibraryManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.API.Repositories
{
    public class GenreRepository
    {
        private readonly LibraryDbContext _context;

        public GenreRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<List<Genre>> GetAllAsync() => await _context.Genres.ToListAsync();

        public async Task<List<Genre>> GetAllWithBookCountAsync() => await _context.Genres
            .Include(g => g.BookGenres)
            .ThenInclude(bg => bg.Book)
            .ToListAsync();

        public async Task<Genre?> GetByIdAsync(int id) => await _context.Genres.FindAsync(id);

        public async Task<Genre?> GetByIdWithBooksAsync(int id) => await _context.Genres
            .Include(g => g.BookGenres)
            .ThenInclude(bg => bg.Book)
            .FirstOrDefaultAsync(g => g.Id == id);

        public async Task<List<Genre>> GetByIdsAsync(IEnumerable<int> ids) => await _context.Genres.Where(g => ids.Contains(g.Id)).ToListAsync();

        public async Task AddAsync(Genre genre)
        {
            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Genre genre)
        {
            _context.Genres.Update(genre);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var genre = await GetByIdAsync(id);
            if (genre != null)
            {
                _context.Genres.Remove(genre);
                await _context.SaveChangesAsync();
            }
        }
    }
}
