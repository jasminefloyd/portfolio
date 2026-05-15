-- Portfolio Analytics Schema
-- Run this in your Supabase SQL editor to set up the database.

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists visitors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  ip_address text,
  country text,
  city text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  user_agent text
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  visitor_id uuid references visitors(id),
  event_type text not null check (event_type in ('resume_download', 'project_open')),
  project_id text,
  metadata jsonb
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false
);

-- ============================================================
-- RLS — Enable row level security on all tables
-- ============================================================

alter table visitors enable row level security;
alter table events enable row level security;
alter table messages enable row level security;

-- ============================================================
-- POLICIES
-- Anon: INSERT only (public site writes)
-- Authenticated: full SELECT (admin reads via service_role)
-- ============================================================

-- visitors
create policy "anon can insert visitors"
  on visitors for insert to anon with check (true);

create policy "authenticated can select visitors"
  on visitors for select to authenticated using (true);

-- events
create policy "anon can insert events"
  on events for insert to anon with check (true);

create policy "authenticated can select events"
  on events for select to authenticated using (true);

-- messages
create policy "anon can insert messages"
  on messages for insert to anon with check (true);

create policy "authenticated can select messages"
  on messages for select to authenticated using (true);

create policy "authenticated can update messages"
  on messages for update to authenticated using (true);
