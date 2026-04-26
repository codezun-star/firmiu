-- Brute-force protection for the verification code on the signing flow.
-- Locks a firma record after 5 consecutive wrong code attempts.
alter table firmas
  add column if not exists intentos_fallidos integer not null default 0,
  add column if not exists bloqueado         boolean not null default false;
