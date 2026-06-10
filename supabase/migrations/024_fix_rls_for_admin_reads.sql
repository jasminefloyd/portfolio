-- Fix RLS policies to allow admin reads
-- The original policies were too restrictive. This migration:
-- 1. Drops problematic policies
-- 2. Creates new policies that allow anon to read all analytics tables

-- Drop old INSERT policies that have wrong syntax
drop policy if exists "anon_insert_visitors" on public.visitors;
drop policy if exists "anon_insert_events" on public.events;
drop policy if exists "anon_insert_messages" on public.messages;

-- Create proper INSERT policies
create policy "anon_insert_visitors"
  on public.visitors
  for insert to anon
  with check (true);

create policy "anon_insert_events"
  on public.events
  for insert to anon
  with check (true);

create policy "anon_insert_messages"
  on public.messages
  for insert to anon
  with check (true);

-- Drop old SELECT policies that were too restrictive
drop policy if exists "authenticated_select_visitors" on public.visitors;
drop policy if exists "authenticated_select_events" on public.events;
drop policy if exists "authenticated_select_messages" on public.messages;

-- Create SELECT policies for anon (needed for admin dashboard)
create policy "anon_select_visitors"
  on public.visitors
  for select to anon
  using (true);

create policy "anon_select_events"
  on public.events
  for select to anon
  using (true);

create policy "anon_select_messages"
  on public.messages
  for select to anon
  using (true);

-- Drop old UPDATE policy
drop policy if exists "authenticated_update_messages" on public.messages;

-- Create UPDATE policy for anon
create policy "anon_update_messages"
  on public.messages
  for update to anon
  with check (true);
