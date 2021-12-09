using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Clothes
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Cloth Cloth { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Cloth).SetValidator(new ClothValidator());
            }
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
                var user = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUsername(), cancellationToken: cancellationToken);

                var attendee = new ClothAttendee
                {
                    AppUser = user,
                    Cloth = request.Cloth,
                    IsHost = true
                };
                request.Cloth.Attendees.Add(attendee);

                _context.Clothes.Add(request.Cloth);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<Unit>.Failure("Failed to create cloth!");

                return Result<Unit>.Success(Unit.Value);

            }
        }
    }
}
