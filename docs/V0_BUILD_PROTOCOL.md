# v0 Build Recovery & Handoff Protocol

## Goal

Minimize lost work if a v0 credit balance is exhausted, a chat fails mid-generation, or development must move to another v0 account.

## Source of truth

1. GitHub repository is the durable source of record.
2. Every v0 chat should operate on its own Git branch.
3. Keep main stable enough to recover from.
4. Use docs/BUILD_STATUS.md as the machine-readable/human-readable handoff state.
5. Never rely on chat memory as the only record of architectural decisions.

## Important v0 behavior

Current v0 supports importing an existing GitHub repository and creates isolated chat branches with Git-backed work. Treat that branch as disposable development state and GitHub as the recovery boundary.

## Execution philosophy

Do NOT spend an entire credit balance on one giant unbounded generation.

The full product specification can be large, but implementation work should be executed as bounded milestones. Each milestone must:
1. read the authoritative docs;
2. implement only its defined slice;
3. run build/type/runtime checks relevant to that slice;
4. update docs/BUILD_STATUS.md;
5. leave the branch in a coherent state;
6. allow the next chat/account to continue without reconstructing intent from conversation history.

## Milestone order

M0 — Repository/bootstrap
- dependency install
- Next.js/TypeScript baseline
- asset validation
- environment validation
- Supabase connectivity check
- build passes

M1 — Application state architecture
- typed app/game state machine
- intro/menu/setup/transition/game/results states
- shared event bus/store
- responsive shell
- desktop/mobile layout profiles

M2 — Intro cinematic engine
- 90-second timeline controller
- New Orleans-inspired scrolling city scene
- supplied hero/props/graffiti/icons
- text/narration timing
- sound layer
- skip/replay behavior

M3 — Main menu UI
- title composition
- callsign flow
- difficulty flow
- options
- help/rules
- leaderboard shell
- Figma-derived reusable UI primitives

M4 — Sewer scene foundation
- Phaser scene
- sewer tilemap/environment
- four ratways
- sludge/steam/drips/lighting/particles
- slingshot + bucket placement

M5 — Sling/projectile physics
- mouse + touch pull
- launch force
- gravity
- trajectory prediction on Easy
- chicken classes
- responsive scaling
- input sensitivity

M6 — Rat target system
- procedural/composed rat bodies
- supplied head shuffle-bags
- speeds/evasion
- angry/crying hit lifecycle
- kippah attachment/modifier

M7 — Special systems
- Mood Basket behavior
- Trump Bonus exactly twice/round
- AoE collision
- bonus visual effects

M8 — Scoring + telemetry
- deterministic score function
- combo/precision/difficulty modifiers
- score breakdown
- event/run telemetry
- HUD

M9 — Supabase leaderboard
- schema/migrations
- server-side run/session submission
- public reads
- ranking/filtering
- anti-cheat plausibility checks
- failed submission queue

M10 — Results + replay
- results screen
- high-score feedback
- retry/replay flows
- session reset correctness

M11 — Mobile-specific game pass
- dedicated landscape HUD
- touch affordances
- safe areas
- fullscreen request
- rotate-device handling
- portrait menu polish

M12 — Polish/testing
- audio
- performance
- asset preload
- visual effects
- accessibility
- error handling
- production build
- acceptance checklist

## BUILD_STATUS.md format

After each milestone, update:
- current milestone
- completed milestones
- active branch
- build status
- known bugs
- schema/migration state
- required env vars by NAME ONLY
- next exact task
- files most recently changed
- any manual steps still required

## Cross-account handoff

If the active v0 account runs out of credit:
1. Do not recreate the project.
2. Use the GitHub branch containing the latest v0 work.
3. Import the same repository in the next v0 account.
4. Point the new chat at PRODUCT_DECISIONS.md, GAME_DESIGN.md, STORYBOARD.md, ASSET_MANIFEST.md, BUILD_STATUS.md, and the master build prompt.
5. Ask it to resume from the first incomplete milestone listed in BUILD_STATUS.md.

## Secrets

Do not commit .env or .env.local.
Configure Supabase/Vercel secrets through v0/Vercel environment settings or the Supabase integration.
Only variable names belong in .env.example.
