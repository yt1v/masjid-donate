-- Run this in Supabase SQL Editor (https://supabase.com → SQL Editor)
-- Safe to run multiple times — uses IF NOT EXISTS throughout

create table if not exists donations (
  id bigint primary key generated always as identity,
  donor_name text,
  is_anonymous boolean not null default false,
  amount numeric(10,2) not null,
  source text not null check (source in ('bkash', 'nagad', 'bank')),
  transaction_id text,
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id bigint primary key generated always as identity,
  category text not null,
  amount numeric(10,2) not null,
  description text,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Allow public read access (for the transparency page)
alter table donations enable row level security;
alter table expenses enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'donations' and policyname = 'Public can read donations'
  ) then
    create policy "Public can read donations" on donations for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'expenses' and policyname = 'Public can read expenses'
  ) then
    create policy "Public can read expenses" on expenses for select using (true);
  end if;
end $$;

-- Service role (used by admin API) bypasses RLS automatically

-- Feedback / comments table
create table if not exists feedback (
  id bigint primary key generated always as identity,
  name text,
  message text not null,
  type text not null check (type in ('comment', 'report', 'suggestion')),
  created_at timestamptz not null default now()
);

alter table feedback enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'feedback' and policyname = 'Anyone can insert feedback'
  ) then
    create policy "Anyone can insert feedback" on feedback for insert with check (true);
  end if;
end $$;
