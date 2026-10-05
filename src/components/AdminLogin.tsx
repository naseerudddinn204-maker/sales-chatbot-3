import React, { useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { signIn } from '../lib/supabaseAdmin';

export function AdminLogin({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      onLoggedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900">Chatbot Admin</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Sign in to manage your chatbots, pricing and embed codes.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <div className="mt-1 flex items-center rounded-xl border px-3">
              <Mail size={17} className="text-slate-400" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent p-3 outline-none" placeholder="admin@example.com" />
            </div>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <div className="mt-1 flex items-center rounded-xl border px-3">
              <LockKeyhole size={17} className="text-slate-400" />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent p-3 outline-none" placeholder="••••••••" />
            </div>
          </label>
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <button disabled={busy} className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white disabled:opacity-50">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">Admin accounts are created in Supabase Auth.</p>
      </div>
    </div>
  );
}
