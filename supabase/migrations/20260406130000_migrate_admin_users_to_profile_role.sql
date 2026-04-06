-- Sustituye la tabla admin_users (si existía) por profiles.role.

do $$
begin
  if exists (
    select 1 from pg_catalog.pg_tables
    where schemaname = 'public' and tablename = 'admin_users'
  ) then
    update public.profiles p
    set role = 'admin'
    from public.admin_users a
    where a.user_id = p.id;
    drop table public.admin_users cascade;
  end if;
end $$;
