create table if not exists public.admin_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  app_id text,
  user_email text,
  action text,
  status text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  visitor_id uuid,
  event_type text,
  project_id text,
  external_target text,
  page_path text,
  country text,
  state text,
  city text,
  location_label text,
  device_type text,
  user_agent text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text
);

alter table public.admin_events
  add column if not exists visitor_id uuid,
  add column if not exists event_type text,
  add column if not exists project_id text,
  add column if not exists external_target text,
  add column if not exists page_path text,
  add column if not exists country text,
  add column if not exists state text,
  add column if not exists city text,
  add column if not exists location_label text,
  add column if not exists device_type text,
  add column if not exists user_agent text,
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text;

create index if not exists idx_admin_events_created_at on public.admin_events(created_at desc);
create index if not exists idx_admin_events_app_id on public.admin_events(app_id);
create index if not exists idx_admin_events_visitor_id on public.admin_events(visitor_id);
create index if not exists idx_admin_events_event_type on public.admin_events(event_type);

insert into public.admin_events (
  app_id,
  action,
  metadata,
  created_at,
  visitor_id,
  event_type,
  country,
  state,
  city,
  location_label,
  device_type,
  user_agent,
  referrer,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content
)
select
  'floyd-portfolio' as app_id,
  'visit' as action,
  jsonb_build_object(
    'visitor_user_id', v.user_id,
    'location_label', concat_ws(', ', nullif(v.city, ''), nullif(v.state, '')),
    'referrer', v.referrer,
    'utm_source', v.utm_source,
    'utm_medium', v.utm_medium,
    'utm_campaign', v.utm_campaign,
    'utm_term', v.utm_term,
    'utm_content', v.utm_content,
    'device_type', case
      when coalesce(v.user_agent, '') ~* '(ipad|tablet|playbook|silk)' then 'tablet'
      when coalesce(v.user_agent, '') ~* '(mobi|android|iphone|ipod)' then 'phone'
      else 'computer'
    end
  ) as metadata,
  v.created_at,
  v.id as visitor_id,
  'visit' as event_type,
  v.country,
  v.state,
  v.city,
  concat_ws(', ', nullif(v.city, ''), nullif(v.state, '')) as location_label,
  case
    when coalesce(v.user_agent, '') ~* '(ipad|tablet|playbook|silk)' then 'tablet'
    when coalesce(v.user_agent, '') ~* '(mobi|android|iphone|ipod)' then 'phone'
    else 'computer'
  end as device_type,
  v.user_agent,
  v.referrer,
  v.utm_source,
  v.utm_medium,
  v.utm_campaign,
  v.utm_term,
  v.utm_content
from public.visitors v
where not exists (
  select 1
  from public.admin_events ae
  where ae.app_id = 'floyd-portfolio'
    and ae.event_type = 'visit'
    and ae.visitor_id = v.id
);

insert into public.admin_events (
  app_id,
  action,
  metadata,
  created_at,
  visitor_id,
  event_type,
  project_id,
  external_target,
  country,
  state,
  city,
  location_label,
  device_type,
  user_agent,
  referrer,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content
)
select
  'floyd-portfolio' as app_id,
  e.event_type as action,
  coalesce(e.metadata, '{}'::jsonb) || jsonb_build_object('visitor_user_id', v.user_id),
  e.created_at,
  e.visitor_id,
  e.event_type,
  e.project_id,
  case
    when e.event_type = 'external_profile_click' then coalesce(e.metadata->>'profile', 'unknown')
    else null
  end as external_target,
  v.country,
  v.state,
  v.city,
  concat_ws(', ', nullif(v.city, ''), nullif(v.state, '')) as location_label,
  case
    when coalesce(v.user_agent, '') ~* '(ipad|tablet|playbook|silk)' then 'tablet'
    when coalesce(v.user_agent, '') ~* '(mobi|android|iphone|ipod)' then 'phone'
    else 'computer'
  end as device_type,
  v.user_agent,
  v.referrer,
  v.utm_source,
  v.utm_medium,
  v.utm_campaign,
  v.utm_term,
  v.utm_content
from public.events e
left join public.visitors v on v.id = e.visitor_id
where not exists (
  select 1
  from public.admin_events ae
  where ae.app_id = 'floyd-portfolio'
    and ae.event_type = e.event_type
    and ae.visitor_id = e.visitor_id
    and ae.created_at = e.created_at
    and coalesce(ae.project_id, '') = coalesce(e.project_id, '')
);

alter table public.admin_events enable row level security;

drop policy if exists "anon_insert_admin_events" on public.admin_events;
create policy "anon_insert_admin_events"
  on public.admin_events
  for insert to anon
  with check (true);

drop policy if exists "anon_select_admin_events_admin" on public.admin_events;
create policy "anon_select_admin_events_admin"
  on public.admin_events
  for select to anon
  using (true);
