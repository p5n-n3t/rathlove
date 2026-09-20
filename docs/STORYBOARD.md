# RATLOVE — Storyboard & User Journey

## Scene 0 — Boot / Intro (0:00–0:30)

The intro is a full-screen, skippable 30-second collage. Every asset under public/assets/intro must appear at least once.

### 0:00–0:03 — Dead CRT
Black screen. A tiny horizontal line snaps open into CRT glow. Scanlines appear. Terminal text types:

RATLOVE MUNICIPAL VERMIN CONTROL
BOOTING RATHBONE UNIT...

A fake diagnostic meter jumps erratically.

The CRT monitor prop rises from the bottom. Its built-in Rathlove-modified desktop graphic flickers.

Asset:
- /assets/intro/props/crt-monitor.webp

### 0:03–0:06 — Logo infection
Blue, green, and red pixel logos pop into three corners, duplicate briefly, corrupt each other, then collapse toward center like broken desktop icons.

Assets:
- /assets/intro/logos/pixel-logo-blue.webp
- /assets/intro/logos/pixel-logo-green.webp
- /assets/intro/logos/pixel-logo-red.webp

### 0:06–0:10 — Rathbone face scan
Rapidly cycle portrait-01 through portrait-05. Each arrives through a different reveal: vertical decode, mosaic blocks, CRT roll, ASCII mask, color-channel separation.

Freeze on the last image as a fake database card:

RATHBONE
AKA RATHLOVE
STATUS: EXTREMELY AVAILABLE FOR VERMIN

Assets:
- /assets/intro/rathbone/portrait-01.webp through portrait-05.webp

### 0:10–0:14 — Three-line lips/title stack
Build these supplied pieces vertically:
1. lips-rathbone-is-rathlove at top;
2. lips-in in the middle;
3. lips-rath-a-mole at bottom.

Place rathlove-block-characters behind/through the stack as a large typographic collision layer.

Assets:
- /assets/intro/lips/lips-rathbone-is-rathlove.webp
- /assets/intro/lips/lips-in.webp
- /assets/intro/lips/lips-rath-a-mole.webp
- /assets/intro/lips/rathlove-block-characters.webp

The lips wobble as if speaking while short synthetic syllable-like blips play. Do not fabricate spoken dialogue.

### 0:14–0:19 — Consumer-trash hero montage
Treat Rathbone like an absurd 1980s celebrity endorsement.

- Crown drops onto a Rathbone portrait.
- Earphones snake in from the sides.
- Mixtape rotates in like an album commercial.
- phone-01 rises from the bottom as though receiving a call.
- StarTAC phone rises/flips into view with its supplied Rathlove-calling screen.

Assets:
- /assets/intro/props/crown.webp
- /assets/intro/props/earphones.webp
- /assets/intro/props/mixtape.webp
- /assets/intro/props/phone-01.webp
- /assets/intro/props/startac-phone.webp

### 0:19–0:23 — Cat interruption
Peeking cat comes only from the bottom edge, showing the cropped eyes/ears region, then sinks away.

Reaching cat rises on hind legs and swipes at a pixel logo.

Flying cat crosses horizontally at ridiculous speed with a one-frame VHS tracking error at center.

Assets:
- /assets/intro/props/peeking-cat.webp
- /assets/intro/props/reaching-cat.webp
- /assets/intro/props/flying-cat.webp

### 0:23–0:26 — Full-body hero corruption
Show clean full-body Rathbone in center. Cycle the four full-body glitch images as animation keyframes, then resolve to clean full-body.

Assets:
- /assets/intro/rathbone/full-body.webp
- /assets/intro/rathbone/full-body-glitch-01.webp
- /assets/intro/rathbone/full-body-glitch-02.webp
- /assets/intro/rathbone/full-body-glitch-03.webp
- /assets/intro/rathbone/full-body-glitch-04.webp

### 0:26–0:28 — Long-haired prop cameo
The supplied long-haired Trump prop slides across the foreground like a malfunctioning TV commercial cutout, gets yanked away by an off-screen cursor/crook, and disappears. It is a brief surreal intro prop only, not a gameplay mechanic.

Asset:
- /assets/intro/props/trump-long-hair.webp

### 0:28–0:30 — Title lock
All noise cuts. Black screen for about 100ms. RATLOVE title slams in with phosphor bloom.

Subline:
RATHBONE MUNICIPAL RAT REMOVAL DIVISION

Domain:
RATLOVE.ME

