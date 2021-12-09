using System;
using System.Collections.Generic;
using Application.Profiles;
using Domain;

namespace Application.Clothes
{
    public class ClothDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int Wardrobe { get; set; }

        public int Shelf { get; set; }
        public string HostUsername { get; set; }
        public bool IsCancelled { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<AttendeeDto> Attendees { get; set; }
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
    }
}
