using LibraryManagement.API.Data;
using LibraryManagement.API.Models.DTOs;
using LibraryManagement.API.Models.Entity;
using LibraryManagement.API.Utils;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services
{
    public class SettingsService
    {
        private readonly LibraryDbContext _context;

        public SettingsService(LibraryDbContext context)
        {
            _context = context;
        }

        // Get all settings
        public async Task<List<SettingDto>> GetAllAsync()
        {
            var settings = await _context.Settings
                .OrderBy(s => s.Key)
                .ToListAsync();

            return settings.Select(s => new SettingDto
            {
                Id = s.Id,
                Key = s.Key,
                Value = s.Value,
                Description = s.Description,
                DataType = s.DataType,
                UpdatedAt = s.UpdatedAt
            }).ToList();
        }

        // Get setting by key
        public async Task<SettingDto> GetByKeyAsync(string key)
        {
            var setting = await _context.Settings
                .FirstOrDefaultAsync(s => s.Key == key);

            if (setting == null)
                throw new ApiException(404, $"Setting '{key}' not found");

            return new SettingDto
            {
                Id = setting.Id,
                Key = setting.Key,
                Value = setting.Value,
                Description = setting.Description,
                DataType = setting.DataType,
                UpdatedAt = setting.UpdatedAt
            };
        }

        // Update setting value
        public async Task<SettingDto> UpdateAsync(string key, UpdateSettingDto dto)
        {
            var setting = await _context.Settings
                .FirstOrDefaultAsync(s => s.Key == key);

            if (setting == null)
                throw new ApiException(404, $"Setting '{key}' not found");

            // Validate value based on DataType
            ValidateValue(setting.DataType, dto.Value);

            setting.Value = dto.Value;
            setting.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new SettingDto
            {
                Id = setting.Id,
                Key = setting.Key,
                Value = setting.Value,
                Description = setting.Description,
                DataType = setting.DataType,
                UpdatedAt = setting.UpdatedAt
            };
        }

        // Helper: Get setting value as int
        public async Task<int> GetIntValueAsync(string key, int defaultValue = 0)
        {
            try
            {
                var setting = await _context.Settings
                    .AsNoTracking() // Always get fresh data from DB
                    .FirstOrDefaultAsync(s => s.Key == key);

                if (setting != null && int.TryParse(setting.Value, out int result))
                    return result;

                return defaultValue;
            }
            catch
            {
                return defaultValue;
            }
        }

        // Helper: Get setting value as decimal
        public async Task<decimal> GetDecimalValueAsync(string key, decimal defaultValue = 0)
        {
            try
            {
                var setting = await _context.Settings
                    .AsNoTracking() // Always get fresh data from DB
                    .FirstOrDefaultAsync(s => s.Key == key);

                if (setting != null && decimal.TryParse(setting.Value, out decimal result))
                    return result;

                return defaultValue;
            }
            catch
            {
                return defaultValue;
            }
        }

        // Validate value based on data type
        private void ValidateValue(string dataType, string value)
        {
            switch (dataType.ToLower())
            {
                case "int":
                    if (!int.TryParse(value, out int intVal) || intVal < 0)
                        throw new ApiException(400, "Value must be a positive integer");
                    break;
                case "decimal":
                    if (!decimal.TryParse(value, out decimal decVal) || decVal < 0)
                        throw new ApiException(400, "Value must be a positive decimal number");
                    break;
                case "string":
                    if (string.IsNullOrWhiteSpace(value))
                        throw new ApiException(400, "Value cannot be empty");
                    break;
                default:
                    break;
            }
        }
    }
}
