# RATLOVE

**RATH-A-MOLE** is a playable retro-futurist sewer slingshot arcade game for **ratlove.me**. RATLOVE is the site and brand; Rathbone / Rathlove is the hero.

The Next.js app hosts a 90-second, skippable intro, an arcade menu and setup, a Phaser sewer round, results, and a connected Supabase leaderboard. See `docs/BUILD_STATUS.md` for what is complete and what remains.

## Start here

1. Read `docs/PRODUCT_DECISIONS.md` and `docs/BUILD_STATUS.md`.
2. Read `docs/GAME_DESIGN.md` and `docs/STORYBOARD.md`.
3. Asset paths and counts are in `docs/ASSET_MANIFEST.md` and `src/data/assets.json`.
4. Gameplay settings live in `src/data/game-config.ts` and `src/game/systems/rules.ts`.
5. The applied Supabase schema is mirrored in `supabase/schema.sql`.
6. `docs/V0_MASTER_PROMPT.md` is the continuation brief, not a replacement for the live code.

## Architecture

- Next.js App Router + TypeScript
- React UI
- Phaser 4 game canvas
- Supabase public leaderboard
- Canonical assets in `public/assets/`

Do not regenerate or replace the supplied image assets.

## Project identity

- Game: RATH-A-MOLE
- Brand/site: RATLOVE / ratlove.me
- Hero: Rathbone / Rathlove
- Current supplied targets: 7
- Round length: 90 seconds
- Intro: about 90 seconds, separate from the round
- Sewer transition: about 6 seconds
