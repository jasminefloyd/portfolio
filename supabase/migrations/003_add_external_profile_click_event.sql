alter table public.events drop constraint if exists events_event_type_check;
alter table public.events
  add constraint events_event_type_check
  check (event_type in ('resume_download', 'project_open', 'profile_session', 'external_profile_click'));
