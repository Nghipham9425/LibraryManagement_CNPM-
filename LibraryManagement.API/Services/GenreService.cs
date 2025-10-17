using LibraryManagement.API.Repositories;
using LibraryManagement.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using LibraryManagement.API.Utils;

namespace LibraryManagement.API.Services
{
    public class GenreService
    {
        private readonly GenreRepository _genreRepository;

        public GenreService(GenreRepository genreRepository)
        {
            _genreRepository = genreRepository;
        }

        public async Task<IEnumerable<GenreDto>> GetAllGenresAsync()
        {
            var genres = await _genreRepository.GetAllWithBookCountAsync();
            return genres.Select(g => new GenreDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                BookCount = g.BookGenres?.Count ?? 0
            });
        }

        public async Task<Genre?> GetGenreByIdAsync(int id) => await _genreRepository.GetByIdAsync(id);

        public async Task AddGenreAsync(Genre genre)
        {
            // Kiểm tra tên thể loại không trùng
            var existingGenres = await _genreRepository.GetAllAsync();
            if (existingGenres.Any(g => g.Name.ToLower() == genre.Name.ToLower()))
            {
                throw new ApiException(400, "Tên thể loại đã tồn tại", new[] { "Tên thể loại này đã có trong hệ thống" });
            }
            await _genreRepository.AddAsync(genre);
        }

        public async Task UpdateGenreAsync(Genre genre)
        {
            await _genreRepository.UpdateAsync(genre);
        }

        public async Task DeleteGenreAsync(int id)
        {
            var genre = await _genreRepository.GetByIdWithBooksAsync(id);
            if (genre == null)
            {
                throw new ApiException(404, "Thể loại không tồn tại");
            }
            if (genre.BookGenres.Any())
            {
                throw new ApiException(400, "Không thể xóa thể loại đã có sách liên kết", new[] { "Thể loại này đã được gắn với một hoặc nhiều sách. Vui lòng gỡ bỏ liên kết trước khi xóa." });
            }
            await _genreRepository.DeleteAsync(id);
        }
    }
}
