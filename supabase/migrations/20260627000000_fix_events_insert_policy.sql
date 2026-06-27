-- The anon INSERT policy on events may have drifted from the migration history
-- on the live database, mirroring the same issue seen with the page_views UPDATE
-- policy (fixed in 20260625000000_fix_analytics_anon_update_policy.sql).
-- Re-asserting it so anon clients can insert click and scroll_depth events.

drop policy if exists "anon can insert events" on public.events;

create policy "anon can insert events"
  on public.events for insert to anon with check (true);
