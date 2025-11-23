using LibraryManagement.API.Data;
using LibraryManagement.API.Models;
using LibraryManagement.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services
{
    public class NotificationService
    {
        private readonly LibraryDbContext _db;

        public NotificationService(LibraryDbContext db)
        {
            _db = db;
        }

        public async Task<List<NotificationDto>> GetNotificationsAsync(int libraryCardId, int page = 1, int pageSize = 20)
        {
            var notifications = await _db.Notifications
                .Where(n => n.LibraryCardId == libraryCardId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(n => n.Borrowing!)
                    .ThenInclude(b => b.BookItem!)
                    .ThenInclude(bi => bi.Book!)
                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type.ToString(),
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                BorrowingId = n.BorrowingId,
                BookTitle = n.Borrowing?.BookItem?.Book?.Title,
                BookImageUrl = n.Borrowing?.BookItem?.Book?.ImageUrl
            }).ToList();
        }

        public async Task<int> GetUnreadCountAsync(int libraryCardId)
        {
            return await _db.Notifications
                .Where(n => n.LibraryCardId == libraryCardId && !n.IsRead)
                .CountAsync();
        }

        public async Task<bool> MarkAsReadAsync(int notificationId, int libraryCardId)
        {
            var notification = await _db.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.LibraryCardId == libraryCardId);
            
            if (notification == null) return false;

            notification.IsRead = true;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAllAsReadAsync(int libraryCardId)
        {
            var notifications = await _db.Notifications
                .Where(n => n.LibraryCardId == libraryCardId && !n.IsRead)
                .ToListAsync();

            foreach (var n in notifications)
            {
                n.IsRead = true;
            }

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task CreateNotificationAsync(CreateNotificationDto dto)
        {
            var notification = new Notification
            {
                LibraryCardId = dto.LibraryCardId,
                Title = dto.Title,
                Message = dto.Message,
                Type = Enum.TryParse<NotificationType>(dto.Type, out var type) ? type : NotificationType.General,
                BorrowingId = dto.BorrowingId,
                CreatedAt = DateTime.UtcNow
            };

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }

        public async Task NotifyBorrowSuccessAsync(int libraryCardId, int borrowingId, string bookTitle)
        {
            await CreateNotificationAsync(new CreateNotificationDto
            {
                LibraryCardId = libraryCardId,
                Title = "Mượn sách thành công! 🎉",
                Message = $"Bạn đã mượn sách \"{bookTitle}\" thành công. Hãy nhớ trả đúng hạn nhé!",
                Type = "BorrowSuccess",
                BorrowingId = borrowingId
            });
        }

        public async Task NotifyReturnSuccessAsync(int libraryCardId, int borrowingId, string bookTitle)
        {
            await CreateNotificationAsync(new CreateNotificationDto
            {
                LibraryCardId = libraryCardId,
                Title = "Trả sách thành công! ✅",
                Message = $"Bạn đã trả sách \"{bookTitle}\" thành công. Cảm ơn bạn đã sử dụng dịch vụ!",
                Type = "ReturnSuccess",
                BorrowingId = borrowingId
            });
        }

        public async Task NotifyRenewSuccessAsync(int libraryCardId, int borrowingId, string bookTitle, DateTime newDueDate)
        {
            await CreateNotificationAsync(new CreateNotificationDto
            {
                LibraryCardId = libraryCardId,
                Title = "Gia hạn thành công! 📅",
                Message = $"Sách \"{bookTitle}\" đã được gia hạn đến {newDueDate:dd/MM/yyyy}.",
                Type = "RenewSuccess",
                BorrowingId = borrowingId
            });
        }

        public async Task NotifyDueSoonAsync(int libraryCardId, int borrowingId, string bookTitle, DateTime dueDate)
        {
            await CreateNotificationAsync(new CreateNotificationDto
            {
                LibraryCardId = libraryCardId,
                Title = "Sách sắp đến hạn! ⏰",
                Message = $"Sách \"{bookTitle}\" sẽ đến hạn trả vào {dueDate:dd/MM/yyyy}. Vui lòng chuẩn bị trả sách hoặc gia hạn.",
                Type = "DueSoon",
                BorrowingId = borrowingId
            });
        }

        public async Task NotifyOverdueAsync(int libraryCardId, int borrowingId, string bookTitle, DateTime dueDate)
        {
            await CreateNotificationAsync(new CreateNotificationDto
            {
                LibraryCardId = libraryCardId,
                Title = "Sách quá hạn! ⚠️",
                Message = $"Sách \"{bookTitle}\" đã quá hạn từ {dueDate:dd/MM/yyyy}. Vui lòng trả sách ngay!",
                Type = "Overdue",
                BorrowingId = borrowingId
            });
        }
    }
}