alter table public.leads
  add column if not exists order_status text not null default 'New';

alter table public.leads
  drop constraint if exists leads_order_status_check;

alter table public.leads
  add constraint leads_order_status_check
  check (order_status in ('New', 'Contacted', 'Payment Pending', 'In Progress', 'Completed'));

drop policy if exists "admins can update lead status" on public.leads;

create policy "admins can update lead status"
  on public.leads
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );
