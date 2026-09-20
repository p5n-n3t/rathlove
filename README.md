# RATLOVE

Retro-futurist sewer slingshot arcade game for **ratlove.me**.

This repository is structured so it can be imported into v0 and built as a Next.js application around the supplied canonical assets.

## Start here

1. Read `docs/V0_MASTER_PROMPT.md`.
2. Read `docs/STORYBOARD.md`.
3. Read `docs/GAME_DESIGN.md`.
4. Asset paths and counts are in `docs/ASSET_MANIFEST.md` and `src/data/assets.json`.
5. Gameplay constants are in `src/data/game-config.ts`.
6. Supabase schema is in `supabase/schema.sql`.

## Architecture

- Next.js App Router + TypeScript
- React UI
- Phaser 4 game canvas
- Supabase public leaderboard
- Canonical assets in `public/assets/`

Do not regenerate or replace the supplied image assets.

## Project identity

- Game: RATLOVE
- Site: ratlove.me
- Hero: Rathbone / Rathlove
- Current supplied targets: 7
- Round length: 90 seconds
- Intro: about 30 seconds
- Sewer transition: about 6 seconds
