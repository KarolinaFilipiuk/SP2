using Domain;
using FluentValidation;

namespace Application.Clothes
{
    public class ClothValidator : AbstractValidator<Cloth>
    {
        public ClothValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            //RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.Wardrobe).NotEmpty();
            RuleFor(x => x.Shelf).NotEmpty();
            //RuleFor(x => x.City).NotEmpty();
            //RuleFor(x => x.Venue).NotEmpty();
        }
    }
}
