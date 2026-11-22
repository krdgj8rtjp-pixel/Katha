-- Katha cloud sync: one row of progress per user.
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Each signed-in user can only see and change their own row.
drop policy if exists "read own progress" on public.progress;
create policy "read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "insert own progress" on public.progress;
create policy "insert own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "update own progress" on public.progress;
create policy "update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Friends & weekly leaderboard (migration "friends_and_leaderboard").

-- Public profile shown to friends: name, avatar, weekly XP, streak.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 40),
  avatar text not null default 'aliya' check (avatar ~ '^[a-z]{2,12}$'),
  friend_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  xp_total integer not null default 0 check (xp_total >= 0),
  xp_week integer not null default 0 check (xp_week >= 0),
  week text not null default '' check (char_length(week) <= 12),
  streak integer not null default 0 check (streak >= 0),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Who follows whom.
create table if not exists public.follows (
  follower uuid not null references auth.users(id) on delete cascade,
  followee uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower, followee),
  check (follower <> followee)
);
alter table public.follows enable row level security;
create index if not exists follows_followee_idx on public.follows (followee);

create policy "follows: read own" on public.follows for select to authenticated
  using (follower = (select auth.uid()) or followee = (select auth.uid()));
create policy "follows: add own" on public.follows for insert to authenticated
  with check (follower = (select auth.uid()));
create policy "follows: remove own" on public.follows for delete to authenticated
  using (follower = (select auth.uid()));

-- You can see your own profile and anyone you follow or who follows you.
create policy "profiles: read self and friends" on public.profiles for select to authenticated using (
  id = (select auth.uid())
  or exists (select 1 from public.follows f where f.follower = (select auth.uid()) and f.followee = profiles.id)
  or exists (select 1 from public.follows f where f.followee = (select auth.uid()) and f.follower = profiles.id)
);
create policy "profiles: insert self" on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy "profiles: update self" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Look someone up by their friend code without exposing every profile.
create or replace function public.find_friend(code text)
returns table (id uuid, name text, avatar text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.name, p.avatar from public.profiles p
  where p.friend_code = upper(trim(code)) and p.id <> (select auth.uid())
  limit 1;
$$;
revoke all on function public.find_friend(text) from public, anon;
grant execute on function public.find_friend(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Friend suggestions (migration "friend_suggestions").

-- People can opt out of appearing in friend suggestions (Profile → Settings).
alter table public.profiles add column if not exists suggest boolean not null default true;

-- Friends of friends: people connected (either follow direction) to someone you follow
-- or who follows you, that you don't already follow and who don't already follow you.
-- Returns only name and avatar, plus how many of your friends they know and one friend's name.
create or replace function public.suggest_friends()
returns table (id uuid, name text, avatar text, mutual integer, via text)
language sql stable security definer set search_path = '' as $$
  with me as (select (select auth.uid()) as uid),
  circle as (
    select f.followee as cid from public.follows f, me where f.follower = me.uid
    union
    select f.follower from public.follows f, me where f.followee = me.uid
  ),
  links as (
    select f.followee as cand, f.follower as via from public.follows f join circle c on f.follower = c.cid
    union
    select f.follower, f.followee from public.follows f join circle c on f.followee = c.cid
  )
  select p.id, p.name, p.avatar, count(distinct l.via)::int as mutual,
         (array_agg(v.name order by v.name) filter (where coalesce(v.name, '') <> ''))[1] as via
  from links l
  join public.profiles p on p.id = l.cand
  left join public.profiles v on v.id = l.via
  cross join me
  where me.uid is not null
    and l.cand <> me.uid
    and p.suggest
    and not exists (select 1 from public.follows f where f.follower = me.uid and f.followee = l.cand)
    and not exists (select 1 from public.follows f where f.followee = me.uid and f.follower = l.cand)
  group by p.id
  order by mutual desc, p.xp_week desc, p.name
  limit 12;
$$;
revoke all on function public.suggest_friends() from public, anon;
grant execute on function public.suggest_friends() to authenticated;
