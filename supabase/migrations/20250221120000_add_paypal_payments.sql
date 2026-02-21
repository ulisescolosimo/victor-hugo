-- Campos para pagos con PayPal (preference_id guarda el order ID de PayPal)
alter table public.payments
  add column if not exists payment_provider text default 'mercadopago',
  add column if not exists capture_id text,
  add column if not exists paypal_net decimal(12,2),
  add column if not exists paypal_fee decimal(12,2),
  add column if not exists paypal_raw jsonb,
  add column if not exists last_capture_error text;

create index if not exists idx_payments_payment_provider on public.payments(payment_provider);
comment on column public.payments.payment_provider is 'mercadopago | paypal';
comment on column public.payments.capture_id is 'PayPal capture ID tras capturar la orden';
comment on column public.payments.paypal_raw is 'Respuesta completa de PayPal para auditoría';
