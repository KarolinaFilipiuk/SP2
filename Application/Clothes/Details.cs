﻿using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Clothes
{
    public class Details
    {
        public class Query : IRequest<Result<ClothDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ClothDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }
            public async Task<Result<ClothDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var cloth = await _context.Clothes
                    .ProjectTo<ClothDto>(_mapper.ConfigurationProvider, new {currentUsername = _userAccessor.GetUsername()})
                    .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken: cancellationToken);

                return Result<ClothDto>.Success(cloth);
            }
        }
    }
}