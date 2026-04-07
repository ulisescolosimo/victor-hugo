-- Para proyectos donde nunca se aplicó add_profile_role.sql:
-- añade la columna role y el trigger de protección.

alter table public.profiles
  add column if not exists role text not null default 'user';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('user', 'admin'));
  end if;
end $$;

comment on column public.profiles.role is 'user | admin — cambiar solo desde SQL del dashboard o service_role';

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
