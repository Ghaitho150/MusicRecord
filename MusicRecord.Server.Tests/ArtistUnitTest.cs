using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using MusicRecord.Server.Controllers;
using MusicRecord.Server.Data;
using MusicRecord.Server.Models;

namespace MusicRecord.Tests
{
    public class ArtistsControllerTests
    {
        private readonly ApplicationDbContext _context;
        private readonly ArtistsController _controller;

        public ArtistsControllerTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            _controller = new ArtistsController(_context);
        }

        [Fact]
        public async Task GetArtists_ReturnsOkResult_WithListOfArtists()
        {
            // Arrange
            _context.Artists.AddRange(new List<Artist>
                {
                    new Artist { Id = 1, Name = "Artist1", Rate = 10, Streams = 100 },
                    new Artist { Id = 2, Name = "Artist2", Rate = 20, Streams = 200 }
                });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetArtists();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnArtists = Assert.IsType<List<Artist>>(okResult.Value);
            Assert.Equal(2, returnArtists.Count);
        }

        [Fact]
        public async Task GetArtist_ReturnsNotFound_WhenArtistDoesNotExist()
        {
            // Act
            var result = await _controller.GetArtist(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PostArtist_ReturnsBadRequest_WhenArtistAlreadyExists()
        {
            // Arrange
            var artist = new Artist { Name = "Artist1", Rate = 10, Streams = 100 };
            _context.Artists.Add(artist);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.PostArtist(artist);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var messageProperty = badRequestResult.Value?.GetType().GetProperty("message");
            var messageValue = messageProperty?.GetValue(badRequestResult.Value);
            Assert.Equal("Artist already exists", messageValue);
        }

        [Fact]
        public async Task DeleteArtist_ReturnsNotFound_WhenArtistDoesNotExist()
        {
            // Act
            var result = await _controller.DeleteArtist(1);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
