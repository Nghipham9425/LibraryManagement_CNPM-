using LibraryManagement.API.Services;
using LibraryManagement.API.Models;
using LibraryManagement.API.Data;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookService _bookService;
        private readonly FluentValidation.IValidator<Book> _bookValidator;
        private readonly IMapper _mapper;

        public BooksController(BookService bookService, FluentValidation.IValidator<Book> bookValidator, IMapper mapper)
        {
            _bookService = bookService;
            _bookValidator = bookValidator;
            _mapper = mapper;
        }        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks() => Ok(await _bookService.GetAllBooksAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            return book == null ? NotFound() : Ok(book);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] BookInputDto bookInput)
        {
            var book = _mapper.Map<Book>(bookInput);

            var validationResult = await _bookValidator.ValidateAsync(book);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors });
            }

            await _bookService.AddBookAsync(book);
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookInputDto bookInput)
        {
            var book = _mapper.Map<Book>(bookInput);
            book.Id = id;

            var validationResult = await _bookValidator.ValidateAsync(book);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors });
            }

            await _bookService.UpdateBookAsync(book);
            return Ok(book);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            await _bookService.DeleteBookAsync(id);
            return NoContent();
        }

        // Endpoint tìm kiếm sách
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<BookDto>>> SearchBooks([FromQuery] string? title, [FromQuery] string? author, [FromQuery] string? genre)
        {
            var books = await _bookService.SearchBooksAsync(title, author, genre);
            var bookDtos = _mapper.Map<IEnumerable<BookDto>>(books);
            return Ok(bookDtos);
        }
    }
}