# Original PANG gameplay elements

This implementation keeps the existing mobile-friendly HP system while restoring several recognizable arcade mechanics from the 1989 game:

- Every stage has a 90-second limit. Running out of time ends the run, while clearing early awards 10 points per remaining second.
- Power Harpoon (`P`) instantly reaches the first obstacle or the ceiling and remains for five seconds or until a balloon touches the wire.
- Vulcan (`V`) fires up to five fast projectiles at 120 ms intervals. Its shots use point-projectile collision rather than the full persistent-wire collision.
- Double Wire, Clock, Hourglass, Barrier, 1UP, and Dynamite remain available. Picking up a weapon replaces the previous weapon mode.
- Speed Boost (`S`) increases movement speed by 60% for 10 seconds, while Invincible (`I`) prevents collision damage for 8 seconds.
- Time Plus (`T`) immediately adds 15 seconds and Score Bonus (`$`) immediately adds 1,000 points to the cumulative run score.
- The world tour now contains 20 stages. Every stage combines multiple platforms with climbable ladders, and the second half uses night variants of the world backgrounds.
- Stage Select only enables stages the player has reached. Clearing a stage permanently unlocks the next one in the browser profile.

Reference behavior was compared against descriptions and screenshots for the original _Pang / Buster Bros._, including its persistent power wire, rapid-fire gun, time pressure, destructible/permanent barriers, ladders, and two-player mode.

Deferred structural work: destructible blocks, hidden bonuses, and local two-player co-op. These require additional object-state and multiplayer synchronization systems.

Sources:

- https://www.mobygames.com/game/5055/buster-bros/
- https://www.mobygames.com/game/5055/buster-bros/screenshots/
- https://www.gamesdatabase.org/Media/SYSTEM/Amstrad_CPC/manual/Formated/Pang_-_1991_-_Ocean_Software_Ltd..pdf
