-- Fix events table constraint to include all tracked event types
-- Adds: external_profile_click, profile_session

-- Drop the old constraint
alter table public.events drop constraint if exists events_event_type_check;

-- Add the new constraint with all event types
alter table public.events
  add constraint events_event_type_check
  check (event_type in ('resume_download', 'project_open', 'external_profile_click', 'profile_session'));
