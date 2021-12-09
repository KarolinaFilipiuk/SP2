using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _HttpContextAccessor;

        public UserAccessor(IHttpContextAccessor HttpContextAccessor)
        {
            _HttpContextAccessor = HttpContextAccessor;
        }
        public string GetUsername()
        {
            return _HttpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}
