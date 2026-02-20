-- Tabla de pagos (aportes VHM) para trackear MercadoPago
-- Ejecuta en Supabase: SQL Editor o supabase db push

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  -- MercadoPago
  preference_id text,
  payment_id text,
  external_reference text not null,
  -- Usuario
  user_id uuid not null references auth.users(id) on delete set null,
  user_email text,
  user_name text,
  -- Montos
  amount_usd decimal(12,2) not null,
  amount_ars decimal(12,2) not null,
  currency_id text not null default 'ARS',
  usd_to_ars_rate decimal(12,4),
  -- Producto (aporte)
  quantity int not null,
  unit_price_usd decimal(12,2) not null,
  title text,
  -- Estado
  status text not null default 'pending',
  payment_url text,
  -- Tiempos
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  -- Auditoría
  metadata jsonb,
  raw_webhook_payload jsonb
);

create index idx_payments_user_id on public.payments(user_id);
create index idx_payments_preference_id on public.payments(preference_id);
create index idx_payments_payment_id on public.payments(payment_id);
create index idx_payments_status on public.payments(status);
create index idx_payments_created_at on public.payments(created_at);
create unique index idx_payments_external_reference on public.payments(external_reference);

alter table public.payments enable row level security;

-- Usuarios solo pueden ver sus propios pagos
create policy "Usuarios pueden ver sus propios pagos"
  on public.payments for select
  using (auth.uid() = user_id);

-- Usuarios autenticados pueden crear pagos para sí mismos (desde la API con su sesión)
create policy "Usuarios pueden crear sus propios pagos"
  on public.payments for insert
  with check (auth.uid() = user_id);

-- Las actualizaciones (p. ej. desde el webhook) se hacen con service_role en la API
comment on table public.payments is 'Pagos de aportes VHM; actualización de estado vía webhook con service_role.';
