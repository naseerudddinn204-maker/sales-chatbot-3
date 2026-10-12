const SUPABASE_URL = 'https://tlkmcfpzfdokcnyyvkov.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-gNvioLExBonu8hGuWa8lQ_eIWmhMn6';
const SESSION_KEY = 'sales_site_user_session';

export type SiteUser = { id: string; email?: string; user_metadata?: { full_name?: string }; email_confirmed_at?: string | null };
export type SiteSession = { access_token: string; refresh_token: string; user: SiteUser };

const headers = (token?: string) => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${token || SUPABASE_KEY}`,
  'Content-Type': 'application/json',
});

async function authRequest(path: string, body: Record<string, unknown>, options: { method?: string; token?: string } = {}) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: options.method || 'POST',
    headers: headers(options.token),
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.msg || data.message || data.error_description || data.error || 'Authentication request failed.';
    if (response.status === 422 && /already|registered|exists/i.test(String(message))) {
      throw new Error('This email already has an account. Please log in instead.');
    }
    throw new Error(String(message));
  }
  return data;
}

export function getUserSession(): SiteSession | null {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) as SiteSession : null;
  } catch {
    return null;
  }
}

function saveSession(session: SiteSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function signUpUser(name: string, email: string, password: string) {
  const redirectTo = `${window.location.origin}/login?verified=1`;
  const data = await authRequest(`signup?redirect_to=${encodeURIComponent(redirectTo)}`, {
    email: email.trim().toLowerCase(),
    password,
    data: { full_name: name.trim() },
  });
  if (data.identities && Array.isArray(data.identities) && data.identities.length === 0) {
    throw new Error('This email already has an account. Please log in instead.');
  }
  if (data.access_token && data.refresh_token && data.user) {
    saveSession({ access_token: data.access_token, refresh_token: data.refresh_token, user: data.user });
  }
  return { needsConfirmation: !data.access_token, user: data.user as SiteUser | undefined };
}

export async function signInUser(email: string, password: string) {
  const data = await authRequest('token?grant_type=password', {
    email: email.trim().toLowerCase(),
    password,
  });
  if (!data.access_token || !data.refresh_token || !data.user) {
    throw new Error('Login could not be completed. Please verify your email and try again.');
  }
  saveSession({ access_token: data.access_token, refresh_token: data.refresh_token, user: data.user });
  return data.user as SiteUser;
}

export async function requestPasswordReset(email: string) {
  const redirectTo = `${window.location.origin}/reset-password`;
  await authRequest(`recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    email: email.trim().toLowerCase(),
  });
}

export async function updateForgottenPassword(accessToken: string, password: string) {
  const data = await authRequest('user', { password }, { method: 'PUT', token: accessToken });
  if (data.access_token && data.refresh_token && data.user) {
    saveSession({ access_token: data.access_token, refresh_token: data.refresh_token, user: data.user });
  }
  return data;
}

export async function signOutUser() {
  const session = getUserSession();
  if (session?.access_token) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: headers(session.access_token),
      });
    } catch {
      // Local sign-out still works if the network is unavailable.
    }
  }
  localStorage.removeItem(SESSION_KEY);
}
