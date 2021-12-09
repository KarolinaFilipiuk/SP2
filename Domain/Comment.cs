using System;

namespace Domain
{
    public class Comment
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public AppUser Author { get; set; }
        public Cloth Cloth { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}