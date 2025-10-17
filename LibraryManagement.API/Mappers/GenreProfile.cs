using AutoMapper;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Mappers
{
    public class GenreProfile : Profile
    {
        public GenreProfile()
        {
            // Entity to DTO mappings
            CreateMap<Genre, GenreDto>()
                .ForMember(dest => dest.BookCount, opt => opt.MapFrom(src => src.BookGenres != null ? src.BookGenres.Count : 0));

            // DTO to Entity mappings
            CreateMap<GenreDto, Genre>();

            // Two-way mappings
            CreateMap<Genre, GenreDto>();
            CreateMap<GenreDto, Genre>();
        }
    }
}