using LibraryManagement.API.Services;
using LibraryManagement.API.Services.Interfaces;
using LibraryManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
    private readonly IBookService _bookService;
    private readonly FluentValidation.IValidator<Book> _bookValidator;

        public BooksController(IBookService bookService, FluentValidation.IValidator<Book> bookValidator)
        {
            _bookService = bookService;
            _bookValidator = bookValidator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks() => Ok(await _bookService.GetAllBooksAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            return book == null ? NotFound() : Ok(book);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook(Book book)
        {
            var validationResult = await _bookValidator.ValidateAsync(book);
            if (!validationResult.IsValid)
            {
                return BadRequest(new {
                    message = "Dữ liệu không hợp lệ",
                    errors = validationResult.Errors.Select(e => e.ErrorMessage).ToArray()
                });
            }
            await _bookService.AddBookAsync(book);
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Book book)
        {
            book.Id = id;
            var validationResult = await _bookValidator.ValidateAsync(book);
            if (!validationResult.IsValid)
            {
                return BadRequest(new {
                    message = "Dữ liệu không hợp lệ",
                    errors = validationResult.Errors.Select(e => e.ErrorMessage).ToArray()
                });
            }
            await _bookService.UpdateBookAsync(book);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            await _bookService.DeleteBookAsync(id);
            return NoContent();
        }

        // Endpoint tìm kiếm sách
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Book>>> SearchBooks([FromQuery] string? title, [FromQuery] string? author, [FromQuery] string? genre)
        {
            var books = await _bookService.SearchBooksAsync(title, author, genre);
            return Ok(books);
        }

        // Endpoint seed data mẫu
        [HttpPost("seed")]
        public async Task<IActionResult> SeedBooks()
        {
            var sampleBooks = new List<Book>
            {
                new Book { Title = "Database System Concepts", Author = "Abraham Silberschatz", Isbn = "9780073523323", Genre = "Computer Science", PublicationYear = 2010, Publisher = "McGraw-Hill" },
                new Book { Title = "Clean Code", Author = "Robert C. Martin", Isbn = "9780132350884", Genre = "Programming", PublicationYear = 2008, Publisher = "Prentice Hall" },
                new Book { Title = "The Pragmatic Programmer", Author = "Andrew Hunt", Isbn = "9780201616224", Genre = "Programming", PublicationYear = 1999, Publisher = "Addison-Wesley" }
            };

            foreach (var book in sampleBooks)
            {
                try
                {
                    await _bookService.AddBookAsync(book);
                }
                catch
                {
                    // Bỏ qua nếu đã tồn tại
                }
            }

            return Ok("Seed data thành công");
        }
    }
}