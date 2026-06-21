-- Analytics tables for Bossie's Gym website tracking

-- ─── page_views ──────────────────────────────────────────────────────────────
create table public.page_views (
  id           uuid primary key default gen_random_uuid(),
  session_id   text        not null,
  page         text        not null,
  entered_at   timestamptz not null default now(),
  duration_ms  integer,
  created_at   timestamptz not null default now()
);

-- ─── events ──────────────────────────────────────────────────────────────────
create table public.events (
  id           uuid primary key default gen_random_uuid(),
  session_id   text        not null,
  page         text        not null,
  event_type   text        not null,
  label        text,
  created_at   timestamptz not null default now()
);

-- ─── indexes ─────────────────────────────────────────────────────────────────
create index on public.page_views (page);
create index on public.page_views (entered_at);
create index on public.events (event_type);
create index on public.events (page);
create index on public.events (created_at);

-- ─── row level security ──────────────────────────────────────────────────────
alter table public.page_views enable row level security;
alter table public.events     enable row level security;

create policy "anon can insert page_views"
  on public.page_views for insert to anon with check (true);

create policy "anon can update page_views duration"
  on public.page_views for update to anon using (true) with check (true);

create policy "anon can select page_views"
  on public.page_views for select to anon using (true);

create policy "anon can insert events"
  on public.events for insert to anon with check (true);

create policy "anon can select events"
  on public.events for select to anon using (true);
