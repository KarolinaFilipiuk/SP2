using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Clothes;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ClothesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetClothes([FromQuery] ClothParams param, CancellationToken ct)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query{Params = param}, ct));
        }

        [Authorize(Policy = "IsClothHost")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCloth(Guid id, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}, ct));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCloth(Cloth cloth)
        {
            return HandleResult(await Mediator.Send(new Create.Command {Cloth = cloth}));
        }

        [Authorize(Policy = "IsClothHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditCloth(Guid id, Cloth cloth, CancellationToken ct)
        {
            cloth.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command {Cloth = cloth }, ct));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command {Id = id}));
        }

        [Authorize(Policy = "IsClothHost")]
        [HttpPost("{id}/deleteToggle")]
        public async Task<IActionResult> DeleteToggle(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeleteToggle.Command { Id = id }));
        }
    }
}
