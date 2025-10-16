
using LibraryManagement.API.Services;
using LibraryManagement.API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly NotificationService _service;

        public NotificationsController(NotificationService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get paginated notifications for a library card
        /// </summary>
        [HttpGet("{libraryCardId:int}")]
        public async Task<IActionResult> GetNotifications(
            int libraryCardId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var notifications = await _service.GetNotificationsAsync(libraryCardId, page, pageSize);
            return Ok(notifications);
        }

        /// <summary>
        /// Get unread notification count
        /// </summary>
        [HttpGet("{libraryCardId:int}/unread-count")]
        public async Task<IActionResult> GetUnreadCount(int libraryCardId)
        {
            var count = await _service.GetUnreadCountAsync(libraryCardId);
            return Ok(new { count });
        }

        /// <summary>
        /// Mark a notification as read
        /// </summary>
        [HttpPost("{id:int}/mark-read")]
        public async Task<IActionResult> MarkAsRead(int id, [FromQuery] int libraryCardId)
        {
            var success = await _service.MarkAsReadAsync(id, libraryCardId);
            if (!success) return NotFound("Notification not found");
            return Ok(new { message = "Đã đánh dấu đọc" });
        }

        /// <summary>
        /// Mark all notifications as read for a library card
        /// </summary>
        [HttpPost("{libraryCardId:int}/mark-all-read")]
        public async Task<IActionResult> MarkAllAsRead(int libraryCardId)
        {
            await _service.MarkAllAsReadAsync(libraryCardId);
            return Ok(new { message = "Đã đánh dấu tất cả là đã đọc" });
        }

        /// <summary>
        /// Create a custom notification (admin use)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDto dto)
        {
            await _service.CreateNotificationAsync(dto);
            return Ok(new { message = "Đã tạo thông báo" });
        }
    }
}
