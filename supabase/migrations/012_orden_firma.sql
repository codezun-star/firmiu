-- 012_orden_firma.sql
-- Modo de firma por documento:
--   'paralelo'   → todos los firmantes reciben el documento de inmediato y firman
--                  cuando quieran (default, comportamiento histórico).
--   'secuencial' → se envía solo al firmante de orden 1; cuando firma, el sistema
--                  notifica al siguiente (orden 2), y así sucesivamente.
-- signFirmante bloquea con errorKey "not_your_turn" si alguien intenta firmar
-- antes de que firmen los de orden anterior.
alter table documentos
  add column if not exists modo_firma text not null default 'paralelo';
