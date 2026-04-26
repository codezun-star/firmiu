-- Run this in the Supabase SQL Editor

create table if not exists contactos (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  nombre      text not null,
  correo      text not null,
  empresa     text,
  creado_en   timestamptz not null default now(),
  unique (owner_id, correo)
);

alter table contactos enable row level security;

create policy "users manage their own contacts"
  on contactos for all
  using  (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
