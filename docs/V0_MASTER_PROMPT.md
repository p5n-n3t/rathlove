# MASTER PROMPT FOR V0

Build the complete RATLOVE game in this existing repository. Treat the repository contents as authoritative project context. Before changing code, inspect and follow:

- README.md
- docs/GAME_DESIGN.md
- docs/STORYBOARD.md
- docs/ASSET_MANIFEST.md
- src/data/assets.json
- src/data/game-config.ts
- supabase/schema.sql

Do not merely create a mockup. Implement a playable, polished game end-to-end.

## Non-negotiable project identity

- Product/game name: RATLOVE
- Intended domain: ratlove.me
- Hero/host: Rathbone, also styled Rathlove
- Round duration: exactly 90 seconds
- Intro duration: approximately 30 seconds and skippable
- Sewer transition: approximately 6 seconds
- Main aesthetic: 1980s CRT arcade + ASCII terminal + pixel art/glitch + filthy industrial sewer + futuristic digital corruption
- Keep the comedy surreal, cartoony, and non-gory.

There are currently SEVEN supplied gameplay target characters, not eight: Alan, Bibi, Daniela, Epstein, Loomer, Shmuley, and Trump. Do not invent an eighth target. Do not hard-code the engine to seven; generate the target registry from src/data/assets.json so another target can be added later.

## Canonical assets

All supplied assets under public/assets are canonical. Use exactly these files. Do not regenerate them, redraw them, substitute them with stock images, or silently omit them.

Use every asset under public/assets/intro at least once during the intro/attract presentation exactly as described in docs/STORYBOARD.md.

Use every target face variation through the data-driven shuffle-bag behavior in gameplay.

The three chicken SVGs are the only chicken projectile art:
- /assets/game/chickens/chicken-1.svg = HEAVY
- /assets/game/chickens/chicken-2.svg = BALANCED
- /assets/game/chickens/chicken-3.svg = FAST

The sewer, slingshot, chicken bucket, rat bodies, metal lanes, sludge, particles, typography, lighting, ASCII, and environmental decoration should be rendered procedurally with Phaser Graphics, SVG/CSS, and canvas effects. Do not add external stock imagery unless absolutely required, which it should not be.

## Technical architecture

Use:
- Next.js 16.x App Router
- TypeScript
- React for the application shell, intro overlays, menus, callsign/difficulty UI, leaderboard, HUD overlays, and results
- Phaser 4 for the active 2D game scene, physics, targets, projectile motion, collisions, particles, and procedural sewer rendering
- Supabase for the real public leaderboard

Phaser must be client-only. Dynamically import/initialize it so there are no SSR/window/document errors. Properly destroy the Phaser instance when leaving/restarting the game so hot reload and navigation never create duplicate canvases.

Create clean modules rather than putting the entire game into one page component. A reasonable organization is:
- app/
- components/intro/
- components/menu/
- components/game/
- components/results/
- lib/supabase/
- lib/leaderboard/
- src/game/scenes/
- src/game/entities/
- src/game/systems/
- src/data/

You may improve that hierarchy if useful.

## Main scene flow

Implement a finite application/game state flow:

BOOT
→ INTRO
→ MENU
→ PLAYER_SETUP
→ SEWER_TRANSITION
→ PLAYING
→ RESULTS
→ MENU/REPLAY

Do not let UI state and Phaser state drift out of sync. A small typed state machine/store is preferred.

### INTRO

Implement the complete roughly 30-second storyboard in docs/STORYBOARD.md. It must be visually elaborate, full screen, and skippable.

Required characteristics:
- CRT boot/opening effect
- terminal/ASCII diagnostic text
- all three pixel logos
- portrait-01 through portrait-05 with different decode/glitch reveals
- the three lips/title assets stacked in the specified top/middle/bottom relationship
- rathlove-block-characters behind them
- crown, earphones, mixtape, phone, StarTAC phone
- peeking cat must enter from the bottom and only reveal the portion appropriate to its cropped artwork
- reaching cat interacts with a pixel logo
- flying cat crosses the frame
- clean full-body Rathbone plus all four full-body glitch variations
- long-haired Trump prop as the brief surreal intro cameo described in the storyboard
- final RATLOVE title lock and ratlove.me

