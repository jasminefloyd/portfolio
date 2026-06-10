-- Disable RLS entirely on analytics tables for public access
-- These tables contain non-sensitive analytics data that should be readable by admin

alter table public.visitors disable row level security;
alter table public.events disable row level security;
alter table public.messages disable row level security;
