using LibraryManagement.API.Repositories;
using LibraryManagement.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using LibraryManagement.API.Utils;

namespace LibraryManagement.API.Services
{
    public class AuthorService
    {
        private readonly AuthorRepository _authorRepository;

        public AuthorService(AuthorRepository authorRepository)
        {
            _authorRepository = authorRepository;
        }

        public async Task<IEnumerable<AuthorDto>> GetAllAuthorsAsync()
        {
            var authors = await _authorRepository.GetAllWithBookCountAsync();
            return authors.Select(a => new AuthorDto
            {
                Id = a.Id,
                Name = a.Name,
                BookCount = a.BookAuthors?.Count ?? 0
            });
        }

        public async Task<Author?> GetAuthorByIdAsync(int id) => await _authorRepository.GetByIdAsync(id);

        public async Task AddAuthorAsync(Author author)
        {
            // Kiểm tra tên tác giả không trùng
            var existingAuthors = await _authorRepository.GetAllAsync();
            if (existingAuthors.Any(a => a.Name.ToLower() == author.Name.ToLower()))
            {
                throw new ApiException(400, "Tên tác giả đã tồn tại", new[] { "Tên tác giả này đã có trong hệ thống" });
            }
            await _authorRepository.AddAsync(author);
        }

        public async Task UpdateAuthorAsync(Author author)
        {
            // // Kiểm tra tên tác giả không trùng (trừ chính nó)
            // var existingAuthors = await _authorRepository.GetAllAsync();
            // if (existingAuthors.Any(a => a.Id != author.Id && a.Name.ToLower() == author.Name.ToLower()))
            // {
            //     throw new LibraryManagement.API.Utils.ApiException(400, "Tên tác giả đã tồn tại", new[] { "Tên tác giả này đã có trong hệ thống" });
            // }
            await _authorRepository.UpdateAsync(author);
        }

        public async Task DeleteAuthorAsync(int id)
        {
            var author = await _authorRepository.GetByIdWithBooksAsync(id);
            if (author == null)
            {
                throw new ApiException(404, "Tác giả không tồn tại");
            }
            if (author.BookAuthors.Any())
            {
                throw new ApiException(400, "Không thể xóa tác giả đã có sách liên kết", new[] { "Tác giả này đã được gắn với một hoặc nhiều sách. Vui lòng gỡ bỏ liên kết trước khi xóa." });
            }
            await _authorRepository.DeleteAsync(id);
        }
    }
}
