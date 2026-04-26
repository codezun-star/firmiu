create table if not exists suscripciones (
  id                     uuid primary key default gen_random_uuid(),
  owner_id               uuid not null references auth.users(id) on delete cascade,
  paddle_subscription_id text unique,
  paddle_customer_id     text,
  plan                   text not null default 'free',
  estado                 text not null default 'active',
  documentos_mes         integer not null default 0,
  limite_documentos      integer not null default 3,
  periodo_inicio         timestamptz,
  periodo_fin            timestamptz,
  creado_en              timestamptz not null default now(),
  actualizado_en         timestamptz not null default now()
);

alter table suscripciones enable row level security;

create policy "users read own subscription"
  on suscripciones for select
  using (auth.uid() = owner_id);
