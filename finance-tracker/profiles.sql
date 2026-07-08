alter table public.profiles
  add column if not exists avatar_url text;

alter table public.profiles
  add column if not exists dashboard_card_visibility jsonb not null default '{"totalBalance": true, "monthlyIncome": true, "monthlySpend": true, "savingsRate": true}'::jsonb;

update public.profiles
set dashboard_card_visibility = coalesce(
  dashboard_card_visibility,
  '{"totalBalance": true, "monthlyIncome": true, "monthlySpend": true, "savingsRate": true}'::jsonb
);
