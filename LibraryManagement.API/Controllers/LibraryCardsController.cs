using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.API.Services;
using LibraryManagement.API.Models.DTOs;
using System.Security.Claims;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LibraryCardsController : ControllerBase
{
    private readonly LibraryCardService _libraryCardService;

    public LibraryCardsController(LibraryCardService libraryCardService)
    {
        _libraryCardService = libraryCardService;
    }

    // GET: api/librarycards
    [HttpGet]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<IEnumerable<LibraryCardDto>>> GetAllLibraryCards()
    {
        var cards = await _libraryCardService.GetAllLibraryCardsAsync();
        return Ok(cards);
    }

    // GET: api/librarycards/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<LibraryCardDto>> GetLibraryCard(int id)
    {
        var card = await _libraryCardService.GetLibraryCardByIdAsync(id);
        if (card == null)
        {
            return NotFound(new { message = "Library card not found" });
        }
        return Ok(card);
    }

    // GET: api/librarycards/my-card
    [HttpGet("my-card")]
    [Authorize]
    public async Task<ActionResult<LibraryCardDto>> GetMyLibraryCard()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { message = "Invalid user" });
        }

        var card = await _libraryCardService.GetLibraryCardByUserIdAsync(userId);
        if (card == null)
        {
            return NotFound(new { message = "You don't have a library card yet" });
        }
        return Ok(card);
    }

    // POST: api/librarycards/register (User tự đăng ký thẻ)
    [HttpPost("register")]
    [Authorize] // Cho phép tất cả user tự đăng ký thẻ
    public async Task<ActionResult<LibraryCardDto>> RegisterLibraryCard([FromBody] RegisterLibraryCardDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { message = "Invalid user" });
        }

        var card = await _libraryCardService.RegisterLibraryCardAsync(userId, dto);
        return CreatedAtAction(nameof(GetMyLibraryCard), null, card);
    }

    // POST: api/librarycards
    [HttpPost]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<LibraryCardDto>> CreateLibraryCard([FromBody] CreateLibraryCardDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var card = await _libraryCardService.CreateLibraryCardAsync(dto);
        return CreatedAtAction(nameof(GetLibraryCard), new { id = card.Id }, card);
    }

    // PUT: api/librarycards/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<LibraryCardDto>> UpdateLibraryCard(int id, [FromBody] UpdateLibraryCardDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var card = await _libraryCardService.UpdateLibraryCardAsync(id, dto);
        return Ok(card);
    }

    // DELETE: api/librarycards/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteLibraryCard(int id)
    {
        var result = await _libraryCardService.DeleteLibraryCardAsync(id);
        if (!result)
        {
            return NotFound(new { message = "Library card not found" });
        }
        return NoContent();
    }

    // POST: api/librarycards/5/renew
    [HttpPost("{id}/renew")]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<LibraryCardDto>> RenewLibraryCard(int id, [FromQuery] int months = 12)
    {
        var card = await _libraryCardService.RenewLibraryCardAsync(id, months);
        return Ok(card);
    }
}
