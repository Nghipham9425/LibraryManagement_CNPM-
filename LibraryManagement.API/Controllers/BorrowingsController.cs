using LibraryManagement.API.DTOs;
using LibraryManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowingsController : ControllerBase
    {
        private readonly IBorrowingService _service;

        public BorrowingsController(IBorrowingService service)
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
    }
}
