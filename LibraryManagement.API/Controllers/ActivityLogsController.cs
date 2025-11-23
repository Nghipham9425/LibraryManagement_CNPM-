using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Only Admin can view activity logs
    public class ActivityLogsController : ControllerBase
    {
        private readonly ActivityLogService _activityLogService;

        public ActivityLogsController(ActivityLogService activityLogService)
        {
            _activityLogService = activityLogService;
        }

        // GET: api/ActivityLogs
        [HttpGet]
        public async Task<ActionResult<object>> GetLogs(
            [FromQuery] string? action = null,
            [FromQuery] string? entity = null,
            [FromQuery] int? userId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            var result = await _activityLogService.GetLogsAsync(
                action, entity, userId, fromDate, toDate, page, pageSize);
            return Ok(result);
        }

        // GET: api/ActivityLogs/recent
        [HttpGet("recent")]
        public async Task<ActionResult> GetRecent([FromQuery] int count = 10)
        {
            var logs = await _activityLogService.GetRecentAsync(count);
            return Ok(logs);
        }

        // GET: api/ActivityLogs/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetByUser(int userId, [FromQuery] int limit = 50)
        {
            var logs = await _activityLogService.GetByUserAsync(userId, limit);
            return Ok(logs);
        }

        // GET: api/ActivityLogs/stats
        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            var stats = await _activityLogService.GetStatsAsync();
            return Ok(stats);
        }
    }
}
