-- Ensure all required columns exist in visitors table
alter table public.visitors
  add column if not exists state text,
  add column if not exists user_id text,
  add column if not exists utm_term text,
  add column if not exists utm_content text;

-- Create indexes if they don't exist
create index if not exists idx_visitors_user_id on public.visitors(user_id);
create index if not exists idx_visitors_state on public.visitors(state);
