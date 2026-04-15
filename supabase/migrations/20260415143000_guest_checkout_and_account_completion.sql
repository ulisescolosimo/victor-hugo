-- Permite checkout de invitados y enlace de pago -> cuenta al volver de la pasarela.

alter table public.payments
  alter column user_id drop not null;

alter table public.payments
  add column if not exists checkout_token text;

create index if not exists idx_payments_checkout_token
  on public.payments(checkout_token);
