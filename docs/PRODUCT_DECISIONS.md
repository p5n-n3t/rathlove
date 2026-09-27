# RATLOVE / RATH-A-MOLE — Locked Product Decisions

This file captures decisions confirmed by the project owner before the master v0 implementation prompt is rewritten.

## Naming

- Brand/site identity: RATLOVE / RathLove
- Protagonist: Rathbone, aka Rathlove
- Game title: RATH-A-MOLE
- Canonical spelling is always RATH-A-MOLE. Do not write Rat-A-Mole, Rathomol, Wrathomol, or other transcription variants.
- Final title composition should use the supplied Rathbone/RathLove logo assets, including the Koosh-letter Rathbone graphic, animated IN, main RathLove block-character logo, and rendered RATH-A-MOLE title treatment.
- Supplied title art is canonical. Do not use religious symbols as scoring incentives or as a visual shorthand for a target's worth.

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

## Target score modifiers

- Do not reward hitting a religious accessory. Instance value derives from movement and difficulty, independent of religion or depicted identity. A future neutral nonreligious special marker may be designed if an extra rarity mechanic is needed.

## Mood Basket

- Mood Basket consists of four supplied cat images near the slingshot.
- They should remain lively: jiggling, hopping, glitching, swapping positions, and crowding around one another.
- A launched Mood Basket acts as an area-of-effect projectile.
- It can hit ordinary targets and the off-lane bonus target.
- Blast scoring should be based on the number and difficulty of targets actually hit.
- Current rule: four total charges per round, one per supplied cat visual, each shot can affect up to five distinct targets. This keeps chickens central. Rebalance after observed playtests.

## Leaderboard identity

- No conventional account/login system is currently desired.
- Identity: random anonymous UUID in a same-site HttpOnly browser cookie. Callsign is display text, not a unique key; each run has its own session ID. Cross-device linking requires explicit future account/PIN design, not accidental callsign matching.
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

The connected file is multi-page. Desktop/mobile screen pairs for Loading, Login/Create Account, Settings, Leaderboard, and Stats were inspected directly in the initial build. Exact IDs are in `FIGMA_REFERENCE.md`. Buttons, rows, forms, drawers, tables and modals are structural donors, not art to copy. No account system is introduced. RATLOVE uses a distinct CRT / municipal sewer treatment.
