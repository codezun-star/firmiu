-- Guarda la imagen de la firma (data URL PNG) y la zona horaria de cada firmante.
-- Necesario para construir, cuando TODOS firman, una única página de
-- "Certificado de firma digital" que lista a los firmantes EN ORDEN con su
-- mini-firma + datos de auditoría (estilo certificado de finalización).
-- Reemplaza el modelo anterior de una página de constancia por firmante.

alter table firmantes add column if not exists firma_imagen   text;
alter table firmantes add column if not exists firma_timezone text;
