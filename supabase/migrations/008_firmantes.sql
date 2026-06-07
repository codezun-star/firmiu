-- Tabla firmantes: reemplaza el modelo single-signer para documentos nuevos.
-- Cada documento puede tener hasta 5 firmantes, cada uno con su propio token,
-- posición en el PDF y audit trail completo.
-- La tabla firmas queda como legacy para documentos creados antes de esta migración.

create table if not exists firmantes (
  id                   uuid primary key default gen_random_uuid(),
  documento_id         uuid not null references documentos(id) on delete cascade,
  nombre               text not null,
  correo               text not null,
  orden                integer not null default 1,

  -- Token público único para /firmar/[token]
  token                uuid not null unique default gen_random_uuid(),

  -- Código de verificación de 4 dígitos enviado por email
  codigo_verificacion  text,

  -- Estado individual del firmante
  estado               text not null default 'pendiente',  -- pendiente | visto | firmado

  -- Posición del campo de firma en el PDF (coordenadas relativas 0.0–1.0, origen top-left)
  pagina               integer not null default 1,
  campo_x              float not null default 0.05,
  campo_y              float not null default 0.70,
  campo_ancho          float not null default 0.40,
  campo_alto           float not null default 0.12,

  -- Protección brute-force
  intentos_fallidos    integer not null default 0,
  bloqueado            boolean not null default false,

  -- Audit trail (se rellena cuando firma)
  firmado_en           timestamptz,
  ip                   text,
  user_agent           text,
  navegador            text,
  sistema_operativo    text,
  ubicacion            text,
  ubicacion_ciudad     text,
  ubicacion_pais       text,
  vpn_detectado        boolean default false,

  -- Soft delete
  oculto               boolean not null default false,

  creado_en            timestamptz not null default now()
);

-- Índices para queries del dashboard y la ruta de firma
create index if not exists firmantes_documento_id_idx on firmantes(documento_id);
create index if not exists firmantes_documento_estado_idx on firmantes(documento_id, estado);

-- RLS: sólo service role puede leer/escribir (igual que firmas)
alter table firmantes enable row level security;

create policy "Service role manages firmantes" on firmantes
  for all using (false) with check (false);
