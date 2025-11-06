using AutoMapper;
using LibraryManagement.API.DTOs.User;
using LibraryManagement.API.Models;

namespace LibraryManagement.API.Mappers;

public class UserProfile : Profile
{
    public UserProfile()
    {
        // User -> UserDto
        CreateMap<User, UserDto>();

        // CreateUserDto -> User
        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); // Will be set manually with BCrypt

        // UpdateUserDto -> User (only update non-null fields)
        CreateMap<UpdateUserDto, User>()
            .ForMember(dest => dest.IsActive, opt => opt.Ignore()) // Never update IsActive via DTO
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Never update CreatedAt
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Never update Id
            .ForMember(dest => dest.UserName, opt => opt.Ignore()) // Never update UserName
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
