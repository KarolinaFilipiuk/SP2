using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Clothes
{
    public class Edit
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
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var cloth = await _context.Clothes.FindAsync(request.Cloth.Id);
                if (cloth == null) return null;

                _mapper.Map(request.Cloth, cloth);
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!result) return Result<Unit>.Failure("Failed to update cloth");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
