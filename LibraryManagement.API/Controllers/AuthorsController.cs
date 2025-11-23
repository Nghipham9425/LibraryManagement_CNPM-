using LibraryManagement.API.Services;
using LibraryManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentValidation;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorsController : ControllerBase
    {
        private readonly AuthorService _authorService;
        private readonly IValidator<Author> _authorValidator;
        private readonly ActivityLogService _activityLogService;

        public AuthorsController(AuthorService authorService, IValidator<Author> authorValidator, ActivityLogService activityLogService)
        {
            _authorService = authorService;
            _authorValidator = authorValidator;
            _activityLogService = activityLogService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuthorDto>>> GetAuthors() => Ok(await _authorService.GetAllAuthorsAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            var author = await _authorService.GetAuthorByIdAsync(id);
            return author == null ? NotFound() : Ok(author);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAuthor(Author author)
        {
            var validationResult = await _authorValidator.ValidateAsync(author);
            if (!validationResult.IsValid)
            {
                var errors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
                return BadRequest(new {
                    message = "Dữ liệu không hợp lệ",
                    errors = errors.ToArray()
                });
            }
            await _authorService.AddAuthorAsync(author);
            
            // Log activity
            await _activityLogService.LogAsync("Create", "Author", author.Id, $"Đã thêm tác giả '{author.Name}'");
            
            return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, author);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuthor(int id, Author author)
        {
            author.Id = id;
            var validationResult = await _authorValidator.ValidateAsync(author);
            if (!validationResult.IsValid)
            {
                var errors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
                return BadRequest(new {
                    message = "Dữ liệu không hợp lệ",
                    errors = errors.ToArray()
                });
            }
            await _authorService.UpdateAuthorAsync(author);
            
            // Log activity
            await _activityLogService.LogAsync("Update", "Author", author.Id, $"Đã cập nhật tác giả '{author.Name}'");
            
            return Ok(author);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            // Get author name before delete
            var author = await _authorService.GetAuthorByIdAsync(id);
            var authorName = author?.Name ?? "Unknown";
            
            await _authorService.DeleteAuthorAsync(id);
            
            // Log activity
            await _activityLogService.LogAsync("Delete", "Author", id, $"Đã xóa tác giả '{authorName}'");
            
            return NoContent();
        }
    }
}
