using LibraryManagement.API.Data;
using LibraryManagement.API.Models.DTOs;
using LibraryManagement.API.Models.Entity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LibraryManagement.API.Services
{
    public class ActivityLogService
    {
        private readonly LibraryDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ActivityLogService(LibraryDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        // Log activity
        public async Task LogAsync(string action, string entity, int? entityId, string description)
        {
            try
            {
                var user = _httpContextAccessor.HttpContext?.User;
                int? userId = null;
                string userName = "System";

                if (user?.Identity?.IsAuthenticated == true)
                {
                    var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (int.TryParse(userIdClaim, out int parsedUserId))
                    {
                        userId = parsedUserId;
                    }
                    userName = user.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";
                }

                var log = new ActivityLog
                {
                    UserId = userId,
                    UserName = userName,
                    Action = action,
                    Entity = entity,
                    EntityId = entityId,
                    Description = description,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ActivityLogs.Add(log);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log error but don't throw - don't break main flow
                Console.WriteLine($"Activity log error: {ex.Message}");
            }
        }

        // Get logs with filters
        public async Task<object> GetLogsAsync(
            string? action = null,
            string? entity = null,
            int? userId = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            int page = 1,
            int pageSize = 50)
        {
            var query = _context.ActivityLogs
                .Include(log => log.User)
                .AsQueryable();

            // Filters
            if (!string.IsNullOrEmpty(action))
                query = query.Where(log => log.Action == action);

            if (!string.IsNullOrEmpty(entity))
                query = query.Where(log => log.Entity == entity);

            if (userId.HasValue)
                query = query.Where(log => log.UserId == userId);

            if (fromDate.HasValue)
                query = query.Where(log => log.CreatedAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(log => log.CreatedAt <= toDate.Value);

            // Get total count
            var totalCount = await query.CountAsync();

            // Pagination
            var logs = await query
                .OrderByDescending(log => log.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(log => new ActivityLogDto
                {
                    Id = log.Id,
                    UserId = log.UserId,
                    UserName = log.UserName,
                    Action = log.Action,
                    Entity = log.Entity,
                    EntityId = log.EntityId,
                    Description = log.Description,
                    CreatedAt = log.CreatedAt
                })
                .ToListAsync();

            return new
            {
                logs,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        // Get recent activities (for dashboard)
        public async Task<List<ActivityLogDto>> GetRecentAsync(int count = 10)
        {
            return await _context.ActivityLogs
                .OrderByDescending(log => log.CreatedAt)
                .Take(count)
                .Select(log => new ActivityLogDto
                {
                    Id = log.Id,
                    UserId = log.UserId,
                    UserName = log.UserName,
                    Action = log.Action,
                    Entity = log.Entity,
                    EntityId = log.EntityId,
                    Description = log.Description,
                    CreatedAt = log.CreatedAt
                })
                .ToListAsync();
        }

        // Get user's activity history
        public async Task<List<ActivityLogDto>> GetByUserAsync(int userId, int limit = 50)
        {
            return await _context.ActivityLogs
                .Where(log => log.UserId == userId)
                .OrderByDescending(log => log.CreatedAt)
                .Take(limit)
                .Select(log => new ActivityLogDto
                {
                    Id = log.Id,
                    UserId = log.UserId,
                    UserName = log.UserName,
                    Action = log.Action,
                    Entity = log.Entity,
                    EntityId = log.EntityId,
                    Description = log.Description,
                    CreatedAt = log.CreatedAt
                })
                .ToListAsync();
        }

        // Get statistics
        public async Task<object> GetStatsAsync()
        {
            var today = DateTime.UtcNow.Date;
            var thisWeek = DateTime.UtcNow.AddDays(-7);

            return new
            {
                todayCount = await _context.ActivityLogs.CountAsync(log => log.CreatedAt >= today),
                weekCount = await _context.ActivityLogs.CountAsync(log => log.CreatedAt >= thisWeek),
                totalCount = await _context.ActivityLogs.CountAsync(),
                topUsers = await _context.ActivityLogs
                    .GroupBy(log => new { log.UserId, log.UserName })
                    .Select(g => new
                    {
                        userId = g.Key.UserId,
                        userName = g.Key.UserName,
                        count = g.Count()
                    })
                    .OrderByDescending(x => x.count)
                    .Take(5)
                    .ToListAsync()
            };
        }
    }
}
