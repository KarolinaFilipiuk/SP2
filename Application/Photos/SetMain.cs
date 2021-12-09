﻿using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public bool IsCloth { get; set; }
            public Guid ClothId { get; set; }
            public string Id { get; set; }
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
                if (request.IsCloth)
                {
                    var cloth = await _context.Clothes.Include(p => p.Photos)
                        .FirstOrDefaultAsync(a => a.Id == request.ClothId, cancellationToken: cancellationToken);

                    if (cloth == null) return null;

                    var photo = cloth.Photos.FirstOrDefault(p => p.Id == request.Id);

                    if (photo == null) return null;

                    var currentMainPhoto = cloth.Photos.FirstOrDefault(p => p.IsMain);

                    if (currentMainPhoto != null) currentMainPhoto.IsMain = false;

                    photo.IsMain = true;

                    var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                    if (result) return Result<Unit>.Success(Unit.Value);

                    return Result<Unit>.Failure("Problem setting main cloth photo");
                }
                else
                {
                    var user = await _context.Users.Include(u => u.Photos)
                        .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername(), cancellationToken: cancellationToken);

                    if (user == null) return null;

                    var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

                    if (photo == null) return null;

                    var currentMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);

                    if (currentMainPhoto != null) currentMainPhoto.IsMain = false;

                    photo.IsMain = true;

                    var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                    if (result) return Result<Unit>.Success(Unit.Value);

                    return Result<Unit>.Failure("Problem setting main photo");
                }
              
            }
        }
    }
}
