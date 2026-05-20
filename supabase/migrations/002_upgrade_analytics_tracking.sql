alter table public.visitors
  add column if not exists state text,
  add column if not exists user_id text,
  add column if not exists utm_term text,
  add column if not exists utm_content text;

alter table public.events drop constraint if exists events_event_type_check;
alter table public.events
  add constraint events_event_type_check
  check (event_type in ('resume_download', 'project_open', 'profile_session'));

create index if not exists idx_visitors_user_id on public.visitors(user_id);
create index if not exists idx_visitors_state on public.visitors(state);
create index if not exists idx_events_event_type_created_at on public.events(event_type, created_at desc);
