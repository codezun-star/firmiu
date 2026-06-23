-- Incremento atómico del contador mensual de documentos.
-- Reemplaza el patrón read-then-write de uploadDocumentAction, que bajo
-- subidas concurrentes perdía incrementos (lost update) y dejaba el contador
-- por debajo del consumo real, permitiendo exceder el límite del plan.
--
-- SECURITY DEFINER + search_path fijo: la función corre con privilegios del
-- owner; solo se invoca desde el admin client (service role).

create or replace function increment_documentos_mes(p_sub_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nuevo integer;
begin
  update suscripciones
     set documentos_mes  = documentos_mes + 1,
         actualizado_en  = now()
   where id = p_sub_id
  returning documentos_mes into v_nuevo;

  return v_nuevo;  -- null si el id no existe
end;
$$;
