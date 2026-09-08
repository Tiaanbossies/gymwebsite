-- Audit log for the AI sales agent (server/salesAgent.mjs). One row per
-- website enquiry submitted via POST /api/send-enquiry, recording whether
-- the agent auto-answered, deflected to Bossie, or was disabled entirely.
--
-- Written only by server.mjs via the service-role key (same pattern as
-- onboarded_members in handleSendAgreement) — no anon INSERT/SELECT
-- policies are created, so RLS denies all anon access by default and the
-- service role bypasses RLS as usual.

create table public.sales_agent_log (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  name              text,
  email             text,
  message           text,
  mode              text not null check (mode in ('answered', 'deflected', 'disabled', 'error')),
  matched_question  text,
  confidence        numeric
);

create index on public.sales_agent_log (created_at);
create index on public.sales_agent_log (mode);

alter table public.sales_agent_log enable row level security;
-- Intentionally no anon policies — this table is only ever written to and
-- read from server-side via SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
