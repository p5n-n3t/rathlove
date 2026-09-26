# RATLOVE / RATH-A-MOLE — Locked Product Decisions

This file captures decisions confirmed by the project owner before the master v0 implementation prompt is rewritten.

## Naming

- Brand/site identity: RATLOVE / RathLove
- Protagonist: Rathbone, aka Rathlove
- Game title: RATH-A-MOLE
- Canonical spelling is always RATH-A-MOLE. Do not write Rat-A-Mole, Rathomol, Wrathomol, or other transcription variants.
- Final title composition should use the supplied Rathbone/RathLove logo assets, including the Koosh-letter Rathbone graphic, animated IN, main RathLove block-character logo, and rendered RATH-A-MOLE title treatment.
- The supplied Hasidic hat SVG is intended as a decorative title treatment on the first letter of the rendered game title when compositionally appropriate.

## Intro and round timing

- Intro cinematic: approximately 90 seconds.
- Intro is separate from gameplay.
- Main menu follows the cinematic.
- Player enters callsign and selects difficulty on the main-menu flow.
- Only after callsign + difficulty does the sewer-entry transition begin.
- Sewer transition should visibly show Rathbone entering the tunnel and rats beginning to appear.
- Gameplay round remains a separate timed round.
- Gameplay round duration remains 90 seconds unless superseded later.

## City setting

- The intro city should be unmistakably inspired by New Orleans, especially dense nighttime urban streets, balconies, mixed building sizes, shops, signage, cars, alleys, storefronts, street clutter, and active background incidents.
- It does not need to be a literal geographic reconstruction.
- The supplied graffiti assets must be integrated as real wall art using perspective/skew/distortion appropriate to each wall plane.
- Do not place identical graffiti pieces consecutively. Distribute the set across the city sequence.

## Intro narration

- Default approach approved: animated on-screen narration/captions, terminal text, title cards, environmental signage, music, and sound effects.
- No external voiceover dependency is required for the initial build.
- Narration should be funny, absurd, fast-moving, and story-driven.

## Main menu flow

Approved:
START GAME
→ CALLSIGN
→ DIFFICULTY
→ brief chicken/power-up reminder
→ ENTER THE RAT TUNNEL

Separate menu entries:
- LEADERBOARD
- OPTIONS
- HELP

Options should include audio, motion intensity/reduced-motion support, input sensitivity, and difficulty defaults while Start still confirms the chosen difficulty.

## Trump Bonus

- Trump Bonus is not a normal lane target.
- It appears exactly two times during each gameplay round.
- It appears briefly in random locations, peeking from behind scenery before exposing the full supplied body image.
- It does not travel along the four ratways.
- A successful direct or Mood Basket hit is allowed.
- Trump Bonus awards a very large fixed bonus, not a doubling of the player's entire accumulated score.
- It should be the single largest fixed-value special target bonus in the normal scoring system.
- On hit, use deliberately crude/amateur-looking spin/impact animation executed cleanly enough that the joke feels intentional.

## Target mechanics

- The seven named target characters remain mechanically equal as identities.
- Score differences come from the dynamic difficulty of the actual moving rat instance: speed, evasiveness, trajectory, reaction behavior, etc.
- Hitting any part of the rat body or supplied face counts as a successful hit.
- Do not require headshots.
- Projectile travel time must matter. The player leads moving rats rather than clicking directly on them for an instant hit.
- Rats receive a small reaction window to dodge/alter movement before impact.

## Kippah modifier

- Approximately 20% of ordinary rat spawns wear the supplied kippah SVG.
- The kippah must be transformed/scaled/positioned to sit naturally on the current head asset.
- A successful hit on a kippah-wearing rat is worth 4× that rat's calculated hit value.
- The modifier can stack with the normal score calculation and power-up effects unless a later balancing pass places an explicit cap.

## Mood Basket

- Mood Basket consists of four supplied cat images near the slingshot.
- They should remain lively: jiggling, hopping, glitching, swapping positions, and crowding around one another.
- A launched Mood Basket acts as an area-of-effect projectile.
- It can damage ordinary rats, kippah rats, and Trump Bonus.
- Blast scoring should be based on the number and difficulty of targets actually hit.
- Final charge/availability rules remain to be locked after explaining scarcity/balance options.

## Leaderboard identity

- No conventional account/login system is currently desired.
- Final identity model still needs to balance old-school arcade behavior with returning-player recognition.
- Do not aggregate runs solely by visible callsign because duplicate names such as ALEX can belong to different people.

## Mobile

- One web application, not a separate native app.
- Desktop/laptop is the primary initial implementation.
- Mobile should receive an intentionally composed mobile game presentation, not merely a shrunken responsive desktop site.
- Portrait UI can support menus/leaderboards.
- Gameplay should be designed primarily for landscape orientation with a dedicated mobile-landscape HUD/control layout.

## Figma design reference

Figma file key:
1VXBfWeG55khKhxzC6STm0

The connected Figma file currently exposes one top-level page named Components. Useful systems found include:
- buttons with default/hover/pressed/inactive states
- fixed/scalable modals
- leaderboard rows
- tables
- fields/forms
- toggles
- sliders
- progress bars/wheels
- navigation
- tabs
- cards
- toasts
- popups/drawers
- icon components

Use this file as a structural and interaction reference. Do not copy its visual identity unchanged. Reskin/adapt into RATLOVE's retro CRT/pixel/arcade aesthetic.

The current connector view does not expose separate desktop/mobile screen pages; if another Figma file contains those layouts, add its file key or node-specific links separately.
