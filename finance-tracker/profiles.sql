create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  dashboard_card_visibility jsonb not null default '{"currentMonthSpend": true, "latestGoals": true, "quickReminders": true, "recentActivity": true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

alter table public.profiles
  add column if not exists avatar_url text;

alter table public.profiles
  add column if not exists dashboard_card_visibility jsonb not null default '{"currentMonthSpend": true, "latestGoals": true, "quickReminders": true, "recentActivity": true}'::jsonb;

drop policy if exists "Users can read their own profiles" on public.profiles;
create policy "Users can read their own profiles"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can insert their own profiles" on public.profiles;
create policy "Users can insert their own profiles"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update their own profiles" on public.profiles;
create policy "Users can update their own profiles"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

update public.profiles
set dashboard_card_visibility = coalesce(
  dashboard_card_visibility,
  '{"currentMonthSpend": true, "latestGoals": true, "quickReminders": true, "recentActivity": true}'::jsonb
);
