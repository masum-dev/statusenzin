'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('statusenzin_token', res.data.token);
        if (res.data.email) {
          localStorage.setItem('statusenzin_user', JSON.stringify(res.data));
        }
      }
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back!</h1>
        <p className="mt-2 text-sm text-vercel-muted">Enter your email and password to access your dashboard</p>
      </div>

      <div className="vercel-card rounded-xl p-8 shadow-2xl">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-vercel-muted mb-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-vercel-subtle" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="vercel-input w-full rounded-lg pl-9 pr-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-vercel-muted mb-1">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-vercel-subtle" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="vercel-input w-full rounded-lg pl-9 pr-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="vercel-button-primary w-full rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="text-center pt-1">
            <Link href="/forgot-password" className="text-xs text-vercel-muted underline hover:text-white transition">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>

      <p className="text-center text-xs text-vercel-muted">
        Don't have an account?{' '}
        <Link href="/signup" className="text-white underline hover:text-neutral-300">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-vercel-text flex flex-col justify-between">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Suspense fallback={
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#30ff87] border-t-transparent" />
            <p className="font-mono text-xs text-vercel-muted">Loading sign in...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
