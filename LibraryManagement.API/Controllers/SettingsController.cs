using LibraryManagement.API.Models.DTOs;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication
    public class SettingsController : ControllerBase
    {
        private readonly SettingsService _settingsService;
        private readonly ActivityLogService _activityLogService;

        public SettingsController(SettingsService settingsService, ActivityLogService activityLogService)
        {
            _settingsService = settingsService;
            _activityLogService = activityLogService;
        }

        // GET: api/Settings
        [HttpGet]
        [Authorize(Roles = "Admin,Librarian")] // Both can view settings
        public async Task<ActionResult<List<SettingDto>>> GetAll()
        {
            var settings = await _settingsService.GetAllAsync();
            return Ok(settings);
        }

        // GET: api/Settings/{key}
        [HttpGet("{key}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<ActionResult<SettingDto>> GetByKey(string key)
        {
            var setting = await _settingsService.GetByKeyAsync(key);
            return Ok(setting);
        }

        // PUT: api/Settings/{key}
        [HttpPut("{key}")]
        [Authorize(Roles = "Admin")] // Only Admin can update
        public async Task<ActionResult<SettingDto>> Update(string key, [FromBody] UpdateSettingDto dto)
        {
            // Get old value before update for logging
            var oldSetting = await _settingsService.GetByKeyAsync(key);
            var oldValue = oldSetting.Value;
            
            var updated = await _settingsService.UpdateAsync(key, dto);
            
            // Log activity
            await _activityLogService.LogAsync("Update", "Setting", null, $"Đã thay đổi cài đặt '{key}' từ '{oldValue}' thành '{dto.Value}'");
            
            return Ok(updated);
        }
    }
}
