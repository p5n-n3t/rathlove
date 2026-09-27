# RATH-A-MOLE — Continuation Brief

This file replaces the obsolete original master prompt, which described a 30-second opening, treated RATLOVE as the game title, and fixed provisional scoring constants. Those directions are superseded.

Read, in order: `docs/PRODUCT_DECISIONS.md`, `docs/BUILD_STATUS.md`, `docs/GAME_DESIGN.md`, `docs/STORYBOARD.md`, `docs/ASSET_MANIFEST.md`, `docs/FIGMA_REFERENCE.md`, `src/data/assets.json`, `src/data/game-config.ts`, and `supabase/schema.sql`. Inspect actual assets and the current code. The canonical title is **RATH-A-MOLE**; RATLOVE is the site/brand. Use the existing Next.js/React/Phaser/Supabase implementation on the active development branch, not an unrelated new scaffold.

Do not reintroduce an account/signup screen. A browser cookie identifies anonymous players; duplicate callsigns are permitted. Never submit a client-supplied score or expose server keys. Follow the active scene/event schema and SQL contract. The database migrations were applied through the connected Supabase integration; do not reapply `schema.sql` to the same database.

Priority after this checkpoint: fix any browser-tested gameplay bugs; validate a complete 90-second scoring/result/leaderboard run; deepen the opening to an authored animated short that uses the full supplied asset roster; enrich sewer materiality and game feel; add robust touch/landscape handling, audio layers, accessibility, and harden server replay. See BUILD_STATUS for the exact next task and caveats.

Use Figma node pairs as structural/interaction references (loading, setup, settings, leaderboard, results) but retain the project's own CRT/municipal/sewer visual language; do not import the unrelated game's features or visual identity. Keep the original assets local. Make bounded, tested, Git-synced vertical milestones rather than one unreviewable rewrite.
