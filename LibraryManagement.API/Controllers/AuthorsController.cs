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

        public AuthorsController(AuthorService authorService, IValidator<Author> authorValidator)
        {
            _authorService = authorService;
            _authorValidator = authorValidator;
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
            return Ok(author);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            await _authorService.DeleteAuthorAsync(id);
            return NoContent();
        }
    }
}
