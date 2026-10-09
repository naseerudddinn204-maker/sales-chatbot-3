alter table public.leads
  add column if not exists requested_price numeric(12,2);
