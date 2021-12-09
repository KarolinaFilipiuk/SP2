using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any() && !context.Clothes.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Ala",
                        UserName = "ala",
                        Email = "ala@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Ela",
                        UserName = "ela",
                        Email = "ela@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Ola",
                        UserName = "ola",
                        Email = "ola@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }

                var clothes = new List<Cloth>
                {
                    new Cloth
                    {
                        Title = "Spodnie z dziurami",
                        Description = "Spodnie od cioci Stasi",
                        Category = "spodnie",
                        Wardrobe = 1,
                        Shelf = 3,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            }
                        }
                    },
                    new Cloth
                    {
                        Title = "Niebieskie spodenki",
                        Description = "Cloth 1 month ago",
                        Category = "spodenki z promocji pożyczone od Ani",
                        Wardrobe = 3,
                        Shelf = 2,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                        }
                    },
                    new Cloth
                    {
                        Title = "Czarna czapka na narty",
                        Description = "pasuje do nibieskich nart",
                        Category = "czapkiZimowe",
                        Wardrobe = 4,
                        Shelf = 2,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            },
                        }
                    },
                    new Cloth
                    {
                        Title = "Czapka z daszkiem",
                        Description = "ma małe zaciągnięcie",
                        Category = "czapkiLetnie",
                        Wardrobe = 5,
                        Shelf = 3,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                        }
                    },
                    new Cloth
                    {
                        Title = "Bluzka z motylkiem",
                        Description = "pamiętaj o apaszce!",
                        Category = "bluzki",
                        Wardrobe = 3,
                        Shelf = 8,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[1],
                                IsHost = true
                            },
                        }
                    },
                    new Cloth
                    {
                        Title = "t-shirt na wf",
                        Description = "wtorkowe zajęcia",
                        Category = "tshirty",
                        Wardrobe = 1,
                        Shelf = 3,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[1],
                                IsHost = true
                            }
                        }
                    },
                    new Cloth
                    {
                        Title = "spodenki na imprezę",
                        Description = "w kieszeni są jakieś rzeczy",
                        Category = "spodenki",
                        Wardrobe = 3,
                        Shelf = 7,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                        }
                    },
                    new Cloth
                    {
                        Title = "Różowy sweter",
                        Description = "prezent od Moniki",
                        Category = "swetry",
                        Wardrobe = 1,
                        Shelf = 8,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            }
                        }
                    },
                    new Cloth
                    {
                        Title = "Buty na spacer",
                        Description = "śliska podeszwa",
                        Category = "buty",
                        Wardrobe = 4,
                        Shelf = 1,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            }
                        }
                    },
                    new Cloth
                    {
                        Title = "Różowa piżama",
                        Description = "piżama wyjazdowa",
                        Category = "piżamy",
                        Wardrobe = 4,
                        Shelf = 3,
                        Attendees = new List<ClothAttendee>
                        {
                            new ClothAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            }
                        }
                    }
                };

                await context.Clothes.AddRangeAsync(clothes);
                await context.SaveChangesAsync();
            }
        }
    }
}
