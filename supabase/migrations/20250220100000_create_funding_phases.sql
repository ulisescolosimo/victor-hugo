-- Tabla de fases de financiamiento (tu jefe puede editar los montos desde Supabase Dashboard)
-- Ejecuta en Supabase: SQL Editor > New query

create table if not exists public.funding_phases (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  amount text not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Orden por defecto
create index if not exists funding_phases_sort_order_idx on public.funding_phases (sort_order);

-- Lectura pública para que la web muestre las fases sin login
alter table public.funding_phases enable row level security;

create policy "Cualquiera puede ver las fases"
  on public.funding_phases for select
  using (true);

-- Solo desde el Dashboard (service_role) o usuarios autenticados pueden modificar
create policy "Usuarios autenticados pueden actualizar fases"
  on public.funding_phases for update
  using (auth.role() = 'authenticated');

create policy "Usuarios autenticados pueden insertar fases"
  on public.funding_phases for insert
  with check (auth.role() = 'authenticated');

create policy "Usuarios autenticados pueden eliminar fases"
  on public.funding_phases for delete
  using (auth.role() = 'authenticated');

-- Datos iniciales (solo si la tabla está vacía)
insert into public.funding_phases (sort_order, title, amount, description)
select * from (values
  (1, 'FASE 01', '200.000 USD', 'Financiación de derechos de transmisión.'),
  (2, 'FASE 02', '200.000 USD', 'Logística, viaje y cobertura.'),
  (3, 'FASE 03', '200.000 USD', 'Transmisión, Documental y legado')
) as v(sort_order, title, amount, description)
where not exists (select 1 from public.funding_phases limit 1);

comment on table public.funding_phases is 'Fases de financiamiento del proyecto; editable desde Supabase Dashboard.';
