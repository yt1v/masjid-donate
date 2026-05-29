-- Run this in Supabase SQL Editor (https://supabase.com → SQL Editor)

create table donations (
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

create table expenses (
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

create policy "Public can read donations" on donations for select using (true);
create policy "Public can read expenses" on expenses for select using (true);

-- Service role (used by admin API) bypasses RLS automatically
