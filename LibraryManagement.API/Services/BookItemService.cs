using AutoMapper;
using LibraryManagement.API.Models;
using LibraryManagement.API.Models.DTOs;
using LibraryManagement.API.Repositories;
using LibraryManagement.API.Utils;

namespace LibraryManagement.API.Services
{
    public class BookItemService
    {
        private readonly BookItemRepository _bookItemRepository;
        private readonly BookRepository _bookRepository;
        private readonly IMapper _mapper;

        public BookItemService(BookItemRepository bookItemRepository, BookRepository bookRepository, IMapper mapper)
        {
            _bookItemRepository = bookItemRepository;
            _bookRepository = bookRepository;
            _mapper = mapper;
        }

        public async Task<List<BookItemDto>> GetAllByBookIdAsync(int bookId)
        {
            var bookItems = await _bookItemRepository.GetAllByBookIdAsync(bookId);
            return _mapper.Map<List<BookItemDto>>(bookItems);
        }

        public async Task<BookItemDto?> GetByIdAsync(int id)
        {
            var bookItem = await _bookItemRepository.GetByIdAsync(id);
            return bookItem == null ? null : _mapper.Map<BookItemDto>(bookItem);
        }

        public async Task<BookItemDto> CreateAsync(int bookId, CreateBookItemDto dto)
        {
            // Kiểm tra Book có tồn tại không
            var book = await _bookRepository.GetByIdAsync(bookId);
            if (book == null)
                throw new ApiException(404, "Không tìm thấy sách");

            // Tự động tạo ControlNumber nếu không có
            string controlNumber = dto.ControlNumber ?? await GenerateControlNumberAsync(bookId);

            // Kiểm tra ControlNumber đã tồn tại chưa
            if (await _bookItemRepository.ExistsAsync(bookId, controlNumber))
                throw new ApiException(400, $"Số kiểm soát '{controlNumber}' đã tồn tại cho sách này");

            var bookItem = new BookItem
            {
                BookId = bookId,
                ControlNumber = controlNumber,
                Status = BookItemStatus.Available,
                Notes = dto.Notes ?? string.Empty
            };

            var created = await _bookItemRepository.CreateAsync(bookItem);
            return _mapper.Map<BookItemDto>(created);
        }

        public async Task<BookItemDto> UpdateAsync(int id, UpdateBookItemDto dto)
        {
            var bookItem = await _bookItemRepository.GetByIdAsync(id);
            if (bookItem == null)
                throw new ApiException(404, "Không tìm thấy bản sao sách");

            bookItem.Status = (BookItemStatus)dto.Status;
            if (dto.Notes != null)
                bookItem.Notes = dto.Notes;

            var updated = await _bookItemRepository.UpdateAsync(bookItem);
            return _mapper.Map<BookItemDto>(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _bookItemRepository.DeleteAsync(id);
        }

        private async Task<string> GenerateControlNumberAsync(int bookId)
        {
            var existingItems = await _bookItemRepository.GetAllByBookIdAsync(bookId);
            var maxNumber = existingItems.Any()
                ? existingItems.Max(bi => int.TryParse(bi.ControlNumber, out var num) ? num : 0)
                : 0;
            return (maxNumber + 1).ToString("D3"); // 001, 002, 003...
        }
    }
}
