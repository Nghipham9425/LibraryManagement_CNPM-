using Microsoft.AspNetCore.Mvc;
using LibraryManagement.API.Services;
using LibraryManagement.API.Validators;
using FluentValidation;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController : ControllerBase
    {
        private readonly GenreService _genreService;
        private readonly IValidator<Genre> _genreValidator;

        public GenresController(GenreService genreService, IValidator<Genre> genreValidator)
        {
            _genreService = genreService;
            _genreValidator = genreValidator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GenreDto>>> GetGenres() => Ok(await _genreService.GetAllGenresAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Genre>> GetGenre(int id)
        {
            var genre = await _genreService.GetGenreByIdAsync(id);
            return genre == null ? NotFound() : Ok(genre);
        }

        [HttpPost]
        public async Task<IActionResult> CreateGenre(Genre genre)
        {
            var validationResult = await _genreValidator.ValidateAsync(genre);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = validationResult.Errors.Select(e => e.ErrorMessage) });
            }
            await _genreService.AddGenreAsync(genre);
            return CreatedAtAction(nameof(GetGenre), new { id = genre.Id }, genre);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGenre(int id, Genre genre)
        {
            genre.Id = id;
            var validationResult = await _genreValidator.ValidateAsync(genre);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = validationResult.Errors.Select(e => e.ErrorMessage) });
            }
            await _genreService.UpdateGenreAsync(genre);
            return Ok(genre);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            await _genreService.DeleteGenreAsync(id);
            return NoContent();
        }
    }
}