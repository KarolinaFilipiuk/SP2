using System;
using Application.Core;

namespace Application.Clothes
{
    public class ClothParams : PagingParams
    {
        public bool IsGoing { get; set; }
        public bool IsHost { get; set; }
        public int Wardrobe { get; set; }
        public int Shelf { get; set; }
        public string Category { get; set; }
    }
}
