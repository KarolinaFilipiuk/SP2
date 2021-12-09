using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Clothes
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ClothDto>>>
        {
            public ClothParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ClothDto>>>
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
            public async Task<Result<PagedList<ClothDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Clothes
                    .OrderBy(d => d.Date)
                    .ProjectTo<ClothDto>(_mapper.ConfigurationProvider, 
                        new {currentUsername = _userAccessor.GetUsername()})
                    .Where(x => x.HostUsername == _userAccessor.GetUsername())
                    .Where(x => !x.IsDeleted)
                    .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(
                        x => x.IsCancelled);
                }

                if (!request.Params.IsGoing && request.Params.IsHost)
                {
                    query = query.Where(
                        x => !x.IsCancelled);
                }

                if (request.Params.Wardrobe != 0)
                {
                    query = query.Where(
                        x => x.Wardrobe == request.Params.Wardrobe);
                }

                if (request.Params.Shelf != 0)
                {
                    query = query.Where(
                        x => x.Shelf == request.Params.Shelf);
                }

                if (request.Params.Category != null)
                {
                    query = query.Where(
                        x => x.Category == request.Params.Category);
                }

                return Result<PagedList<ClothDto>>.Success(
                    await PagedList<ClothDto>.CreateAsync(query, request.Params.PageNumber,
                        request.Params.PageSize)
                );
            }
        }
    }
}
