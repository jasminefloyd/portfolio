-- Final RLS fix: Ensure anon can read all analytics tables
-- This migration disables RLS entirely for dev/testing
-- In production, use proper authenticated access

-- Disable RLS on all analytics tables
alter table public.visitors disable row level security;
alter table public.events disable row level security;
alter table public.messages disable row level security;

-- Re-enable RLS but with permissive policies
alter table public.visitors enable row level security;
alter table public.events enable row level security;
alter table public.messages enable row level security;

-- Drop all existing policies to start fresh
drop policy if exists "anon_insert_visitors" on public.visitors;
drop policy if exists "anon_select_visitors" on public.visitors;
drop policy if exists "authenticated_select_visitors" on public.visitors;

drop policy if exists "anon_insert_events" on public.events;
drop policy if exists "anon_select_events" on public.events;
drop policy if exists "authenticated_select_events" on public.events;

drop policy if exists "anon_insert_messages" on public.messages;
drop policy if exists "anon_select_messages" on public.messages;
drop policy if exists "anon_update_messages" on public.messages;
drop policy if exists "authenticated_select_messages" on public.messages;
drop policy if exists "authenticated_update_messages" on public.messages;

-- Create new permissive policies that actually work
-- Visitors: allow anon to insert (tracking) and select (admin)
create policy "visitors_anon_insert"
  on public.visitors
  for insert
  to anon
  with check (true);

create policy "visitors_anon_select"
  on public.visitors
  for select
  to anon
  using (true);

-- Events: allow anon to insert (tracking) and select (admin)
create policy "events_anon_insert"
  on public.events
  for insert
  to anon
  with check (true);

create policy "events_anon_select"
  on public.events
  for select
  to anon
  using (true);

-- Messages: allow anon to insert (contact form), select (admin), and update (mark read)
create policy "messages_anon_insert"
  on public.messages
  for insert
  to anon
  with check (true);

create policy "messages_anon_select"
  on public.messages
  for select
  to anon
  using (true);

create policy "messages_anon_update"
  on public.messages
  for update
  to anon
  with check (true);
