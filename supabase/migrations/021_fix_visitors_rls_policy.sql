-- Fix RLS policy for visitors table for consistency
-- Update to use the same correct syntax as events table

-- Drop the old policy
drop policy if exists "anon_insert_visitors" on public.visitors;

-- Create the correct policy allowing anon to insert
create policy "anon_insert_visitors"
  on public.visitors
  for insert to anon
  with check (true);
