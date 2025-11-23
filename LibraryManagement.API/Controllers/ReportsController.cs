using LibraryManagement.API.Models.DTOs;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Librarian")]
    public class ReportsController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportsController(ReportService reportService)
        {
            _reportService = reportService;
        }

        /// <summary>
        /// Lấy báo cáo sách mất/hỏng theo năm
        /// </summary>
        /// <param name="year">Năm báo cáo (mặc định là năm hiện tại)</param>
        /// <returns>Danh sách sách bị mất/hỏng</returns>
        [HttpGet("damaged-books")]
        public async Task<ActionResult<List<DamagedBookReportDto>>> GetDamagedBooks([FromQuery] int? year)
        {
            var report = await _reportService.GetDamagedBooksReportAsync(year);
            return Ok(report);
        }
    }
}
