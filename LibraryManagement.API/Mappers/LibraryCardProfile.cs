using AutoMapper;
using LibraryManagement.API.Models;
using LibraryManagement.API.Models.DTOs;

namespace LibraryManagement.API.Mappers;

public class LibraryCardProfile : Profile
{
    public LibraryCardProfile()
    {
        CreateMap<LibraryCard, LibraryCardDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User != null ? src.User.Email : string.Empty))
            .ForMember(dest => dest.CardNumber, opt => opt.MapFrom(src => src.CardNumber ?? string.Empty))
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.StudentName ?? string.Empty));
        
        CreateMap<CreateLibraryCardDto, LibraryCard>();
        CreateMap<UpdateLibraryCardDto, LibraryCard>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
