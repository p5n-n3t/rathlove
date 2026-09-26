# Build Status

Current phase: specification / pre-v0 setup

Completed:
- canonical asset optimization
- asset hierarchy normalization
- asset manifest refresh
- new bonus/mood-basket/graffiti/icon assets added
- Figma component-library inspection
- product-decision interview round 1
- v0 recovery protocol defined

Not yet completed:
- final scoring formula research
- final Mood Basket charge/availability rule
- final leaderboard identity model
- 90-second cinematic script rewrite
- final GAME_DESIGN.md rewrite
- final STORYBOARD.md rewrite
- final V0_MASTER_PROMPT.md rewrite
- Supabase schema rewrite/migration
- successful initial GitHub transport sync

Known issue:
- local git smart-HTTP push to https://github.com/p5n-n3t/rathlove.git stalls before the remote receives the pack even though GitHub API/permissions are valid.

Next exact task:
- resolve remaining design choices, then research and lock scoring/physics/anti-cheat/mobile mechanics before rewriting implementation docs.

Required environment variable names:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_SECRET_KEY
- SUPABASE_DB_PASSWORD
