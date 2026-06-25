-- The anon UPDATE policy on page_views (added in 20260618000000_analytics.sql)
-- is not taking effect on the live database: anon UPDATE statements against
-- page_views currently match zero rows, silently breaking page-view duration
-- tracking (tracker.js's flushDuration). Confirmed against both freshly
-- inserted and long-existing rows, so this isn't a freshness/replication
-- issue — the policy itself has drifted from what this migration history
-- defines. Re-asserting it so the live policy state matches the codebase.

drop policy if exists "anon can update page_views duration" on public.page_views;

create policy "anon can update page_views duration"
  on public.page_views for update to anon using (true) with check (true);
