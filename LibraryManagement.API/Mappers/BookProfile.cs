using AutoMapper;
using LibraryManagement.API.Models;
using LibraryManagement.API.Models.DTOs;

namespace LibraryManagement.API.Mappers
{
    public class BookProfile : Profile
    {
        public BookProfile()
        {
            // Entity to DTO mappings
            CreateMap<Book, BookDto>()
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src =>
                    src.BookGenres != null
                        ? src.BookGenres.Where(bg => bg.Genre != null).Select(bg => bg.Genre!.Name).ToList()
                        : new List<string>()
                ))
                .ForMember(dest => dest.BookAuthors, opt => opt.MapFrom(src =>
                    src.BookAuthors != null
                        ? src.BookAuthors.Select(ba => new BookAuthorDto
                        {
                            BookId = ba.BookId,
                            AuthorId = ba.AuthorId,
                            AuthorName = ba.Author != null ? ba.Author.Name : "Unknown Author"
                        }).ToList()
                        : new List<BookAuthorDto>()
                ))
                .ForMember(dest => dest.TotalCopies, opt => opt.Ignore()) // Tính sau trong Service
                .ForMember(dest => dest.AvailableCopies, opt => opt.Ignore()); // Tính sau trong Service

            CreateMap<Author, AuthorDto>()
                .ForMember(dest => dest.BookCount, opt => opt.MapFrom(src => src.BookAuthors != null ? src.BookAuthors.Count : 0));

            // BookItem mappings
            CreateMap<BookItem, BookItemDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (int)src.Status));

            // DTO to Entity mappings
            CreateMap<BookInputDto, Book>()
                .ForMember(dest => dest.BookGenres, opt => opt.MapFrom(src =>
                    src.GenreIds != null
                        ? src.GenreIds.Select(id => new BookGenre { GenreId = id }).ToList()
                        : new List<BookGenre>()
                ))
                .ForMember(dest => dest.Publisher, opt => opt.MapFrom(src => src.Publisher ?? ""))
                .ForMember(dest => dest.BookAuthors, opt => opt.MapFrom(src =>
                    src.AuthorIds != null
                        ? src.AuthorIds.Select(id => new BookAuthor { AuthorId = id }).ToList()
                        : new List<BookAuthor>()
                ));

            // Two-way mappings
            CreateMap<BookDto, Book>();
            CreateMap<AuthorDto, Author>();
        }
    }
}

// //// Thủ công trong Service/Controller
// var bookDto = new BookDto
// {
//     Id = book.Id,
//     Title = book.Title,
//     BookAuthors = book.BookAuthors?.Select(ba => new BookAuthorDto
//     {
//         BookId = ba.BookId,
//         AuthorId = ba.AuthorId,
//         AuthorName = ba.Author?.Name ?? "Unknown"
//     }).ToList() ?? new List<BookAuthorDto>()
// };
//khong co mapper thi phai gan thu cong