-- Migration 007: Add ultimo_recordatorio column to documentos
-- Run manually in Supabase SQL Editor

alter table documentos
  add column if not exists ultimo_recordatorio timestamptz;

-- Index for the cron query (pending docs older than 48h without recent reminder)
create index if not exists idx_documentos_recordatorio
  on documentos (estado, oculto, creado_en, ultimo_recordatorio)
  where estado in ('pendiente', 'visto') and oculto = false;
