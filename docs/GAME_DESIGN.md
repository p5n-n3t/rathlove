# RATH-A-MOLE — Game Design and Technical Contract

RATLOVE is the brand and site. **RATH-A-MOLE** is always the game title. Rathbone (Rathlove) is its unlikely hired hero. The hard product decisions in `PRODUCT_DECISIONS.md` and the current brief outrank older provisional values. This document describes the first playable implementation and its explicit next passes.

## The arcade fantasy

A New Orleans-inspired city has an absurd rat crisis. A broken municipal CRT introduces Rathbone, then the player descends into the sewer with a chicken sling. 90 seconds of target leading, four horizontal ratways, a rare special visitor, four limited-use Mood Basket cats, and a scored run end in a public arcade table. The world is low-fi by choice; input, compositing, accessibility, and response should not be.

## State and runtime

`INTRO (90s, skippable) → MENU → SETUP (callsign + difficulty) → DESCENT (~6s) → PLAYING (90s active time) → RESULTS → LEADERBOARD/REPLAY`. The Next.js client shell owns coarse phases, options, and network requests. `RoundScene` owns Phaser rendering, input, target views, and visual effects. Pure `src/game/systems/rules.ts` owns seeded target descriptors, spawn times, projectile coordinates, scoring and server validation. React receives throttled HUD snapshots; it never controls individual sprites per frame. The scene is dynamically imported and destroyed when the phase ends.

### Camera and responsive profiles

The world is 1600×900 with FIT scaling. On desktop, HUD sits above and selectors below the canvas. On landscape phones the same game view has larger accessible DOM selectors; on portrait phones, game rendering pauses behind a custom Rotate Device surface. Portrait remains usable for menus, setup, results and leaderboard. Safe-area control placement and orientation API behavior need a dedicated device pass.

## Physics and targets: current implementation

The sling anchor is (800,748). Pointer/touch presses near the loaded chicken, drags down/back (max 190 world pixels), and releases. Velocity opposes drag; a 680-units/s² ballistic gravity bends the flight. Pulling farther increases speed from 750 to 1850 units/s before chicken multiplier. Flight time matters: targets move during flight. Heavy: 0.78× speed, 22px intended radius and max two targets. Balanced: 1× speed, one target. Fast: 1.3× speed, one target. The selected sprite is the supplied SVG; no generic substitute is used. Keyboard 1/2/3/4 selects chicken or cat. Input sensitivity affects the drag response.

The connected registry lists seven identities and every available normal/angry/crying image. Identity carries no point value; target *instances* have seeded lane, direction, speed, volatility, spawn time and normal-face shuffle bag. On hit, change to angry, fly for ~2s, change to crying, then despawn. No headshot requirement. Current implementation uses seeded simple horizontal motion with bob; meaningful aim-aware evasion and dedicated movement families remain a subsequent gameplay pass.

A Mood Basket cat is a 4-charge-per-round area projectile. Its radius is approximately 218 world units and it can hit at most five unique targets. The original four art assets rotate through the four charges. A special bonus appears exactly twice per round at server-issued times; it is not a ratway target, has a 3.7-second window, and pays a fixed 2,200 points. The same special can be hit with a chicken or cat. Its flight animation is intentionally silly. A protected religious accessory is not a score modifier; score depends on gameplay difficulty rather than any protected trait.

## Score formula

For ordinary targets, value is `round((125 + round(speed × .62 + (volatile ? 34 : 0))) × difficulty × projectile × streak × panic)`. Difficulty multipliers: easy 1, medium 1.5, hard 2.25. Projectile multiplier: heavy 1.15, balanced 1, fast 1.25, cat .85. Streak: `1 + min(combo,8) × .07`, renewed by a hit within 2.5 seconds. Panic in the last 15 seconds: 1.2. Special bonus: fixed 2,200. Scores naturally reach thousands. A miss does not subtract points; the 2.5-second chain window ends a streak. Accuracy is successful shots divided by shots, so an area hit on five targets counts as one accurate shot. All parameters live in `rules.ts`; legacy provisional constants in `game-config.ts` are not used by the scoring path and should be consolidated next.

## Anonymous identity and leaderboard

A hidden HttpOnly, same-site browser cookie holds a random UUID, separate from the visible, non-unique callsign. The server creates player and session rows in the connected Supabase project. Each run is a distinct score record; duplicate callsigns do not merge. Only validated server-side routes using a server secret can create or complete a run. RLS denies public access to all three tables, including the score table holding anonymous IDs and raw event logs. The browser calls a constrained, public leaderboard API that projects only rankable fields with all/easy/medium/hard filters.

The server receives an ordered shot/hit event log, recomputes the score, checks launch spacing, trajectory geometry against seeded targets and bonus windows, max hits/shot, four-cat scarcity, timing and one-time atomic completion through a Postgres RPC. This is **casual anti-cheat**, not tamper-proof competitive simulation: a determined attacker with the public seed can synthesize plausible inputs. Harden with server-side replay of fixed-step state, rate limits by IP, and abuse monitoring before prizes or high-stakes competition. The service role is server-only. SQL source is `supabase/schema.sql` and live migration names are in BUILD_STATUS.

## Sound and accessibility

Sound starts after user interaction; short synthesized shot/hit/bonus cues honor master and effects volume. Music/ambient layers, fullscreen preferences, saved settings, and durable failed-run retry remain incomplete. Respect prefers-reduced-motion at CSS level and the in-game reduced-motion setting for camera shake. Pointer buttons and forms have visible focus; leaderboard, options, help and results are DOM UI. Do not place text-heavy UI in the game canvas.

## Art direction and unfinished depth

Five-color UI family: wet ink `#080f11`, oxidized steel `#192a2b`, chalk `#d3dbc7`, phosphor `#a7eb29`, sodium lamp `#e9a440`. The signature is the collision of neon block-letter canonical title art and a convincing civic-sewer cross-section. The existing Phaser environment draws an arched tunnel, four grates, pipes, liquid and animated bubbles/steam without stock images. This is a foundation, not final art: add seamless wet masonry tiles, foreground occlusion, municipal debris, lighting, stronger active city incidents, parallax, and discreet motion after the core interaction is verified.