Use motion that feels authored rather than a slideshow. Use CSS transforms, masking, clip paths, pixel mosaics, scanline wipes, deliberate hard cuts, and a few tasteful glitch bursts.

Add SKIP INTRO. Store a local preference allowing repeat visitors to skip it automatically if they choose.

### MENU

Build a full-screen arcade attract menu:
- RATLOVE title
- START GAME
- live Top 10 leaderboard
- difficulty tabs/filter on leaderboard
- How To Play
- audio toggle
- subtle looping attract animation
- responsive keyboard and pointer navigation

Do not make this look like a generic SaaS dashboard. It should feel like the title screen of a lost 1980s arcade cabinet that somehow learned CSS in the future.

### PLAYER SETUP

The player does not create an account. Ask only for a CALLSIGN, 1–16 trimmed characters, then difficulty.

Difficulty choices are EASY, MEDIUM, HARD. Show the three real chicken SVGs and a short explanation of HEAVY, BALANCED, FAST before starting.

Primary action:
ENTER THE RAT TUNNEL

### SEWER TRANSITION

Implement the approximately 6-second descent exactly in docs/STORYBOARD.md:
- Rathbone approaches a tunnel/manhole
- camera dives down
- municipal infestation sign reflects chosen difficulty
- four sewer lanes assemble
- sludge/environment comes alive
- chicken bucket drops into place
- slingshot assembles from pixels
- READY / CLUCK / FIRE
- timer appears at 01:30

### ACTIVE GAME

Use a logical 1600×900 Phaser world and scale responsively.

Slingshot:
- anchored lower-center using the values from src/data/game-config.ts
- player presses/holds pointer on loaded chicken
- drag backward
- rubber band stretches visibly
- clamp drag at configured maximum pull
- power scales continuously with pull distance
- launch direction is opposite drag vector
- release launches
- support mouse and touch
- prevent browser scrolling/selection during active drag
- Easy shows a short predicted dotted trajectory; Medium/Hard do not

Bucket:
- beside the slingshot
- visually contains many tiny duplicated copies of the three real chicken SVGs
- unlimited ammunition
- click/tap a chicken type to select it
- keyboard 1/2/3 also selects
- reload the sling quickly after each shot

Chicken behavior MUST come from src/data/game-config.ts. Do not flatten all three types into cosmetic skins.

HEAVY:
- slow
- largest hit radius
- strongest knockback
- may continue through the first valid target and hit one second target
- visibly feels weighty

BALANCED:
- medium everything
- easiest neutral choice

FAST:
- fast
- smallest hit radius
- precision-oriented
- lower knockback
- visibly lighter/faster

### SEWER PLAYFIELD

Draw a detailed procedural sewer behind the targets:
- four horizontal grate/pipe/catwalk lanes
- circular tunnel architecture
- brick/concrete
- rusty pipes
- toxic sludge
- animated bubbles
- occasional steam vents
- dripping water
- broken warning signs
- tiny flies
- glowing eyes or mutant silhouettes in deep background
- electrical sparks
- parallax grime layers
- low-frequency CRT/environment flicker

The environment can be detailed, but target silhouettes and projectile trajectory must remain easy to read.

### RAT TARGETS

Build targets as composed Phaser containers:
- generic procedural rat body
- long tail
- tiny scrambling feet
- supplied transparent human head image attached where the rat head would be

Targets enter from left or right on one of four lanes and travel horizontally. Randomize target character, lane, speed, and initial direction within difficulty rules. Avoid ugly clumping by preventing too many targets from spawning at nearly the same x/lane/time.

Targets should lightly react to the player's live aim according to difficulty:
- bob/duck
- change pace
- accelerate away from projected intersection
- occasionally reverse when there is space
- panic jitter

This reaction is weak on Easy, moderate on Medium, strong on Hard. It must feel evasive, not psychic or unfair.

### FACE VARIATION ENGINE

This is mandatory and important.

Read all face arrays from src/data/assets.json.

For EVERY character and EACH state (normal, angry, crying), create an independent shuffle-bag.

A shuffle-bag:
1. contains every available file once;
2. shuffles order;
3. returns each item once before refilling;
4. remembers the previous item;
5. when refilling, avoids making the first new item identical to the last old item if more than one asset exists.

