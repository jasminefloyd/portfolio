-- Enable SELECT access for development / Edge Function testing
-- In production, the Edge Function should use service_role key
-- For dev/test, we allow anon SELECT on analytics tables for admin dashboard

-- Allow anon to SELECT from visitors (for admin dashboard)
create policy "anon_select_visitors_admin"
  on public.visitors
  for select to anon
  using (true);

-- Allow anon to SELECT from events (for admin dashboard)
create policy "anon_select_events_admin"
  on public.events
  for select to anon
  using (true);

-- Allow anon to SELECT from messages (for admin dashboard)
create policy "anon_select_messages_admin"
  on public.messages
  for select to anon
  using (true);

-- Allow anon to UPDATE messages (for marking as read)
create policy "anon_update_messages_admin"
  on public.messages
  for update to anon
  with check (true);
