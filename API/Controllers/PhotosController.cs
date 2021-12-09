using System;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost("{clothId}")]
        public async Task<IActionResult> Add(Guid clothId, [FromForm] IFormFile file)
        {
            return HandleResult(await Mediator.Send(new Add.Command{ IsCloth = true,  ClothId = clothId, File = file}));
        }

        [HttpDelete("{clothId}/{id}")]
        public async Task<IActionResult> Delete(Guid clothId, string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { IsCloth = true, ClothId = clothId, Id = id}));
        }

        [HttpPost("setMain/{clothId}/{id}")]
        public async Task<IActionResult> SetMain(Guid clothId, string id)
        {
            return HandleResult(await Mediator.Send(new SetMain.Command{ IsCloth = true, ClothId = clothId, Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> AddProfilePhoto([FromForm] IFormFile file)
        {
            return HandleResult(await Mediator.Send(new Add.Command {File = file }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfilePhoto(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainProfilePhoto( string id)
        {
            return HandleResult(await Mediator.Send(new SetMain.Command { Id = id }));
        }
    }
}
