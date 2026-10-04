import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-950 shadow-xs">
          <span className="font-mono text-2xl font-black">404</span>
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">
            Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-950 tracking-tight">
            Looks like this style is out of stock.
          </h1>
          <p className="text-xs text-zinc-600 leading-relaxed">
            The page you are searching for might have been moved, renamed, or is temporarily unavailable in the territory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-200 transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
