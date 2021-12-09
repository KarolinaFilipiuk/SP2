using System;

namespace Domain
{
    public class ClothAttendee
    {
        public string AppUserId { get; set; }

        public AppUser AppUser { get; set; }

        public Guid ClothId { get; set; }

        public Cloth Cloth { get; set; }
        public bool IsHost { get; set; }
    }
}
