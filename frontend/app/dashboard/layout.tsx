'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('statusenzin_token') : null;
      if (!token) {
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      try {
        await api.get('/auth/me');
        if (isMounted) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('statusenzin_token');
        }
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-vercel-text flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#30ff87] border-t-transparent" />
          <p className="font-mono text-xs text-vercel-muted">Verifying authentication session...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