Normal state:
- while a target runs, change its normal face every random 240–460ms
- do not tie swapping to render frames
- all normal variations should naturally cycle over time

Hit:
- immediately choose next angry asset from that character's angry bag

Defeat continuation:
- after exactly 2 seconds of angry reaction, switch to next crying asset from that character's crying bag

If a character/state has only one asset, reuse it. Never fabricate missing variations.

### HIT REACTION

On a live projectile collision:
1. prevent duplicate scoring for the same target;
2. freeze/punch the action for around 80ms;
3. emit a procedural comic word such as KAPOW, SPLAT, BONK, CLUCK, or THWACK;
4. burst pixel squares, feathers, and stylized sludge particles;
5. switch normal head to angry immediately;
6. detach target from lane motion and fling the whole rat into a ballistic knockback arc based on projectile velocity;
7. shake/vibrate angry rat for exactly 2 seconds while it is airborne;
8. after 2 seconds, switch to crying;
9. continue spin/fall/fade for roughly 800ms;
10. fully despawn.

No gore. Keep the reaction comic and exaggerated.

### ROUND FLOW

Exactly 90 seconds.

Opening:
- show one-time hint HOLD + DRAG / RELEASE TO FIRE
- gently pulse chicken selector
- Easy gets trajectory line

Main phase:
- continue spawning within difficulty config
- environment gradually becomes busier
- do not silently increase difficulty beyond configured ranges

Final 15 seconds:
- trigger TUNNEL PANIC once
- red alert CRT pulse
- short warning klaxon
- target speed × 1.1
- score × 1.25
- faster-feeling spawn rhythm while respecting max target count
- brief TUNNEL PANIC text

At timer zero:
- stop accepting new launches immediately
- allow already-launched projectiles only 500ms to resolve collisions
- then freeze score and transition to results

### SCORING AND HUD

Use the constants in src/data/game-config.ts.

Score:
- base hit = 100 × difficulty multiplier × chicken multiplier
- precision bonus up to +50 based on impact distance from target center
- successful hits within the configured combo window grow combo
- miss resets combo
- combo bonus = +25 × combo level, capped by config
- HEAVY second-target pierce gets +150
- TUNNEL PANIC applies its configured score multiplier

Track:
- score
- shots
- hits
- accuracy
- best combo
- usage/hits by chicken type

HUD:
- upper-left: callsign + difficulty
- upper-center: large 01:30 countdown
- upper-right: score + combo
- bottom: three chicken selectors, current type, small speed/strength indicators, mute
- score/combo popups near impact points

### SUPABASE LEADERBOARD

Use the Supabase integration. Apply or adapt supabase/schema.sql.

No account/signup UI is wanted.

Leaderboard is publicly readable.

Score writes must NOT be done directly from an unrestricted browser client. Use a Next.js server route/server action with a server-only Supabase secret/service-role credential. Never expose that secret in NEXT_PUBLIC_* variables or return it to the client.

At the beginning of a real game round, create a game_sessions row server-side and return only its session UUID to the client.

At submission:
- session must exist
- session must be unused
- difficulty must match
- elapsed time must be plausible for a 90-second match
- score/hits/shots/combo must pass generous sanity bounds
- mark session consumed
- insert score transactionally or as safely as practical
- reject duplicate submissions

Public leaderboard UI:
- top 10 by default
- filters ALL / EASY / MEDIUM / HARD
- columns RANK / CALLSIGN / SCORE / DIFFICULTY / ACCURACY
- after a game, also retrieve/display the player's overall rank even if not top 10

If Supabase is not connected yet, keep the UI functional using a clearly isolated local mock adapter, but structure the code so connecting Supabase requires no UI rewrite. Prefer connecting Supabase during this build if the integration is available.

If score submission fails after a completed game:
- preserve the result in localStorage as a pending submission
- show: LOCAL SCORE SAVED — NETWORK RAT ATE THE PAPERWORK
- retry pending submission on later menu load

### RESULTS SCREEN

After each game show a CRT scorecard:
- callsign
- score
- difficulty
- hits
- shots
- accuracy
- best combo
- most-used chicken
- new-high-score indicator when applicable

Animate score tally quickly.

Actions:
- PLAY AGAIN
- CHANGE DIFFICULTY
- MAIN MENU

