-- RATLOVE leaderboard schema.
-- Public clients may read leaderboard rows, but may NOT insert/update/delete them.
-- Score submission should happen only through a Next.js server route/action using a
-- server-only Supabase secret/service-role credential.

create extension if not exists pgcrypto;

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  consumed boolean not null default false
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.game_sessions(id) on delete cascade,
  player_name varchar(16) not null check (char_length(trim(player_name)) between 1 and 16),
  score integer not null check (score between 0 and 9999999),
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  hits integer not null default 0 check (hits >= 0),
  shots integer not null default 0 check (shots >= 0),
  best_combo integer not null default 0 check (best_combo >= 0),
  accuracy numeric(5,2) not null default 0 check (accuracy >= 0 and accuracy <= 100),
  created_at timestamptz not null default now()
);

create index if not exists scores_score_desc_idx
  on public.scores (score desc, created_at asc);

create index if not exists scores_difficulty_score_idx
  on public.scores (difficulty, score desc, created_at asc);

alter table public.game_sessions enable row level security;
alter table public.scores enable row level security;

revoke all on table public.game_sessions from anon, authenticated;
revoke all on table public.scores from anon, authenticated;

grant select on table public.scores to anon, authenticated;

drop policy if exists "Public leaderboard read" on public.scores;
create policy "Public leaderboard read"
on public.scores
for select
to anon, authenticated
using (true);

-- game_sessions intentionally has no public policies.
-- scores intentionally has no public INSERT/UPDATE/DELETE policies.
-- The server route creates sessions and scores using the server-only secret key.
