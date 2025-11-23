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
        private readonly ActivityLogService _activityLogService;

        public BorrowingsController(BorrowingService service, ActivityLogService activityLogService)
        {
            _service = service;
            _activityLogService = activityLogService;
        }

        [HttpPost("borrow")]
        public async Task<IActionResult> Borrow([FromBody] BorrowRequestDto request)
        {
            var result = await _service.BorrowAsync(request);
            
            // Log activity - load book info manually if not included
            var borrowing = await _service.GetByIdAsync(result.Id);
            var bookTitle = borrowing?.BookItem?.Book?.Title ?? "Unknown";
            await _activityLogService.LogAsync("Create", "Borrowing", result.Id, $"Đã mượn sách '{bookTitle}' - Phiếu mượn #{result.Id}");
            
            return Ok(result);
        }

        [HttpPost("return")]
        public async Task<IActionResult> Return([FromBody] ReturnRequestDto request)
        {
            var result = await _service.ReturnAsync(request);
            
            // Log activity - load book info manually if not included
            var borrowing = await _service.GetByIdAsync(result.Id);
            var bookTitle = borrowing?.BookItem?.Book?.Title ?? "Unknown";
            await _activityLogService.LogAsync("Update", "Borrowing", result.Id, $"Đã trả sách '{bookTitle}' - Phiếu mượn #{result.Id}");
            
            return Ok(result);
        }

        [HttpPost("renew")]
        public async Task<IActionResult> Renew([FromBody] RenewRequestDto request)
        {
            var result = await _service.RenewAsync(request);
            // Không log Renew - ít quan trọng
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
        public async Task<IActionResult> ExtendBorrowing(int id, [FromBody] ExtendBorrowingDto dto)
        {
            var result = await _service.ExtendBorrowingAsync(id, dto.AdditionalDays);
            return Ok(result);
        }

        [HttpPost("{id:int}/return-admin")]
        public async Task<IActionResult> ReturnByAdmin(int id)
        {
            var result = await _service.ReturnByAdminAsync(id);
            return Ok(result);
        }

        [HttpPost("{id:int}/report-lost")]
        public async Task<IActionResult> ReportLost(int id)
        {
            var result = await _service.ReportLostAsync(id);
            
            // Log activity - load book info manually if not included
            var borrowing = await _service.GetByIdAsync(result.Id);
            var bookTitle = borrowing?.BookItem?.Book?.Title ?? "Unknown";
            await _activityLogService.LogAsync("Update", "Borrowing", result.Id, $"Đã báo mất sách '{bookTitle}' - Phiếu mượn #{result.Id}");
            
            return Ok(result);
        }

        [HttpPost("{id:int}/report-damaged")]
        public async Task<IActionResult> ReportDamaged(int id)
        {
            var result = await _service.ReportDamagedAsync(id);
            
            // Log activity - load book info manually if not included
            var borrowing = await _service.GetByIdAsync(result.Id);
            var bookTitle = borrowing?.BookItem?.Book?.Title ?? "Unknown";
            await _activityLogService.LogAsync("Update", "Borrowing", result.Id, $"Đã báo hỏng sách '{bookTitle}' - Phiếu mượn #{result.Id}");
            
            return Ok(result);
        }
    }
}