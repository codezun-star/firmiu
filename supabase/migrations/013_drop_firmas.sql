-- 013_drop_firmas.sql
-- La tabla `firmas` (flujo legacy de UN firmante) quedó obsoleta: todo el sistema
-- usa `firmantes` (multi-firmante) desde la migración 008. Confirmada VACÍA antes
-- de borrar. El código ya no la referencia (se eliminó signLegacy, uploadDocumentAction,
-- resendSigningEmailAction, updateDocumentEmailAction y las ramas legacy).
drop table if exists firmas;