After successful submission:
SCORE FILED WITH MUNICIPAL AUTHORITIES

### AUDIO

Implement lightweight synthesized/procedural arcade audio with Web Audio where practical:
- CRT boot hum
- menu blip
- sewer bubbling ambience
- pipe clang
- slingshot stretch
- snap
- distinct chicken launch/cluck pitch for each type
- impact bonk/splat
- target reaction squeak/whine
- timer tick
- TUNNEL PANIC alert
- score tally

Respect browser autoplay restrictions. Initialize/resume AudioContext only after user interaction. Add mute and persist mute locally.

### VISUAL SYSTEM

This must not look like a generic modern web app.

Use:
- near-black CRT frame
- phosphor/toxic green
- dirty yellow/amber
- cyan
- warning red
- occasional magenta
- scanlines
- pixel/dither overlays
- ASCII noise
- chromatic aberration during transitions
- mosaic pixel reveals
- horizontal sync tears
- subtle barrel/vignette effect
- hard arcade typography
- mechanical sewer labels
- fluorescent toxic glow

Do not permanently blur/distort gameplay. Glitches should be punctuation, not visual sabotage.

Use image-rendering/pixel styling selectively. Preserve transparency and original aspect ratios of supplied WebP/SVG assets.

### RESPONSIVENESS

Desktop is the primary composition, but the game must work on touch devices.

- Scale the 1600×900 Phaser world to fit available viewport.
- Keep controls reachable.
- Handle devicePixelRatio sensibly.
- Do not reload huge duplicate textures.
- Preload canonical game textures before starting.
- Show an in-theme boot/loading progress bar if needed.
- Prevent layout shift when Phaser loads.
- Pause gameplay when the document becomes hidden; do not let pausing create extra round time.
- Respect prefers-reduced-motion by reducing heavy camera shake/glitch intensity without changing mechanics.

### ENGINEERING QUALITY

- TypeScript strict mode.
- Avoid giant monolithic files.
- Reuse data from assets.json and game-config.ts rather than duplicating filenames/constants in many components.
- Clean up timers, event listeners, Phaser scenes, AudioContext hooks, and requestAnimationFrame work.
- Avoid hydration errors.
- Avoid random values during server render.
- Handle missing assets with a visible developer warning, not silent failure.
- No console-error spam in normal play.
- Do not create fake placeholder face assets.
- Do not rename or delete canonical assets without a compelling technical reason.

### ACCEPTANCE CHECKLIST

Before declaring the build complete, verify all of these:

1. Intro can run start-to-finish and uses every file in public/assets/intro at least once.
2. Intro can be skipped.
3. Main menu shows a functioning leaderboard surface.
4. Player can enter a callsign and choose all three difficulties.
5. Sewer transition visibly moves from city/menu context into a sewer tunnel.
6. All four horizontal lanes are visible.
7. Slingshot drag distance changes launch strength.
8. Mouse and touch work.
9. Chicken 1/2/3 have measurably different behavior, not only different art.
10. Keyboard 1/2/3 changes chicken selection.
11. Targets use procedural rat bodies plus the exact supplied transparent head assets.
12. Target registry comes from assets.json.
13. All seven current characters can spawn.
14. Normal variations cycle without immediate repeats and eventually use every normal asset.
15. Angry variation appears immediately on hit.
16. Angry reaction lasts 2 seconds while target is being thrown away.
17. Crying variation appears after angry and before despawn.
18. Angry/crying shuffle-bags use all available variations before reuse where more than one exists.
19. Impact particles/comic text/audio work.
20. Timer lasts 90 seconds.
21. TUNNEL PANIC begins at 15 seconds remaining.
22. Score, combo, accuracy, hits, and shots update correctly.
23. Results screen works.
24. Supabase leaderboard read works when connected.
25. Score submission uses server-side credentials and one session may not submit twice.
26. Top-10 and difficulty filters work.
27. Failed score submission is queued locally for retry.
28. Replay does not create duplicate Phaser canvases/listeners.
29. No supplied canonical asset is silently replaced or ignored.
30. Production build succeeds.

Build the application, run the relevant checks/build, fix errors you encounter, and leave the repository in a deployable state. Favor a coherent finished game over decorative scaffolding or placeholder TODOs.
