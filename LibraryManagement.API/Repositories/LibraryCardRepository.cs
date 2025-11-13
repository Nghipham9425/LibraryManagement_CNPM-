using LibraryManagement.API.Data;
using LibraryManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Repositories;

public class LibraryCardRepository
{
    private readonly LibraryDbContext _context;

    public LibraryCardRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<LibraryCard>> GetAllAsync()
    {
        return await _context.LibraryCards
            .Include(lc => lc.User)
            .OrderByDescending(lc => lc.Id)
            .ToListAsync();
    }

    public async Task<LibraryCard?> GetByIdAsync(int id)
    {
        return await _context.LibraryCards
            .Include(lc => lc.User)
            .FirstOrDefaultAsync(lc => lc.Id == id);
    }

    public async Task<LibraryCard?> GetByUserIdAsync(int userId)
    {
        return await _context.LibraryCards
            .Include(lc => lc.User)
            .FirstOrDefaultAsync(lc => lc.UserId == userId);
    }

    public async Task<LibraryCard?> GetByStudentNameAsync(string studentName)
    {
        return await _context.LibraryCards
            .FirstOrDefaultAsync(lc => lc.StudentName == studentName);
    }

    public async Task<LibraryCard> CreateAsync(LibraryCard card)
    {
        _context.LibraryCards.Add(card);
        await _context.SaveChangesAsync();
        return card;
    }

    public async Task<LibraryCard> UpdateAsync(LibraryCard card)
    {
        var existingCard = await _context.LibraryCards.FindAsync(card.Id);
        if (existingCard == null) return card;

        existingCard.StudentName = card.StudentName;
        existingCard.ExpiryDate = card.ExpiryDate;
        existingCard.Status = card.Status;

        await _context.SaveChangesAsync();
        return existingCard;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var card = await _context.LibraryCards.FindAsync(id);
        if (card == null) return false;

        _context.LibraryCards.Remove(card);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<string> GenerateCardNumberAsync()
    {
        var lastCard = await _context.LibraryCards
            .OrderByDescending(lc => lc.Id)
            .FirstOrDefaultAsync();

        int nextNumber = (lastCard?.Id ?? 0) + 1;
        return $"LIB{nextNumber:D6}"; // Format: LIB000001
    }
}