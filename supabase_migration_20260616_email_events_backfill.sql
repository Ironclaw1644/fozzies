-- 2026-06-16: Complete the partially-applied email-compliance migration.
-- The fozzies.clients.* columns from supabase_migration_20260215_email_compliance.sql
-- were applied by hand, but the email_events table (written to on every Resend
-- webhook via logEmailEvent) and the resend_contact_id column were never created.
-- Applied to the shared project kflzqkuioiiyfrvlvcvl as migration
-- "fozzies_email_events_and_compliance_backfill".

create schema if not exists fozzies;
create extension if not exists pgcrypto;

-- Missing column declared by the original migration (not yet used in app code).
alter table fozzies.clients
  add column if not exists resend_contact_id text;

-- The event log table the Resend webhook depends on.
create table if not exists fozzies.email_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  type text not null,
  email text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_email_events_created_at on fozzies.email_events (created_at desc);
create index if not exists idx_email_events_type on fozzies.email_events (type);
create index if not exists idx_email_events_email on fozzies.email_events (email);

-- Backfill the indexes the original migration declared on clients.
create index if not exists idx_clients_email on fozzies.clients (email);
create index if not exists idx_clients_unsubscribed on fozzies.clients (unsubscribed);
create index if not exists idx_clients_suppressed_at on fozzies.clients (suppressed_at);
create index if not exists idx_clients_suppressed_reason on fozzies.clients (suppressed_reason);
create unique index if not exists idx_clients_unsubscribe_token
  on fozzies.clients (unsubscribe_token) where unsubscribe_token is not null;

-- Match the security posture of sibling fozzies tables: RLS on, no public
-- policies. Server-side writes use the service-role key and bypass RLS.
alter table fozzies.email_events enable row level security;
