using LibraryManagement.API.Models;
using LibraryManagement.API.DTOs;

namespace LibraryManagement.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetNotificationsAsync(int libraryCardId, int page = 1, int pageSize = 20);
        Task<int> GetUnreadCountAsync(int libraryCardId);
        Task<bool> MarkAsReadAsync(int notificationId, int libraryCardId);
        Task<bool> MarkAllAsReadAsync(int libraryCardId);
        Task CreateNotificationAsync(CreateNotificationDto dto);
        
        // Auto-create notifications for borrowing events
        Task NotifyBorrowSuccessAsync(int libraryCardId, int borrowingId, string bookTitle);
        Task NotifyReturnSuccessAsync(int libraryCardId, string bookTitle);
        Task NotifyRenewSuccessAsync(int libraryCardId, int borrowingId, string bookTitle, DateTime newDueDate);
        Task NotifyDueSoonAsync(int libraryCardId, int borrowingId, string bookTitle, DateTime dueDate);
        Task NotifyOverdueAsync(int libraryCardId, int borrowingId, string bookTitle, DateTime dueDate);
    }
}
