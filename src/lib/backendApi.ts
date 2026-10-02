const API_URL =
  import.meta.env.VITE_SUPABASE_API_URL ||
  'https://tlkmcfpzfdokcnyyvkov.supabase.co/functions/v1/sales-chatbot-api';

export async function callBackend<T = any>(payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || 'Backend request failed');
  }

  return data as T;
}
