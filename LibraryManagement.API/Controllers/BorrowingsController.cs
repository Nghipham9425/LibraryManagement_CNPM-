using LibraryManagement.API.DTOs;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowingsController : ControllerBase
    {
        private readonly BorrowingService _service;

        public BorrowingsController(BorrowingService service)
        {
            _service = service;
        }

        [HttpPost("borrow")]
        public async Task<IActionResult> Borrow([FromBody] BorrowRequestDto request)
        {
            var result = await _service.BorrowAsync(request);
            return Ok(result);
        }

        [HttpPost("return")]
        public async Task<IActionResult> Return([FromBody] ReturnRequestDto request)
        {
            var result = await _service.ReturnAsync(request);
            return Ok(result);
        }

        [HttpPost("renew")]
        public async Task<IActionResult> Renew([FromBody] RenewRequestDto request)
        {
            var result = await _service.RenewAsync(request);
            return Ok(result);
        }

        [HttpGet("active/{libraryCardId:int}")]
        public async Task<IActionResult> GetActive(int libraryCardId)
        {
            var list = await _service.GetActiveAsync(libraryCardId);
            return Ok(list);
        }

        [HttpGet("history/{libraryCardId:int}")]
        public async Task<IActionResult> GetHistory(int libraryCardId)
        {
            var list = await _service.GetHistoryAsync(libraryCardId);
            return Ok(list);
        }

        [HttpGet("overdue/{libraryCardId:int}")]
        public async Task<IActionResult> GetOverdue(int libraryCardId)
        {
            var list = await _service.GetOverdueAsync(libraryCardId);
            return Ok(list);
        }

        // Admin endpoints
        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] string? status = null, [FromQuery] string? search = null)
        {
            var list = await _service.GetAllBorrowingsAsync(status, search);
            return Ok(list);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _service.GetBorrowingStatsAsync();
            return Ok(stats);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var borrowing = await _service.GetByIdAsync(id);
            if (borrowing == null) return NotFound();
            return Ok(borrowing);
        }

        [HttpPost("{id:int}/extend")]
        public async Task<IActionResult> ExtendBorrowing(int id, [FromBody] int additionalDays)
        {
            var result = await _service.ExtendBorrowingAsync(id, additionalDays);
            return Ok(result);
        }

        [HttpPost("{id:int}/return-admin")]
        public async Task<IActionResult> ReturnByAdmin(int id)
        {
            var result = await _service.ReturnByAdminAsync(id);
            return Ok(result);
        }
    }
}