using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dataContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserAccessor _userAccessor;

        public IsHostRequirementHandler( DataContext dataContext, IHttpContextAccessor httpContextAccessor, IUserAccessor userAccessor)
        {
            _dataContext = dataContext;
            _httpContextAccessor = httpContextAccessor;
            _userAccessor = userAccessor;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            // użytkownik nie przeszedł autoryzacji
            if (userId == null) return Task.CompletedTask;

            var clothId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = _dataContext.ClothAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ClothId == clothId).Result;

            // nie ma takiego powiązania
            if (attendee == null) return Task.CompletedTask;

            if (attendee.IsHost) context.Succeed(requirement);

            // użytkownik jest hostem
            return Task.CompletedTask;
        }
    }
}
