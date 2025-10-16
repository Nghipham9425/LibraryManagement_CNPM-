using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs;
using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services
{
    public class BorrowingService : IBorrowingService
    {
        private readonly IBorrowingRepository _repo;
        private readonly LibraryDbContext _db;
        private readonly INotificationService _notificationService;

        public BorrowingService(IBorrowingRepository repo, LibraryDbContext db, INotificationService notificationService)
        {
            _repo = repo;
            _db = db;
            _notificationService = notificationService;
        }

        public async Task<Borrowing> BorrowAsync(BorrowRequestDto request)
        {
            // Validate library card
            var card = await _db.LibraryCards.FirstOrDefaultAsync(c => c.Id == request.LibraryCardId && c.Status == CardStatus.Active);
            if (card == null)
                throw new Utils.ApiException(400, "Thẻ thư viện không hợp lệ hoặc không hoạt động");

            // Validate book item availability
            var item = await _db.BookItems.FirstOrDefaultAsync(bi => bi.Id == request.BookItemId);
            if (item == null)
                throw new Utils.ApiException(404, "Bản sao sách không tồn tại");
            if (item.Status != BookItemStatus.Available)
                throw new Utils.ApiException(400, "Bản sao sách không sẵn sàng cho mượn");

            var days = request.Days ?? 15;
            var now = DateTime.UtcNow;
            var borrow = new Borrowing
            {
                LibraryCardId = request.LibraryCardId,
                BookItemId = request.BookItemId,
                BorrowDate = now,
                DueDate = now.AddDays(days),
                Status = BorrowingStatus.Borrowed
            };

            // Mark item as borrowed
            item.Status = BookItemStatus.Borrowed;
            await _repo.AddAsync(borrow);
            await _repo.SaveChangesAsync();
            
            // Send notification
            var book = await _db.Books.FindAsync(item.BookId);
            if (book != null)
            {
                await _notificationService.NotifyBorrowSuccessAsync(request.LibraryCardId, borrow.Id, book.Title);
            }
            
            return borrow;
        }

        public async Task<Borrowing> ReturnAsync(ReturnRequestDto request)
        {
            var borrowing = await _repo.GetByIdAsync(request.BorrowingId) ??
                            throw new Utils.ApiException(404, "Phiếu mượn không tồn tại");

            if (borrowing.Status != BorrowingStatus.Borrowed)
                throw new Utils.ApiException(400, "Phiếu mượn không ở trạng thái đang mượn");

            borrowing.Status = BorrowingStatus.Returned;
            borrowing.ReturnDate = DateTime.UtcNow;

            // Free book item
            var item = await _db.BookItems.Include(bi => bi.Book).FirstAsync(bi => bi.Id == borrowing.BookItemId);
            item.Status = BookItemStatus.Available;

            await _repo.SaveChangesAsync();
            
            // Send notification
            if (item.Book != null)
            {
                await _notificationService.NotifyReturnSuccessAsync(borrowing.LibraryCardId, item.Book.Title);
            }
            
            return borrowing;
        }

        public async Task<Borrowing> RenewAsync(RenewRequestDto request)
        {
            var borrowing = await _repo.GetByIdAsync(request.BorrowingId) ??
                            throw new Utils.ApiException(404, "Phiếu mượn không tồn tại");

            if (borrowing.Status != BorrowingStatus.Borrowed)
                throw new Utils.ApiException(400, "Chỉ gia hạn khi đang mượn");

            borrowing.DueDate = borrowing.DueDate.AddDays(request.ExtendDays);
            await _repo.SaveChangesAsync();
            
            // Send notification
            var item = await _db.BookItems.Include(bi => bi.Book).FirstOrDefaultAsync(bi => bi.Id == borrowing.BookItemId);
            if (item?.Book != null)
            {
                await _notificationService.NotifyRenewSuccessAsync(borrowing.LibraryCardId, borrowing.Id, item.Book.Title, borrowing.DueDate);
            }
            
            return borrowing;
        }

        public async Task<List<BorrowingViewDto>> GetActiveAsync(int libraryCardId)
        {
            var borrowings = await _repo.GetActiveByCardAsync(libraryCardId);
            return borrowings.Select(MapToViewDto).ToList();
        }

        public async Task<List<BorrowingViewDto>> GetHistoryAsync(int libraryCardId)
        {
            var borrowings = await _repo.GetHistoryByCardAsync(libraryCardId);
            return borrowings.Select(MapToViewDto).ToList();
        }

        public async Task<List<BorrowingViewDto>> GetOverdueAsync(int libraryCardId)
        {
            var borrowings = await _repo.GetOverdueByCardAsync(libraryCardId, DateTime.UtcNow);
            return borrowings.Select(MapToViewDto).ToList();
        }

        private BorrowingViewDto MapToViewDto(Borrowing b)
        {
            return new BorrowingViewDto
            {
                Id = b.Id,
                LibraryCardId = b.LibraryCardId,
                BookItemId = b.BookItemId,
                BorrowDate = b.BorrowDate,
                DueDate = b.DueDate,
                ReturnDate = b.ReturnDate,
                Status = (int)b.Status,
                BookItem = b.BookItem == null ? null : new BookItemViewDto
                {
                    Id = b.BookItem.Id,
                    BookId = b.BookItem.BookId,
                    ControlNumber = b.BookItem.ControlNumber,
                    Status = (int)b.BookItem.Status,
                    Book = b.BookItem.Book == null ? null : new BookBasicDto
                    {
                        Id = b.BookItem.Book.Id,
                        Title = b.BookItem.Book.Title,
                        ImageUrl = b.BookItem.Book.ImageUrl,
                        Genre = b.BookItem.Book.Genre,
                        PublicationYear = b.BookItem.Book.PublicationYear,
                        Publisher = b.BookItem.Book.Publisher,
                        Authors = b.BookItem.Book.BookAuthors?
                            .Select(ba => ba.Author?.Name ?? "")
                            .Where(name => !string.IsNullOrEmpty(name))
                            .ToList() ?? new List<string>()
                    }
                }
            };
        }
    }
}
