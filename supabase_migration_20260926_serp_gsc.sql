-- SERP tracker: make the tables reproducible and ready for Google Search Console data.
-- Additive only: every statement is IF NOT EXISTS or a lossless widening
-- (integer -> numeric(5,1) keeps every existing value exactly). Safe to re-run.

create schema if not exists fozzies;

create table if not exists fozzies.seo_keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text not null unique,
  label text,
  target_path text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists fozzies.serp_checks (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  checked_at timestamptz not null default now(),
  position numeric(5,1),
  found boolean not null default false,
  result_url text,
  engine text not null default 'google',
  location text,
  source text not null default 'manual',
  note text
);

alter table fozzies.seo_keywords enable row level security;
alter table fozzies.serp_checks enable row level security;

create index if not exists idx_serp_checks_keyword_checked
  on fozzies.serp_checks (keyword, checked_at desc);
create index if not exists idx_serp_checks_checked
  on fozzies.serp_checks (checked_at desc);

-- GSC positions are impression-weighted averages (e.g. 11.4): keep one decimal.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'fozzies' and table_name = 'serp_checks'
      and column_name = 'position' and data_type = 'integer'
  ) then
    alter table fozzies.serp_checks alter column position type numeric(5,1);
  end if;
end $$;

-- GSC metrics (null for scraped/manual checks).
alter table fozzies.serp_checks add column if not exists clicks integer;
alter table fozzies.serp_checks add column if not exists impressions integer;
alter table fozzies.serp_checks add column if not exists ctr numeric(6,4);

-- One GSC row per keyword per (UTC) day, so the daily cron is idempotent.
-- Partial: manual/scraped sources may legitimately record several checks a day.
create unique index if not exists uq_serp_checks_gsc_daily
  on fozzies.serp_checks (keyword, ((checked_at at time zone 'UTC')::date))
  where source = 'gsc';
