-- Jasmine Portfolio - Initial Schema
-- Creates visitors, events, and messages tables with RLS

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: visitors
create table if not exists public.visitors (
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

-- Table: events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  visitor_id uuid references public.visitors(id) on delete cascade,
  event_type text check (event_type in ('resume_download', 'project_open', 'external_profile_click', 'profile_session')),
  project_id text,
  metadata jsonb
);

-- Table: messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false
);

-- Enable RLS on all tables
alter table public.visitors enable row level security;
alter table public.events enable row level security;
alter table public.messages enable row level security;

-- RLS Policies: visitors table
-- Anon can INSERT (tracking) but not SELECT
create policy "anon_insert_visitors" on public.visitors
  for insert
  with check (auth.role() = 'anon');

-- Authenticated can SELECT
create policy "authenticated_select_visitors" on public.visitors
  for select
  using (auth.role() = 'authenticated');

-- RLS Policies: events table
-- Anon can INSERT (tracking) but not SELECT
create policy "anon_insert_events" on public.events
  for insert
  with check (auth.role() = 'anon');

-- Authenticated can SELECT
create policy "authenticated_select_events" on public.events
  for select
  using (auth.role() = 'authenticated');

-- RLS Policies: messages table
-- Anon can INSERT (contact form) but not SELECT
create policy "anon_insert_messages" on public.messages
  for insert
  with check (auth.role() = 'anon');

-- Authenticated can SELECT
create policy "authenticated_select_messages" on public.messages
  for select
  using (auth.role() = 'authenticated');

-- Authenticated can UPDATE messages (mark as read)
create policy "authenticated_update_messages" on public.messages
  for update
  using (auth.role() = 'authenticated');

-- Create indexes for common queries
create index idx_visitors_created_at on public.visitors(created_at desc);
create index idx_visitors_country on public.visitors(country);
create index idx_events_created_at on public.events(created_at desc);
create index idx_events_visitor_id on public.events(visitor_id);
create index idx_events_event_type on public.events(event_type);
create index idx_events_project_id on public.events(project_id);
create index idx_messages_created_at on public.messages(created_at desc);
create index idx_messages_read on public.messages(read);
