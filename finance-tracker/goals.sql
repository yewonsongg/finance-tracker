create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  due_date date,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create index if not exists goals_user_id_idx on public.goals (user_id);

drop policy if exists "Users can read their own goals" on public.goals;
create policy "Users can read their own goals"
on public.goals
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own goals" on public.goals;
create policy "Users can insert their own goals"
on public.goals
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own goals" on public.goals;
create policy "Users can update their own goals"
on public.goals
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own goals" on public.goals;
create policy "Users can delete their own goals"
on public.goals
for delete
to authenticated
using (auth.uid() = user_id);
