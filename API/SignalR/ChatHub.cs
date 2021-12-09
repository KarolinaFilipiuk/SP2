using System;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.ClothId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var clothId = httpContext.Request.Query["clothId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, clothId);
            var result = await _mediator.Send(new List.Query { ClothId = Guid.Parse(clothId) });
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}