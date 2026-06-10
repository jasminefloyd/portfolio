-- Fix RLS policy for events table
-- The original "anon_insert_events" policy was using incorrect syntax that prevented anon INSERTs
-- This migration recreates it with the correct syntax

-- Drop the broken policy
drop policy if exists "anon_insert_events" on public.events;

-- Create the correct policy allowing anon to insert
create policy "anon_insert_events"
  on public.events
  for insert to anon
  with check (true);
