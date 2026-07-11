'use client';

import { useEffect } from 'react';
import { tokenStorage } from '@/api/tokenStorage';

export default function BannedPage() {
  useEffect(() => {
    tokenStorage.removeItem('token');
    tokenStorage.removeItem('user');
    window.sessionStorage.clear();
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
  }, []);

  return (
    <main className="min-h-screen bg-[#080B12] text-white flex items-center justify-center p-6">
      <section className="w-full max-w-xl border border-rose-500/35 bg-[#111827] p-8 shadow-2xl">
        <div className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-rose-300 mb-4">
          403 IP Banned
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-heading">
          Access revoked
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          This IP address has been blocked by Aegis security policy. Any active token,
          browser session, and local authentication state for this device has been cleared.
        </p>
        <div className="mt-6 border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-100">
          Access to banking and security operations endpoints is disabled until the SOC team removes the ban.
        </div>
      </section>
    </main>
  );
}
