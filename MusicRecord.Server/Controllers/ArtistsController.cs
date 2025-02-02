using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using MusicRecord.Server.Data;
using MusicRecord.Server.Models;

namespace MusicRecord.Server.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class ArtistsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArtistsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Artists/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadArtists([FromBody] List<Artist> Artists)
        {
            try
            {
                // Check if the artists already exist, if exist update the rate and streams, else insert the new artist
                foreach (var artist in Artists)
                {
                    var existingArtist = await _context.Artists.FirstOrDefaultAsync(a => a.Name == artist.Name);
                    if (existingArtist != null)
                    {
                        existingArtist.Rate = artist.Rate;
                        existingArtist.Streams = artist.Streams;
                        existingArtist.Payout = existingArtist.Rate * existingArtist.Streams;
                        _context.Entry(existingArtist).State = EntityState.Modified;
                    }
                    else
                    {
                        artist.Payout = artist.Rate * artist.Streams;
                        await _context.Artists.AddAsync(artist);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Artists inserted successfully" });
            }
            catch (Exception ex)
            {
                return Problem(detail: ex.Message, statusCode: 500);
            }
        }

        // POST: api/Artists/create
        [HttpPost("create")]
        public async Task<ActionResult<Artist>> PostArtist(Artist artist)
        {
            // Prevent the creation of an artist with the same name
            var existingArtist = await _context.Artists.FirstOrDefaultAsync(a => a.Name == artist.Name);
            if (existingArtist != null)
            {
                return BadRequest(new { message = "Artist already exists" });
            }

            // Calculate the payout
            artist.Payout = artist.Rate * artist.Streams;

            _context.Artists.Add(artist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArtist), new { id = artist.Id }, artist);
        }

        // GET: api/Artists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artist>>> GetArtists()
        {
            try
            {
                // Retrieve all artists ordered by payout in descending order
                var artists = await _context.Artists
                    .OrderByDescending(a => a.Payout)
                    .ToListAsync();
                return Ok(artists);
            }
            catch (Exception ex)
            {
                return Problem(detail: ex.Message, statusCode: 500);
            }
        }

        // GET: api/Artists/name
        [HttpGet("name/{name}")]
        public async Task<ActionResult<Artist>> GetArtist(string name)
        {
            try
            {
                // Retrieve a specific artist by name
                var artist = await _context.Artists.FirstOrDefaultAsync(a => a.Name == name);
                if (artist == null)
                {
                    return NotFound();
                }
                return Ok(artist);
            }
            catch (Exception ex)
            {
                return Problem(detail: ex.Message, statusCode: 500);
            }
        }

        // GET: api/Artists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Artist>> GetArtist(int id)
        {
            try
            {
                // Retrieve a specific artist by id
                var artist = await _context.Artists.FindAsync(id);

                if (artist == null)
                {
                    return NotFound();
                }

                return Ok(artist);
            }
            catch (Exception ex)
            {
                return Problem(detail: ex.Message, statusCode: 500);
            }
        }

        // PUT: api/Artists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArtist(int id, Artist artist)
        {
            try
            {
                if (id != artist.Id)
                {
                    return BadRequest();
                }

                // Calculate the payout
                artist.Payout = artist.Rate * artist.Streams;

                // Update the artist details
                _context.Entry(artist).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ArtistExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return Problem(detail: ex.Message, statusCode: 500);
            }
        }

        // update the payout status of an artist
        [HttpPut("payout/{id}/{status}")]
        public async Task<IActionResult> UpdatePayoutStatus(int id, bool status)
        {
            try
            {
                var artist = await _context.Artists.FindAsync(id);
                if (artist == null)
                {
                    return NotFound();
                }
                artist.PayoutComplete = status;
                _context.Entry(artist).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return Problem(detail: ex.Message, statusCode: 500);
            }
        }

        // DELETE: api/Artists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtist(int id)
        {
            // Retrieve the artist to be deleted by id
            var artist = await _context.Artists.FindAsync(id);
            if (artist == null)
            {
                return NotFound();
            }

            // Remove the artist from the database
            _context.Artists.Remove(artist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Check if an artist exists by id
        private bool ArtistExists(int id)
        {
            return _context.Artists.Any(e => e.Id == id);
        }

    }
}
