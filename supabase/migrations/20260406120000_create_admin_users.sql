-- Roles de administrador por user_id (auth.users).
-- Asignar en SQL Editor: insert into public.admin_users (user_id) values ('<uuid>');

create table if not exists public.admin_users (
  user_id uuid not null primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is 'Usuarios con acceso al panel /admin. Gestionar con SQL o service role.';

alter table public.admin_users enable row level security;

-- Cada sesión solo puede leer su propia fila (para comprobar rol sin exponer la lista de admins)
create policy "admin_users_select_own"
  on public.admin_users
  for select
  using (auth.uid() = user_id);

-- Sin políticas de escritura para authenticated: inserción/eliminación solo con service_role o SQL
