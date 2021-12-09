using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Clothes
{
    public class DeleteToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var cloth = await _context.Clothes
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken: cancellationToken);

                if (cloth == null) return null;

                var hostUsername = cloth.Attendees.FirstOrDefault(x =>
                    x.IsHost)?.AppUser?.UserName;

                var user = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUsername(), cancellationToken: cancellationToken);

                if (user == null) return null;

                // jestem hostem i chcę zakończyć / rozpocząć wydarzenie
                if ( hostUsername == user.UserName)
                {
                    cloth.IsDeleted = !cloth.IsDeleted;
                }
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating history");
            }
        }
    }
}
