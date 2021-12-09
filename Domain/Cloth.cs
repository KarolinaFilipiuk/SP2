using System;
using System.Collections.Generic;

namespace Domain
{
    public class Cloth
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int Wardrobe { get; set; }
        public int Shelf { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public bool IsCancelled { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<ClothAttendee> Attendees { get; set; } = new List<ClothAttendee>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
    }
}
