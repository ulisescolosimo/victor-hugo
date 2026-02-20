-- Tabla de perfiles vinculada a auth.users
-- Ejecuta este SQL en el Supabase Dashboard: SQL Editor > New query

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  apellido text,
  email text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Índice para búsquedas por email (opcional)
create index if not exists profiles_email_idx on public.profiles (email);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Los usuarios solo pueden ver y actualizar su propio perfil
create policy "Usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- El trigger crea el perfil al registrarse (con nombre/apellido desde metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, apellido, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'apellido', ''),
    new.email
  );
  return new;
end;
$$;

-- Trigger al insertar en auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Comentarios para documentación
comment on table public.profiles is 'Perfiles de usuario (nombre, apellido) vinculados a auth.users';
