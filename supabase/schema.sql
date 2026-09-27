-- RATLOVE arcade schema. Applied to the connected project as create_arcade_runs
-- record_verifiable_run_events, allow_area_hits_in_score_runs,
-- measure_successful_shot_accuracy, and restrict_private_score_columns.
-- This file is the reproducible fresh-install state.
create extension if not exists pgcrypto;

create table public.arcade_players (
  id uuid primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.arcade_players(id),
  callsign varchar(16) not null check (char_length(trim(callsign)) between 1 and 16),
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  seed integer not null,
  bonus_seconds integer[] not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  consumed boolean not null default false
);
create index game_sessions_player_idx on public.game_sessions(player_id,started_at desc);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.game_sessions(id),
  player_id uuid not null references public.arcade_players(id),
  callsign varchar(16) not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  score integer not null check (score between 0 and 200000),
  hits integer not null check (hits between 0 and 500),
  shots integer not null check (shots between 0 and 500),
  best_combo integer not null check (best_combo between 0 and 500),
  accuracy numeric(5,2) not null check (accuracy between 0 and 100),
  events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index scores_rank_idx on public.scores(score desc,created_at asc,id);
create index scores_difficulty_rank_idx on public.scores(difficulty,score desc,created_at asc,id);

alter table public.arcade_players enable row level security;
alter table public.game_sessions enable row level security;
alter table public.scores enable row level security;
revoke all on public.arcade_players,public.game_sessions,public.scores from anon,authenticated;
grant select,insert,update,delete on public.arcade_players,public.game_sessions,public.scores to service_role;

-- All three tables intentionally have no public policies. The Next.js leaderboard
-- route exposes only public fields; anonymous IDs and event logs remain private.
-- Only a server holding the service role may create or complete a run.
create function public.complete_arcade_run(p_session_id uuid,p_player_id uuid,p_score integer,p_hits integer,p_shots integer,p_best_combo integer,p_events jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare s public.game_sessions%rowtype; new_score_id uuid; successful_shots integer;
begin
  select * into s from public.game_sessions where id=p_session_id and player_id=p_player_id for update;
  if not found or s.consumed or now()-s.started_at < interval '89 seconds' or now()-s.started_at > interval '4 minutes' then raise exception 'Invalid or expired run'; end if;
  if p_score < 0 or p_score > 200000 or p_hits < 0 or p_hits > p_shots * 5 or p_shots < 0 or p_shots > 500 or p_best_combo < 0 or p_best_combo > p_hits or jsonb_typeof(p_events) <> 'array' or jsonb_array_length(p_events) > 950 then raise exception 'Invalid run statistics'; end if;
  select count(distinct (e->>'shotId')::integer) into successful_shots from jsonb_array_elements(p_events) e where e->>'type'='hit';
  insert into public.scores(session_id,player_id,callsign,difficulty,score,hits,shots,best_combo,accuracy,events)
  values(s.id,s.player_id,s.callsign,s.difficulty,p_score,p_hits,p_shots,p_best_combo,case when p_shots=0 then 0 else round(successful_shots::numeric*100/p_shots,2) end,p_events)
  returning id into new_score_id;
  update public.game_sessions set consumed=true,completed_at=now() where id=s.id;
  return new_score_id;
end $$;
revoke all on function public.complete_arcade_run(uuid,uuid,integer,integer,integer,integer,jsonb) from public,anon,authenticated;
grant execute on function public.complete_arcade_run(uuid,uuid,integer,integer,integer,integer,jsonb) to service_role;
