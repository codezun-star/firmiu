-- ============================================================
-- Firmiu — Initial schema
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- ============================================================
-- ENUM: document status
-- ============================================================
create type estado_documento as enum ('pendiente', 'visto', 'firmado');

-- ============================================================
-- TABLE: documentos
-- ============================================================
create table if not exists documentos (
  id                   uuid primary key default gen_random_uuid(),
  owner_id             uuid not null references auth.users(id) on delete cascade,
  titulo               text not null,
  nombre_destinatario  text not null,
  correo_destinatario  text not null,
  estado               estado_documento not null default 'pendiente',
  url_pdf_original     text,
  url_pdf_firmado      text,
  token                uuid not null unique default gen_random_uuid(),
  creado_en            timestamptz not null default now()
);

comment on table documentos is 'PDF documents sent for signing';
comment on column documentos.token is 'Public token used in /firmar/[token] — never guessable';

-- Index for owner queries
create index on documentos(owner_id);

-- Index for public token lookups
create unique index on documentos(token);

-- ============================================================
-- TABLE: firmas
-- ============================================================
create table if not exists firmas (
  id                   uuid primary key default gen_random_uuid(),
  documento_id         uuid not null references documentos(id) on delete cascade,
  firmado_en           timestamptz not null default now(),
  ip                   text,
  user_agent           text,
  navegador            text,
  sistema_operativo    text,
  ubicacion            text,
  codigo_verificacion  text,
  verificado           boolean not null default false
);

comment on table firmas is 'Audit trail for each signing event';

-- Index for document lookups
create index on firmas(documento_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table documentos enable row level security;
alter table firmas     enable row level security;

-- documentos: owners can read/write their own rows
create policy "Owners manage own documents"
  on documentos
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- documentos: anyone with the token can read (for /firmar/[token])
create policy "Public read by token"
  on documentos
  for select
  using (true);  -- further scoping is done at the API layer by filtering on token

-- firmas: service role only (inserted via server action with service key)
create policy "Service role manages signatures"
  on firmas
  for all
  using (false)   -- deny all by default from client
  with check (false);

-- ============================================================
-- Storage buckets (run after enabling Storage in the dashboard)
-- ============================================================

-- Bucket: pdfs-originales  — private, owner-only
insert into storage.buckets (id, name, public)
values ('pdfs-originales', 'pdfs-originales', false)
on conflict do nothing;

-- Bucket: pdfs-firmados — private, accessible via signed URL
insert into storage.buckets (id, name, public)
values ('pdfs-firmados', 'pdfs-firmados', false)
on conflict do nothing;

-- Storage policy: owners can upload to pdfs-originales
create policy "Owners upload original PDFs"
  on storage.objects
  for insert
  with check (
    bucket_id = 'pdfs-originales'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Owners read original PDFs"
  on storage.objects
  for select
  using (
    bucket_id = 'pdfs-originales'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Owners read signed PDFs"
  on storage.objects
  for select
  using (
    bucket_id = 'pdfs-firmados'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
