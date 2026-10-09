alter table public.chatbot_prices
  add column if not exists one_time_price numeric not null default 0;

alter table public.leads
  add column if not exists billing_type text not null default 'monthly',
  add column if not exists payment_method text not null default 'bank_transfer',
  add column if not exists payment_status text not null default 'awaiting_instructions',
  add column if not exists payment_reference text;

alter table public.leads
  drop constraint if exists leads_billing_type_check,
  drop constraint if exists leads_payment_method_check,
  drop constraint if exists leads_payment_status_check;

alter table public.leads
  add constraint leads_billing_type_check
    check (billing_type in ('one_time', 'monthly', 'annual')),
  add constraint leads_payment_method_check
    check (payment_method in ('bank_transfer', 'manual_confirmation')),
  add constraint leads_payment_status_check
    check (payment_status in ('awaiting_instructions', 'payment_pending', 'paid', 'rejected'));

drop policy if exists "admins can update lead payment status" on public.leads;

create policy "admins can update lead payment status"
  on public.leads
  for update
  to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );
