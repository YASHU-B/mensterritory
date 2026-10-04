'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, FileText, ArrowRight } from 'lucide-react';

function InvoiceLookupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('id') || searchParams.get('order') || '';
  const [orderId, setOrderId] = useState(initialId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    router.push(`/invoice/${encodeURIComponent(orderId.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 max-w-lg w-full space-y-6 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mx-auto shadow-xs">
          <FileText className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
            Document Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight font-heading">
            Find Your Tax Invoice
          </h1>
          <p className="text-xs text-zinc-600">
            Enter your Order Reference ID (e.g. <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono text-zinc-900">MT-20261004-XXXX</code>) to view, download, or print your official retail invoice.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. MT-20261004-9842"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors font-mono font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm hover:scale-[1.01]"
          >
            <span>Generate Invoice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <Link href="/track" className="hover:text-zinc-950 underline font-medium">
            &larr; Go to Order Tracker
          </Link>
          <a
            href="https://wa.me/917815858973?text=Hi%20Men's%20Territory,%20I%20need%20a%20copy%20of%20my%20invoice."
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            Need help on WhatsApp?
          </a>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceLookupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <div className="w-8 h-8 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <InvoiceLookupContent />
    </Suspense>
  );
}
