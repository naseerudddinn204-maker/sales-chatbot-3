import React, { useEffect, useState } from 'react';
import { DollarSign, RefreshCw, Save } from 'lucide-react';
import { listLeads, updateLead } from '../lib/supabaseAdmin';

type PricingOrder = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  company_website?: string | null;
  chatbot_name?: string | null;
  plan_name?: string | null;
  requested_price?: number | null;
  billing_type?: string | null;
  payment_status?: string | null;
  payment_reference?: string | null;
  order_status?: string | null;
  created_at: string;
};

export function PricingOrdersPanel() {
  const [orders, setOrders] = useState<PricingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  async function loadOrders() {
    setLoading(true);
    try {
      const rows = await listLeads();
      setOrders((rows || []).filter((lead: PricingOrder) => !!lead.plan_name || lead.order_type === 'Pricing order'));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load pricing orders.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadOrders(); }, []);

  async function saveOrder(order: PricingOrder) {
    setSaving(order.id);
    setNotice('');
    try {
      const rows = await updateLead(order.id, {
        order_status: order.order_status || 'New',
        payment_status: order.payment_status || 'awaiting_instructions',
        payment_reference: order.payment_reference || null,
      });
      if (rows?.[0]) setOrders(current => current.map(item => item.id === order.id ? { ...item, ...rows[0] } : item));
      setNotice('Order updated successfully.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update order.');
    } finally {
      setSaving(null);
    }
  }

  const updateOrder = (id: string, changes: Partial<PricingOrder>) =>
    setOrders(current => current.map(order => order.id === id ? { ...order, ...changes } : order));

  return (
    <section className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(21,28,39,0.04)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <DollarSign size={20} />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">Pricing Orders</h2>
          <p className="text-sm text-slate-500">Orders submitted from the public Pricing page. Update order and payment status here.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{orders.length}</span>
        <button onClick={() => void loadOrders()} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold" disabled={loading}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>
      {notice && <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">{notice}</div>}
      {loading ? <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Loading pricing orders…</div>
        : orders.length === 0 ? <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No pricing orders yet. Orders submitted from the Pricing page will appear here.</div>
        : <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left text-sm">
            <thead><tr className="border-b text-xs uppercase text-slate-500">
              <th className="p-3">Date</th><th className="p-3">Client</th><th className="p-3">Contact</th><th className="p-3">Plan</th><th className="p-3">Price / Billing</th><th className="p-3">Order status</th><th className="p-3">Payment status</th><th className="p-3">Payment reference</th><th className="p-3">Action</th>
            </tr></thead>
            <tbody>{orders.map(order => <tr key={order.id} className="border-b align-top last:border-0">
              <td className="whitespace-nowrap p-3">{new Date(order.created_at).toLocaleString()}</td>
              <td className="p-3 font-semibold">{order.name}{order.company && <div className="text-xs font-normal text-slate-500">{order.company}</div>}</td>
              <td className="p-3">{order.email}{order.phone && <div className="text-xs text-slate-500">{order.phone}</div>}{order.company_website && <a className="block max-w-[170px] break-all text-xs text-blue-600 hover:underline" href={order.company_website} target="_blank" rel="noreferrer">{order.company_website}</a>}</td>
              <td className="p-3 font-semibold">{order.chatbot_name || 'AI Chatbot'}<div className="text-xs font-normal text-slate-500">{order.plan_name || 'Plan not specified'}</div></td>
              <td className="whitespace-nowrap p-3">{order.requested_price == null ? '—' : '$' + Number(order.requested_price).toLocaleString()}<div className="text-xs text-slate-500">{order.billing_type || '—'}</div></td>
              <td className="p-3"><select aria-label={'Order status for ' + order.name} className="w-40 rounded-lg border border-slate-200 bg-white p-2 text-xs" value={order.order_status || 'New'} onChange={e => updateOrder(order.id, { order_status: e.target.value })}><option>New</option><option>Contacted</option><option>Payment Pending</option><option>In Progress</option><option>Completed</option></select></td>
              <td className="p-3"><select aria-label={'Payment status for ' + order.name} className="w-44 rounded-lg border border-slate-200 bg-white p-2 text-xs" value={order.payment_status || 'awaiting_instructions'} onChange={e => updateOrder(order.id, { payment_status: e.target.value })}><option value="awaiting_instructions">Awaiting instructions</option><option value="payment_pending">Payment pending</option><option value="paid">Paid</option><option value="rejected">Rejected</option></select></td>
              <td className="p-3"><input aria-label={'Payment reference for ' + order.name} className="w-44 rounded-lg border border-slate-200 p-2 text-xs" maxLength={160} placeholder="Bank reference / note" value={order.payment_reference || ''} onChange={e => updateOrder(order.id, { payment_reference: e.target.value })} /></td>
              <td className="p-3"><button onClick={() => void saveOrder(order)} disabled={saving === order.id} className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"><Save size={14}/>{saving === order.id ? 'Saving…' : 'Save order'}</button></td>
            </tr>)}</tbody>
          </table>
        </div>}
    </section>
  );
}
