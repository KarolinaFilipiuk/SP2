﻿using System;
using System.Text.Json.Serialization;

namespace Application.Profiles
{
    public class UserClothDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

        [JsonIgnore]
        public string HostUsername { get; set; }
    }
}
