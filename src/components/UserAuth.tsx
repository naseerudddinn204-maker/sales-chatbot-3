import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { getUserSession, requestPasswordReset, resendSignupConfirmation, signInUser, signOutUser, signUpUser, updateForgottenPassword } from '../lib/userAuth';
import { ClientDashboard } from './ClientDashboard';

type Mode = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'account';

export function UserAuth({ mode }: { mode: Mode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const session = getUserSession();
  const recoveryToken = useMemo(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return hash.get('access_token') || '';
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      if (mode === 'signup') {
        if (password.length < 8) throw new Error('Please use a password with at least 8 characters.');
        if (password !== confirmPassword) throw new Error('The passwords do not match.');
        const result = await signUpUser(name, email, password);
        if (result.needsConfirmation) {
          setSuccess('Your account was created, but email verification is still required. Check your inbox and spam folder. If the email is missing, use the resend button below.');
        } else {
          setSuccess('Your account is ready.');
          window.location.href = '/account';
        }
      } else if (mode === 'login') {
        await signInUser(email, password);
        window.location.href = '/account';
      } else if (mode === 'forgot-password') {
        await requestPasswordReset(email);
        setSuccess('If an account exists for this email, a password reset link has been sent. Please check your inbox and spam folder.');
      } else if (mode === 'reset-password') {
        if (!recoveryToken) throw new Error('This reset link is missing or expired. Please request a new password reset email.');
        if (password.length < 8) throw new Error('Please use a password with at least 8 characters.');
        if (password !== confirmPassword) throw new Error('The passwords do not match.');
        await updateForgottenPassword(recoveryToken, password);
        window.history.replaceState({}, '', '/account');
        window.location.href = '/account';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resendVerification() {
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await resendSignupConfirmation(email);
      setSuccess('A new verification email has been requested. Check your inbox and spam folder.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the verification email. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await signOutUser();
    window.location.href = '/';
  }

  const title = mode === 'signup' ? 'Create your account'
    : mode === 'forgot-password' ? 'Reset your password'
    : mode === 'reset-password' ? 'Choose a new password'
    : mode === 'account' ? 'Your account' : 'Welcome back';
  const subtitle = mode === 'signup' ? 'Sign up to get started with OrkenAI Labs.'
    : mode === 'forgot-password' ? 'We will email you a secure password reset link.'
    : mode === 'reset-password' ? 'Set a new password for your account.'
    : mode === 'account' ? 'Manage your sign-in details.' : 'Log in to your OrkenAI Labs account.';
  const inputClass = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

  if (mode === 'account') {
    if (!session) {
      window.location.replace('/login');
      return null;
    }
    return <ClientDashboard session={session} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"><ArrowLeft size={16}/> Back to website</a>
        <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_60px_rgba(30,58,95,0.10)] sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20"><ShieldCheck size={27}/></div>
          <h1 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-center text-sm leading-6 text-slate-500">{subtitle}</p>

          {mode === 'login' && new URLSearchParams(window.location.search).get('verified') === '1' && (
            <div className="mt-5 flex gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 size={18} className="shrink-0"/> Email link opened. You can now log in if your email is verified.</div>
          )}
          {error && <div role="alert" className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</div>}
          {success && <div role="status" className="mt-5 flex gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm leading-5 text-emerald-800"><CheckCircle2 size={18} className="shrink-0 mt-0.5"/>{success}</div>}

          {mode === 'signup' && success.startsWith('Your account was created') && (
            <button type="button" disabled={busy} onClick={resendVerification} className="mt-4 flex w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-100 disabled:opacity-60">
              {busy ? 'Please wait…' : 'Resend verification email'}
            </button>
          )}

          {!success || mode === 'login' ? (
            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === 'signup' && <label className="block text-sm font-semibold text-slate-700">Full name<div className="relative"><UserRound size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className={inputClass + ' pl-10'} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" required maxLength={120}/></div></label>}
              {(mode === 'login' || mode === 'signup' || mode === 'forgot-password') && <label className="block text-sm font-semibold text-slate-700">Email address<div className="relative"><Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className={inputClass + ' pl-10'} type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required maxLength={254}/></div></label>}
              {(mode === 'login' || mode === 'signup' || mode === 'reset-password') && <label className="block text-sm font-semibold text-slate-700">{mode === 'reset-password' ? 'New password' : 'Password'}<div className="relative"><LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className={inputClass + ' pl-10 pr-12'} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8}/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>}
              {(mode === 'signup' || mode === 'reset-password') && <label className="block text-sm font-semibold text-slate-700">Confirm password<input className={inputClass} type="password" autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Enter password again" required minLength={8}/></label>}
              <button disabled={busy} className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'forgot-password' ? 'Send reset link' : mode === 'reset-password' ? 'Save new password' : 'Log in'}</button>
            </form>
          ) : null}

          <div className="mt-6 space-y-3 text-center text-sm">
            {mode === 'login' && <><a className="font-semibold text-blue-700 hover:text-blue-900" href="/forgot-password">Forgot password?</a><p className="text-slate-500">New here? <a className="font-bold text-blue-700 hover:text-blue-900" href="/signup">Create an account</a></p></>}
            {mode === 'signup' && <p className="text-slate-500">Already have an account? <a className="font-bold text-blue-700 hover:text-blue-900" href="/login">Log in</a></p>}
            {mode === 'forgot-password' && <a className="font-bold text-blue-700 hover:text-blue-900" href="/login">Back to login</a>}
            {mode === 'reset-password' && <a className="font-bold text-blue-700 hover:text-blue-900" href="/forgot-password">Request a new reset link</a>}
          </div>
        </div>
        <p className="mt-5 px-4 text-center text-xs leading-5 text-slate-400">Your password is securely handled by Supabase Authentication and is never shown in the admin dashboard.</p>
      </div>
    </div>
  );
}
