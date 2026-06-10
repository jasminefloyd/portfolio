-- TEMPORARY: Allow all reads for testing
-- This is permissive for development only. In production, use proper auth.

-- Disable RLS temporarily to see if that's the issue
alter table public.visitors disable row level security;
alter table public.events disable row level security;
alter table public.messages disable row level security;
