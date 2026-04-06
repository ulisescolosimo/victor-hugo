-- Rol de administrador por usuario (profiles.id = auth.users.id).
-- Asignar en SQL Editor: UPDATE public.profiles SET role = 'admin' WHERE id = 'UUID_DEL_USUARIO';

alter table public.profiles
  add column if not exists role text not null default 'user'
    constraint profiles_role_check check (role in ('user', 'admin'));

comment on column public.profiles.role is 'user | admin — solo cambiable con service_role o SQL en el dashboard';

create or replace function public.profiles_enforce_role_change()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  jwt_role text;
begin
  if new.role is not distinct from old.role then
    return new;
  end if;
  jwt_role := coalesce(auth.jwt() ->> 'role', '');
  -- Consola SQL del dashboard (sin JWT de petición)
  if jwt_role = '' then
    return new;
  end if;
  if jwt_role = 'service_role' then
    return new;
  end if;
  raise exception 'No autorizado a modificar el rol';
end;
$$;

drop trigger if exists profiles_enforce_role_change on public.profiles;
create trigger profiles_enforce_role_change
  before update of role on public.profiles
  for each row
  execute function public.profiles_enforce_role_change();
