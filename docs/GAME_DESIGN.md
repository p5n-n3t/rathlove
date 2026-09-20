# RATLOVE — Game Design Specification

## Concept

RATLOVE is a 90-second retro-futurist sewer arcade game for ratlove.me. The visual language is 1980s CRT arcade, ASCII terminal graphics, pixelation, scanlines, chromatic aberration, glitch frames, phosphor glow, dirty sewer industrialism, and deliberately absurd collage animation.

Rathbone, also presented as Rathlove, is the game's anti-rat crime-fighter and hero/host. After the intro, the player descends into a sewer and fires chickens from a slingshot at mutant rat-bodied targets whose heads use the supplied transparent character assets.

The supplied image assets are canonical. Do not replace, redraw, regenerate, or substitute them.

## Technology

- Next.js 16.x with App Router and TypeScript.
- React for intro, menu, leaderboard, HUD, results, and page shell.
- Phaser 4 for the live 2D game canvas, projectile motion, collisions, target movement, particles, screen shake, lane animation, and procedural rat bodies.
- Dynamically import Phaser client-side only.
- Supabase for the public leaderboard.
- No account signup. The player enters a callsign only.
- Web Audio may synthesize simple arcade sounds.
- No external stock images are required.

## User journey

1. 30-second intro animation, skippable.
2. Main menu / attract screen with leaderboard.
3. Callsign entry.
4. Difficulty selection: Easy / Medium / Hard.
5. 6-second sewer descent transition.
6. 90-second game round.
7. Results and score submission.
8. Updated leaderboard.
9. Replay / change difficulty / return to menu.

## Playfield

Use a logical 1600×900 game canvas that scales responsively while preserving aspect ratio. Place the slingshot near lower-center at approximately x=800, y=748. Keep a bucket of small chicken sprites beside it. Four horizontal sewer lanes cross the playfield above the slingshot around y=170, 310, 450, and 590.

The lanes should look like old metal grates, pipes, or catwalks spanning a large sewer tunnel. Behind them: sludge, bubbling toxic runoff, dripping pipes, glowing eyes, flies, steam, trash, mutant silhouettes, broken signs, and CRT-like environmental flicker. Keep targets readable.

## Slingshot control

Mouse:
- Hold left mouse button on the loaded chicken.
- Drag backward from the slingshot anchor.
- Rubber bands visibly stretch.
- Pull distance determines launch strength.
- Aim is opposite the drag vector.
- Release to launch.
- Maximum pull distance is 190 logical pixels.

Touch uses the same pointer logic.

Feedback:
- Easy shows a short dotted trajectory prediction.
- Medium and Hard do not.
- Bands vibrate under tension.
- Chicken squashes slightly while primed.
- Release triggers snap, micro screen shake, cluck, and motion streak.

## Chicken classes

Chicken 1 — HEAVY
- /assets/game/chickens/chicken-1.svg
- Slowest.
- Strongest knockback.
- Largest collision radius.
- Can continue through one target and hit a second.
- 1.15 score multiplier.

Chicken 2 — BALANCED
- /assets/game/chickens/chicken-2.svg
- Medium speed.
- Medium collision radius.
- Normal knockback.
- One target per shot.
- 1.0 score multiplier.

Chicken 3 — FAST
- /assets/game/chickens/chicken-3.svg
- Fastest.
- Smallest collision radius.
- Lower knockback.
- Precision-oriented.
- 1.25 score multiplier.

Selection:
- Bucket visibly contains duplicated miniatures of all three SVGs.
- Current chicken sits in the sling.
- Click/tap a type in the bucket or press 1, 2, 3.
- Ammo is unlimited; time is the constraint.
- Reload quickly after every shot.

## Target system

Current supplied targets:
- Alan
- Bibi
- Daniela
- Epstein
- Loomer
- Shmuley
- Trump

Do not hard-code the game to seven. Build from src/data/assets.json so a later eighth target can be added without changing the engine.

Every target has:
- a procedurally drawn stylized mutant rat body;
- one supplied transparent head image attached to the body;
- a horizontal lane;
- direction;
- speed;
- emotional state;
- a per-state shuffle-bag of head variations.

Target bodies are intentionally cartoonish and non-gory. Tails whip behind them, feet jitter, and heads bob with locomotion.

Targets enter from either edge. Character, lane, direction, and speed are randomized within difficulty constraints.

## Face variation logic

For each character and state (normal, angry, crying), maintain a shuffle-bag:
1. Shuffle all available assets.
2. Consume every asset exactly once.
3. When empty, reshuffle.
4. The first item after reshuffle may not equal the immediately previous asset unless only one exists.

Normal:
- While running, switch the face every 240–460ms.
- Draw from the normal shuffle-bag.

Angry:
- On hit, immediately replace the normal head with the next angry variation.
- Advance the angry bag on every hit for that character.

