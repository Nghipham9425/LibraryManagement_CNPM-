using LibraryManagement.API.Models.DTOs;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/books/{bookId}/items")]
    public class BookItemsController : ControllerBase
    {
        private readonly BookItemService _bookItemService;

        public BookItemsController(BookItemService bookItemService)
        {
            _bookItemService = bookItemService;
        }

        // GET: api/books/1/items - Lấy tất cả bản sao của một sách
        [HttpGet]
        public async Task<ActionResult<List<BookItemDto>>> GetBookItems(int bookId)
        {
            var bookItems = await _bookItemService.GetAllByBookIdAsync(bookId);
            return Ok(bookItems);
        }

        // GET: api/books/1/items/5 - Lấy một bản sao cụ thể
        [HttpGet("{id}")]
        public async Task<ActionResult<BookItemDto>> GetBookItem(int bookId, int id)
        {
            var bookItem = await _bookItemService.GetByIdAsync(id);
            if (bookItem == null)
                return NotFound(new { message = "Không tìm thấy bản sao sách" });

            if (bookItem.BookId != bookId)
                return BadRequest(new { message = "Bản sao không thuộc sách này" });

            return Ok(bookItem);
        }

        // POST: api/books/1/items - Thêm bản sao mới
        [HttpPost]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<ActionResult<BookItemDto>> CreateBookItem(int bookId, [FromBody] CreateBookItemDto dto)
        {
            try
            {
                var bookItem = await _bookItemService.CreateAsync(bookId, dto);
                return CreatedAtAction(nameof(GetBookItem), new { bookId, id = bookItem.Id }, bookItem);
            }
            catch (Utils.ApiException ex)
            {
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
        }

        // PUT: api/books/1/items/5 - Cập nhật trạng thái bản sao
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<ActionResult<BookItemDto>> UpdateBookItem(int bookId, int id, [FromBody] UpdateBookItemDto dto)
        {
            try
            {
                var bookItem = await _bookItemService.UpdateAsync(id, dto);
                return Ok(bookItem);
            }
            catch (Utils.ApiException ex)
            {
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
        }

        // DELETE: api/books/1/items/5 - Xóa bản sao
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBookItem(int bookId, int id)
        {
            var result = await _bookItemService.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Không tìm thấy bản sao sách" });

            return NoContent();
        }
    }
}
