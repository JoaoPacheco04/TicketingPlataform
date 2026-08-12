using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace TicketingPlataform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WaitingQueueController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;

        public WaitingQueueController(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        [HttpPost("{eventId}/join")]
        public async Task<IActionResult> JoinQueue(Guid eventId, [FromQuery] Guid userId)
        {
            var db = _redis.GetDatabase();
            var queueKey = $"event:{eventId}:queue";

            var score = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            await db.SortedSetAddAsync(queueKey, userId.ToString(), score);

            var position = await db.SortedSetRankAsync(queueKey, userId.ToString());

            return Ok(new { position = position + 1 });
        }

        [HttpGet("{eventId}/position")]
        public async Task<IActionResult> GetPosition(Guid eventId, [FromQuery] Guid userId)
        {
            var db = _redis.GetDatabase();
            var queueKey = $"event:{eventId}:queue";

            var rank = await db.SortedSetRankAsync(queueKey, userId.ToString());
            if (rank == null)
            {
                return NotFound("User not in queue");
            }

            return Ok(new { position = rank + 1 });
        }

        [HttpPost("{eventId}/release")]
        public async Task<IActionResult> ReleaseBatch(Guid eventId, [FromQuery] int batchSize = 5)
        {
            var db = _redis.GetDatabase();
            var queueKey = $"event:{eventId}:queue";

            var released = await db.SortedSetRangeByRankAsync(queueKey, 0, batchSize - 1);

            if (released.Length == 0)
            {
                return Ok(new { released = Array.Empty<string>() });
            }

            await db.SortedSetRemoveRangeByRankAsync(queueKey, 0, batchSize - 1);

            var releasedKey = $"event:{eventId}:released";
            foreach (var userId in released)
            {
                await db.SetAddAsync(releasedKey, userId);
            }
            await db.KeyExpireAsync(releasedKey, TimeSpan.FromMinutes(5));

            return Ok(new { released = released.Select(u => u.ToString()) });
        }
    }
}