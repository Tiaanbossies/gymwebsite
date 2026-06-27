-- Add device type column (mobile / tablet / desktop) detected client-side.
alter table public.page_views
  add column if not exists device text;

-- Re-assert page_views UPDATE policy in case migration 20260625 was not yet
-- applied to the live database via `supabase db push` or manual SQL.
-- Without this policy anon clients cannot write duration_ms, so every
-- page-view row ends up with a null duration and the Recent Activity table
-- shows dashes in the Duration column for every row.
drop policy if exists "anon can update page_views duration" on public.page_views;
create policy "anon can update page_views duration"
  on public.page_views for update to anon using (true) with check (true);
