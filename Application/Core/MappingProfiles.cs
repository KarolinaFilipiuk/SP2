using System.Linq;
using Application.Clothes;
using Application.Comments;
using Application.Profiles;
using Domain;
using Profile = AutoMapper.Profile;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;

            CreateMap<Cloth, Cloth>();

            CreateMap<Cloth, ClothDto>()
                .ForMember(d => d.HostUsername,
                    o => o
                        .MapFrom(s => s.Attendees
                        .FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ClothAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image,
                    o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));


            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image,
                    o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<ClothAttendee, UserClothDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Cloth.Id))
                .ForMember(d => d.Date, o => o.MapFrom(s => s.Cloth.Date))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.Cloth.Title))
                .ForMember(d => d.Category, o => o.MapFrom(s =>
                    s.Cloth.Category))
                .ForMember(d => d.HostUsername, o => o.MapFrom(s =>
                    s.Cloth.Attendees.FirstOrDefault(x =>
                        x.IsHost).AppUser.UserName));
        }
    }
}
