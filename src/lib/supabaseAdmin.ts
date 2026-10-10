const SUPABASE_URL = 'https://tlkmcfpzfdokcnyyvkov.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-gNvioLExBonu8hGuWa8lQ_eIWmhMn6';

const authHeaders = (token?: string) => ({
  apikey: SUPABASE_KEY,
  Authorization: token ? `Bearer ${token}` : `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
});

export type AdminSession = {
  access_token: string;
  refresh_token: string;
  user: { id: string; email?: string };
};

export async function signIn(email: string, password: string): Promise<AdminSession> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Login failed');
  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user: { id: data.user.id, email: data.user.email },
  };
  localStorage.setItem('sales_admin_session', JSON.stringify(session));
  return session;
}

export function getSession(): AdminSession | null {
  try {
    const value = localStorage.getItem('sales_admin_session');
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function signOut() {
  localStorage.removeItem('sales_admin_session');
}

export async function getAdminUser() {
  const session = getSession();
  if (!session) return null;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/admin_users?select=user_id,email&user_id=eq.${session.user.id}`,
    { headers: authHeaders(session.access_token) }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

async function rest(path: string, options: RequestInit = {}) {
  const session = getSession();
  if (!session) throw new Error('Please login first.');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...authHeaders(session.access_token),
      ...(options.headers || {}),
      Prefer: 'return=representation',
    },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data?.message || data?.hint || 'Request failed');
  return data;
}

export async function listLeads() {
  return rest('leads?select=id,name,email,company,phone,company_website,traffic_volume,primary_goal,message,chatbot_name,order_type,plan_name,requested_price,billing_type,payment_method,payment_status,payment_reference,order_status,created_at&order=created_at.desc');
}

export async function updateLead(id: string, payload: Record<string, unknown>) {
  return rest(`leads?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function listChatbots() {
  return rest('chatbots?select=*&order=created_at.desc');
}

export async function createChatbot(payload: Record<string, unknown>) {
  return rest('chatbots', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateChatbot(id: string, payload: Record<string, unknown>) {
  return rest(`chatbots?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deleteChatbot(id: string) {
  return rest(`chatbots?id=eq.${id}`, { method: 'DELETE' });
}

export async function listPrices(chatbotId: string) {
  return rest(`chatbot_prices?select=*&chatbot_id=eq.${chatbotId}&order=sort_order.asc`);
}

export async function createPrice(payload: Record<string, unknown>) {
  return rest('chatbot_prices', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updatePrice(id: string, payload: Record<string, unknown>) {
  return rest(`chatbot_prices?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deletePrice(id: string) {
  return rest(`chatbot_prices?id=eq.${id}`, { method: 'DELETE' });
}

export async function uploadKnowledgeFile(slug: string, file: File) {
  const session = getSession();
  if (!session) throw new Error('Please login first.');

  const form = new FormData();
  form.append('action', 'upload_knowledge');
  form.append('slug', slug);
  form.append('file', file);

  const res = await fetch(`${SUPABASE_URL}/functions/v1/sales-chatbot-api`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${session.access_token}`,
    },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'File upload failed');
  return data as { ok: boolean; file_name: string; knowledge_text: string; message?: string };
}
