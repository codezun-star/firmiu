-- 015_doc_hashes.sql
-- Registro INMUTABLE de integridad en la BD (no solo dentro del PDF):
--   hash_original → SHA-256 del PDF original subido
--   hash_firmado  → SHA-256 del PDF FINAL firmado (con todas las firmas + certificado)
-- Permite probar después que un PDF presentado coincide EXACTAMENTE con el que
-- Firmiu firmó, aunque alguien edite el texto del PDF. Se llena al firmar el último.
alter table documentos add column if not exists hash_original text;
alter table documentos add column if not exists hash_firmado  text;