Controls:
[ PRESS START ]
[ SKIP INTRO ]

After the first completed viewing in a browser session, permit a local "skip intro next time" preference.

## Scene 1 — Main Menu / Attract Mode

Layout:
- RATLOVE title upper center.
- Rathbone portrait occasionally glitches behind title.
- START GAME is the primary action.
- Right side: TOP 10 arcade leaderboard.
- Bottom: sound toggle, how-to-play, credits.
- Tiny chicken SVGs occasionally run along the lower border.
- Background shows a stylized city at night above a sewer cross-section.

Attract loop:
Every 12–18 seconds a tiny Rathbone full-body figure walks toward a manhole, a chicken follows, and both glitch away.

## Scene 2 — Callsign + Difficulty

Player enters CALLSIGN, 1–16 characters.

Difficulty:
- EASY: trajectory guide, slower rats, larger hitboxes.
- MEDIUM: standard.
- HARD: fast evasive rats, smaller hitboxes.

Display chicken tutorial cards using the real SVGs:
- 1 HEAVY
- 2 BALANCED
- 3 FAST

Primary button:
ENTER THE RAT TUNNEL

## Scene 3 — Sewer Descent (about 6 seconds)

0:00–0:01.5:
Rathbone full-body walks toward a circular tunnel/manhole rendered procedurally. City ambience collapses into low sewer hum.

0:01.5–0:03:
Camera dives into darkness. Brickwork, pipe rings, warning stripes, ASCII arrows, and glitch graffiti streak past.

0:03–0:04.5:
A fake municipal sign flashes:
INFESTATION LEVEL: EASY / MEDIUM / HARD
RATHBONE CLEARANCE: QUESTIONABLE

0:04.5–0:05.5:
The four horizontal lanes slide into final position. Sludge rises at the bottom. The chicken bucket drops beside the slingshot with a metallic clang.

0:05.5–0:06:
Slingshot assembles from pixel fragments.

READY
CLUCK
FIRE

Clock snaps to 01:30.

## Scene 4 — Live Round (1:30)

### Environment
Four horizontal rat lanes cross the sewer. Targets enter from left or right. The slingshot remains lower-center. The bucket stays near it.

Rat bodies are procedural and generic. Head images are the exact supplied transparent assets.

### Opening 15 seconds
Teach through play:
- Easy shows trajectory.
- A contextual hint appears once: HOLD + DRAG / RELEASE TO FIRE.
- Chicken selectors pulse once.

### Main 60 seconds
Increase visual activity gradually:
- more bubbles;
- faster steam vents;
- occasional pipe sparks;
- mutant eyes in side tunnels;
- flickering lane signs;
- stronger aim-reactive target behavior.

Do not exceed the configured difficulty ranges.

### Final 15 seconds — TUNNEL PANIC
Warning klaxon.
Timer turns red.
CRT border pulses.
Target speed increases 10%.
Score multiplier increases 25%.
Spawn rhythm feels more frantic.

Large text flashes briefly:
TUNNEL PANIC

At 00:00, disable new launches immediately. Allow already-fired chickens to register collisions for 500ms, then freeze scoring.

## Scene 5 — Hit Reaction

Every valid hit:
- 80ms impact freeze;
- comic impact word;
- feather/pixel/sludge burst;
- normal face immediately becomes the next angry variation;
- rat leaves its lane in knockback;
- angry head/body shakes for exactly 2 seconds while airborne;
- face then switches to the next crying variation;
- target spins/fades/falls out over about 800ms;
- combo and score pop near impact point.

Never immediately repeat an angry or crying variation when more than one exists.

## Scene 6 — Results

CRT shutter closes and reopens on a scorecard.

Show:
- CALLSIGN
- SCORE
- DIFFICULTY
- HITS
- SHOTS
- ACCURACY
- BEST COMBO
- most-used chicken
- NEW HIGH SCORE badge if applicable

Animate the score counting upward quickly.

Success message:
SCORE FILED WITH MUNICIPAL AUTHORITIES

Network failure:
LOCAL SCORE SAVED — NETWORK RAT ATE THE PAPERWORK

Keep a failed score submission in localStorage and retry from the menu.

Buttons:
- PLAY AGAIN
- CHANGE DIFFICULTY
- MAIN MENU

## Scene 7 — Leaderboard Return

The refreshed leaderboard animates the player's row into place.

If the score is outside top 10, show:
YOUR RANK: #N

Still display the top 10.

Filters:
- ALL
- EASY
- MEDIUM
- HARD
