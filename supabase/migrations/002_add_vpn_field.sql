alter table firmas
  add column if not exists vpn_detectado boolean default false,
  add column if not exists ubicacion_ciudad text,
  add column if not exists ubicacion_pais text;
