const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_-gNvioLExBonu8hGuWa8lQ_eIWmhMn6';

const API_URL =
  import.meta.env.VITE_SUPABASE_API_URL ||
  'https://tlkmcfpzfdokcnyyvkov.supabase.co/functions/v1/sales-chatbot-api';

export async function callBackend<T = any>(payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = typeof data?.details === 'string' ? data.details : '';
    const message = typeof data?.error === 'string' ? data.error : 'Backend request failed';
    throw new Error(
      `Backend error (${response.status}): ${detail ? `${message}: ${detail}` : message}`
    );
  }

  return data as T;
}
