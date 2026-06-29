-- 014_campos_firma.sql
-- Un firmante puede tener VARIOS lugares de firma en el documento (PDF unificado).
-- `campos` guarda el arreglo de posiciones:
--   [{ pagina, campo_x, campo_y, campo_ancho, campo_alto }, ...]
-- Las columnas sueltas (campo_x, campo_y, ...) se mantienen = PRIMER campo
-- (compatibilidad + es la zona que se le muestra al firmante). Al firmar UNA vez,
-- signFirmante estampa la firma en TODOS los campos del arreglo.
alter table firmantes add column if not exists campos jsonb;