Crying:
- After the angry reaction, use the next crying variation during the fall-away animation.
- Advance the crying bag on every hit.

## Aim reaction

When the projected shot direction passes near a running target:
- briefly change speed;
- duck or bob;
- occasionally reverse if lane space allows;
- accelerate away from the projected impact point;
- emit a tiny panic jitter.

Keep it subtle on Easy and aggressive on Hard.

## Hit sequence

On collision:

0–80ms:
- Brief freeze frame.
- Small camera punch.
- Comic impact text: KAPOW, SPLAT, BONK, CLUCK, or THWACK.
- Pixel, feather, and sludge particle burst.
- Impact sound.

0–2.0s:
- Switch immediately to the next angry head.
- Target leaves the lane in a ballistic knockback arc.
- Angry head/body shakes and vibrates.
- Rotate according to impact direction.

At 2.0s:
- Switch to the next crying head.

2.0–2.8s:
- Continue falling/flinging away.
- Fade, shrink slightly, spin, then despawn.

No gore.

## Difficulty

Easy:
- Target speed 80–125.
- Max 6 active targets.
- Spawn interval 800–1250ms.
- 1.2× hitboxes.
- Light evasive reaction.
- Trajectory guide.
- Score multiplier 1.0.

Medium:
- Target speed 120–185.
- Max 8 active targets.
- Spawn interval 600–950ms.
- Standard hitboxes.
- Moderate evasive reaction.
- No trajectory guide.
- Score multiplier 1.5.

Hard:
- Target speed 165–255.
- Max 10 active targets.
- Spawn interval 425–725ms.
- 0.86× hitboxes.
- Strong evasive reaction.
- No trajectory guide.
- Score multiplier 2.25.

Difficulty affects physics and behavior, not merely score.

## Scoring

Base hit: 100 × difficulty multiplier × chicken multiplier.

Add:
- Up to +50 precision bonus based on impact distance from target center.
- Combo bonus when successive hits occur within 2.5 seconds without a miss.
- Combo ladder: +25 × combo level, capped at 10.
- Heavy chicken second-target pierce: +150.
- Final 15 seconds activates TUNNEL PANIC:
  - target speed ×1.1;
  - score ×1.25;
  - stronger red CRT pulse and alarm.

A miss resets combo but never subtracts score.

Track:
- score;
- shots;
- hits;
- accuracy;
- best combo;
- per-chicken hit count.

## HUD

Top left:
- Callsign.
- Difficulty.

Top center:
- Countdown clock in large segmented/pixel digits.

Top right:
- Score.
- Combo.

Bottom:
- Three chicken selectors.
- Current chicken label.
- Tiny strength/speed bars.
- Mute control.

## Leaderboard

Main menu shows a classic arcade top-10 table.

Columns:
- Rank
- Callsign
- Score
- Difficulty
- Accuracy

Filters:
- ALL
- EASY
- MEDIUM
- HARD

Callsign rules:
- 1–16 characters after trim.
- Escape on render.
- Duplicate names allowed.

Create a server-side game session at the beginning of each round. Submit the score through a Next.js server route/action at completion. Never expose a Supabase secret/service-role credential to the browser.

Server-side sanity checks:
- session exists and is unused;
- difficulty matches;
- elapsed time is plausible for a 90-second round;
- score/hits/shots/combo are non-negative and within generous physical bounds;
- one submission per session.

This is intended to stop casual score spoofing, not provide esports-grade anti-cheat.

## Sound

Use Web Audio or small generated procedural sounds:
- CRT power-on buzz;
- menu blips;
- bubbling sewer;
- distant pipe clang;
- slingshot stretch;
- band snap;
- three distinct chicken launch/cluck pitches;
- hit splat/bonk;
- angry squeak;
- falling comedic whine;
- countdown ticks;
- final-15-second alarm;
- score tally.

Only start audio after user interaction.

## Visual treatment

Core look:
- black/near-black backdrop;
- phosphor green, toxic lime, dirty amber, cyan, red, and magenta highlights;
- CRT scanlines;
- subtle barrel distortion;
- chromatic separation on glitches;
- pixelated wipes;
- ASCII fragments;
- terminal boot text;
- dithering;
- blocky particles;
- occasional horizontal sync tear.

Do not keep heavy distortion active continuously during gameplay. Targets and trajectory must remain readable.

Use CSS/canvas effects around the supplied assets. Do not replace the supplied assets with generated substitutes.

## Accessibility and usability

- Intro is skippable.
- Respect prefers-reduced-motion by reducing major shake/glitch frequency.
- Add mute/unmute.
- Keyboard supports menus and chicken switching.
- Touch controls work.
- Prevent page scrolling while actively dragging the slingshot.
- Never require hover for essential information.
- Pause when the tab becomes hidden without granting extra play time.
