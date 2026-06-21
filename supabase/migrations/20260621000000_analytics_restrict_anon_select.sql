-- The anon key is public (shipped to every visitor for the client-side tracker),
-- so granting it SELECT let anyone read all analytics data directly via the
-- Supabase REST API, bypassing the dashboard password entirely. The dashboard
-- now reads through a server-side endpoint using the service_role key instead —
-- anon only needs to keep writing.

drop policy if exists "anon can select page_views" on public.page_views;
drop policy if exists "anon can select events" on public.events;
