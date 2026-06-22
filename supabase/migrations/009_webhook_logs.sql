-- 009_webhook_logs.sql
-- Audit log for Paddle webhook events. The webhook handler
-- (src/app/api/paddle/webhook/route.ts) writes here via the admin (service
-- role) client; until this table existed the insert failed silently and every
-- payment event went unaudited.

create table if not exists webhook_logs (
  id          uuid primary key default gen_random_uuid(),
  evento      text,
  custom_data text,
  owner_id    uuid,
  resultado   text,
  creado_en   timestamptz not null default now()
);

create index if not exists idx_webhook_logs_creado_en on webhook_logs (creado_en desc);
create index if not exists idx_webhook_logs_owner_id  on webhook_logs (owner_id);

-- Lock the table down: only the service-role client (which bypasses RLS) may
-- read or write. With RLS enabled and no policies, anon/authenticated roles
-- have no access — webhook logs are internal audit data.
alter table webhook_logs enable row level security;
