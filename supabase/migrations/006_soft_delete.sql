-- Soft delete: adds oculto column to documentos, firmas and contactos.
-- Records marked oculto=true are hidden from the user's dashboard
-- but remain in the database for legal audit purposes.

alter table documentos
  add column if not exists oculto boolean not null default false;

alter table firmas
  add column if not exists oculto boolean not null default false;

alter table contactos
  add column if not exists oculto boolean not null default false;

-- Index to speed up the common filter .eq('oculto', false)
create index if not exists idx_documentos_oculto on documentos (owner_id, oculto);
create index if not exists idx_contactos_oculto  on contactos  (owner_id, oculto);
