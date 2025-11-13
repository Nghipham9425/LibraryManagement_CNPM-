using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs;
using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services
{
    public class BorrowingService
    {
        private readonly BorrowingRepository _repo;
        private readonly LibraryDbContext _db;
        private readonly NotificationService _notificationService;

        public BorrowingService(BorrowingRepository repo, LibraryDbContext db, NotificationService notificationService)
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

            // Check if card has expired
            if (card.ExpiryDate < DateTime.UtcNow)
                throw new Utils.ApiException(400, "Thẻ thư viện đã hết hạn");

            // Validate book item availability
            var item = await _db.BookItems.FirstOrDefaultAsync(bi => bi.Id == request.BookItemId);
            if (item == null)
                throw new Utils.ApiException(404, "Bản sao sách không tồn tại");
            if (item.Status != BookItemStatus.Available)
                throw new Utils.ApiException(400, "Bản sao sách không sẵn sàng cho mượn");

            // Check if user is currently borrowing (chưa trả sách thì không mượn tiếp)
            var hasActiveBorrowings = await _db.Borrowings
                .AnyAsync(b => b.LibraryCardId == request.LibraryCardId && b.Status == BorrowingStatus.Borrowed);
            if (hasActiveBorrowings)
                throw new Utils.ApiException(400, "Bạn đang có sách chưa trả. Vui lòng trả sách trước khi mượn tiếp.");

            // Check maximum 3 books per borrow session (đếm số MÃ SÁCH khác nhau, không phải số BookItem)
            var currentBorrowedBookIds = await _db.Borrowings
                .Where(b => b.LibraryCardId == request.LibraryCardId && b.Status == BorrowingStatus.Borrowed)
                .Include(b => b.BookItem)
                .Select(b => b.BookItem.BookId)
                .Distinct()
                .CountAsync();
            
            if (currentBorrowedBookIds >= 3)
                throw new Utils.ApiException(400, "Bạn đã mượn tối đa 3 mã sách. Vui lòng trả sách trước khi mượn tiếp.");

            var days = request.Days ?? 15;
            if (days > 15)
                throw new Utils.ApiException(400, "Thời hạn mượn tối đa là 15 ngày");

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

        // Admin methods
        public async Task<List<BorrowingViewDto>> GetAllBorrowingsAsync(string? status, string? search)
        {
            var query = _db.Borrowings
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                        .ThenInclude(b => b.BookGenres)
                            .ThenInclude(bg => bg.Genre)
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                        .ThenInclude(b => b.BookAuthors)
                            .ThenInclude(ba => ba.Author)
                .Include(b => b.LibraryCard)
                .AsQueryable();

            // Filter by status
            if (!string.IsNullOrEmpty(status))
            {
                if (status.ToLower() == "active")
                {
                    // Chỉ lấy sách đang mượn và chưa quá hạn
                    query = query.Where(b => b.Status == BorrowingStatus.Borrowed && b.DueDate >= DateTime.UtcNow);
                }
                else if (status.ToLower() == "overdue")
                {
                    query = query.Where(b => b.Status == BorrowingStatus.Borrowed && b.DueDate < DateTime.UtcNow);
                }
                else if (status.ToLower() == "returned")
                {
                    query = query.Where(b => b.Status == BorrowingStatus.Returned);
                }
            }

            // Search by user name, book title, or control number
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b =>
                    (b.LibraryCard.StudentName != null && b.LibraryCard.StudentName.Contains(search)) ||
                    (b.BookItem.Book.Title != null && b.BookItem.Book.Title.Contains(search)) ||
                    (b.BookItem.ControlNumber != null && b.BookItem.ControlNumber.Contains(search))
                );
            }

            var borrowings = await query.OrderByDescending(b => b.BorrowDate).ToListAsync();
            return borrowings.Select(MapToViewDtoWithUser).ToList();
        }

        public async Task<object> GetBorrowingStatsAsync()
        {
            // Đang mượn (chưa quá hạn)
            var totalActive = await _db.Borrowings.CountAsync(b => b.Status == BorrowingStatus.Borrowed && b.DueDate >= DateTime.UtcNow);
            // Quá hạn
            var totalOverdue = await _db.Borrowings.CountAsync(b => b.Status == BorrowingStatus.Borrowed && b.DueDate < DateTime.UtcNow);
            // Đã trả
            var totalReturned = await _db.Borrowings.CountAsync(b => b.Status == BorrowingStatus.Returned);
            // Tổng số
            var totalBorrowings = await _db.Borrowings.CountAsync();

            return new
            {
                totalActive,
                totalOverdue,
                totalReturned,
                totalBorrowings
            };
        }

        public async Task<BorrowingViewDto?> GetByIdAsync(int id)
        {
            var borrowing = await _db.Borrowings
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                        .ThenInclude(b => b.BookGenres)
                            .ThenInclude(bg => bg.Genre)
                .Include(b => b.BookItem)
                    .ThenInclude(bi => bi.Book)
                        .ThenInclude(b => b.BookAuthors)
                            .ThenInclude(ba => ba.Author)
                .Include(b => b.LibraryCard)
                .FirstOrDefaultAsync(b => b.Id == id);

            return borrowing == null ? null : MapToViewDtoWithUser(borrowing);
        }

        public async Task<BorrowingViewDto> ExtendBorrowingAsync(int id, int additionalDays)
        {
            var borrowing = await _db.Borrowings.FindAsync(id) ??
                            throw new Utils.ApiException(404, "Phiếu mượn không tồn tại");

            if (borrowing.Status != BorrowingStatus.Borrowed)
                throw new Utils.ApiException(400, "Chỉ gia hạn khi đang mượn");

            borrowing.DueDate = borrowing.DueDate.AddDays(additionalDays);
            await _db.SaveChangesAsync();

            // Send notification
            var item = await _db.BookItems.Include(bi => bi.Book).FirstOrDefaultAsync(bi => bi.Id == borrowing.BookItemId);
            if (item?.Book != null)
            {
                await _notificationService.NotifyRenewSuccessAsync(borrowing.LibraryCardId, borrowing.Id, item.Book.Title, borrowing.DueDate);
            }

            return (await GetByIdAsync(id))!;
        }

        public async Task<BorrowingViewDto> ReturnByAdminAsync(int id)
        {
            var borrowing = await _db.Borrowings.FindAsync(id) ??
                            throw new Utils.ApiException(404, "Phiếu mượn không tồn tại");

            if (borrowing.Status != BorrowingStatus.Borrowed)
                throw new Utils.ApiException(400, "Phiếu mượn không ở trạng thái đang mượn");

            borrowing.Status = BorrowingStatus.Returned;
            borrowing.ReturnDate = DateTime.UtcNow;

            // Free book item
            var item = await _db.BookItems.Include(bi => bi.Book).FirstAsync(bi => bi.Id == borrowing.BookItemId);
            item.Status = BookItemStatus.Available;

            await _db.SaveChangesAsync();

            // Send notification
            if (item.Book != null)
            {
                await _notificationService.NotifyReturnSuccessAsync(borrowing.LibraryCardId, item.Book.Title);
            }

            return (await GetByIdAsync(id))!;
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
                        Genres = b.BookItem.Book.BookGenres?
                            .Select(bg => bg.Genre?.Name ?? "")
                            .Where(name => !string.IsNullOrEmpty(name))
                            .ToList() ?? new List<string>(),
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

        private BorrowingViewDto MapToViewDtoWithUser(Borrowing b)
        {
            var dto = MapToViewDto(b);
            // Add user information
            if (b.LibraryCard != null)
            {
                dto.UserName = b.LibraryCard.StudentName;
                dto.CardNumber = b.LibraryCard.CardNumber; // Thêm mã thẻ thư viện
                dto.LibraryCardStatus = (int)b.LibraryCard.Status;
            }
            return dto;
        }
    }
}