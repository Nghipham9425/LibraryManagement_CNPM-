using AutoMapper;
using LibraryManagement.API.Models;
using LibraryManagement.API.Models.DTOs;
using LibraryManagement.API.Repositories;
using LibraryManagement.API.Utils;

namespace LibraryManagement.API.Services;

public class LibraryCardService
{
    private readonly LibraryCardRepository _libraryCardRepository;
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;

    public LibraryCardService(
        LibraryCardRepository libraryCardRepository,
        UserRepository userRepository,
        IMapper mapper)
    {
        _libraryCardRepository = libraryCardRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LibraryCardDto>> GetAllLibraryCardsAsync()
    {
        var cards = await _libraryCardRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<LibraryCardDto>>(cards);
    }

    public async Task<LibraryCardDto?> GetLibraryCardByIdAsync(int id)
    {
        var card = await _libraryCardRepository.GetByIdAsync(id);
        return card == null ? null : _mapper.Map<LibraryCardDto>(card);
    }

    public async Task<LibraryCardDto?> GetLibraryCardByUserIdAsync(int userId)
    {
        var card = await _libraryCardRepository.GetByUserIdAsync(userId);
        return card == null ? null : _mapper.Map<LibraryCardDto>(card);
    }

    public async Task<LibraryCardDto> CreateLibraryCardAsync(CreateLibraryCardDto dto)
    {
        // Check if user exists
        var user = await _userRepository.GetByIdAsync(dto.UserId);
        if (user == null)
        {
            throw new ApiException(404, "User not found");
        }

        // Check if user already has a library card
        var existingCard = await _libraryCardRepository.GetByUserIdAsync(dto.UserId);
        if (existingCard != null)
        {
            throw new ApiException(400, "User already has a library card");
        }

        // Generate card number
        var cardNumber = await _libraryCardRepository.GenerateCardNumberAsync();

        var card = new LibraryCard
        {
            UserId = dto.UserId,
            CardNumber = cardNumber,
            StudentName = dto.StudentName,
            ExpiryDate = dto.ExpiryDate,
            Status = CardStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        var createdCard = await _libraryCardRepository.CreateAsync(card);
        return _mapper.Map<LibraryCardDto>(createdCard);
    }

    // User tự đăng ký thẻ
    public async Task<LibraryCardDto> RegisterLibraryCardAsync(int userId, RegisterLibraryCardDto dto)
    {
        // Check if user exists
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ApiException(404, "User not found");
        }

        // Check if user already has a library card
        var existingCard = await _libraryCardRepository.GetByUserIdAsync(userId);
        if (existingCard != null)
        {
            throw new ApiException(400, "Bạn đã có thẻ thư viện rồi");
        }

        // Generate card number
        var cardNumber = await _libraryCardRepository.GenerateCardNumberAsync();

        var card = new LibraryCard
        {
            UserId = userId,
            CardNumber = cardNumber,
            StudentName = dto.StudentName,
            ExpiryDate = DateTime.UtcNow.AddYears(1), // Mặc định 1 năm
            Status = CardStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        var createdCard = await _libraryCardRepository.CreateAsync(card);
        return _mapper.Map<LibraryCardDto>(createdCard);
    }

    public async Task<LibraryCardDto> UpdateLibraryCardAsync(int id, UpdateLibraryCardDto dto)
    {
        var card = await _libraryCardRepository.GetByIdAsync(id);
        if (card == null)
        {
            throw new ApiException(404, "Library card not found");
        }

        // Update fields
        if (!string.IsNullOrEmpty(dto.StudentName))
        {
            card.StudentName = dto.StudentName;
        }

        if (dto.ExpiryDate.HasValue)
        {
            card.ExpiryDate = dto.ExpiryDate.Value;
        }

        if (dto.Status.HasValue)
        {
            card.Status = dto.Status.Value;
        }

        var updatedCard = await _libraryCardRepository.UpdateAsync(card);
        return _mapper.Map<LibraryCardDto>(updatedCard);
    }

    public async Task<bool> DeleteLibraryCardAsync(int id)
    {
        var card = await _libraryCardRepository.GetByIdAsync(id);
        if (card == null)
        {
            throw new ApiException(404, "Library card not found");
        }

        return await _libraryCardRepository.DeleteAsync(id);
    }

    public async Task<LibraryCardDto> RenewLibraryCardAsync(int id, int months = 12)
    {
        var card = await _libraryCardRepository.GetByIdAsync(id);
        if (card == null)
        {
            throw new ApiException(404, "Library card not found");
        }

        // Extend expiry date
        var newExpiryDate = card.ExpiryDate > DateTime.UtcNow
            ? card.ExpiryDate.AddMonths(months)
            : DateTime.UtcNow.AddMonths(months);

        card.ExpiryDate = newExpiryDate;
        card.Status = CardStatus.Active;

        var updatedCard = await _libraryCardRepository.UpdateAsync(card);
        return _mapper.Map<LibraryCardDto>(updatedCard);
    }
}
