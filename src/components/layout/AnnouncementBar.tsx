'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { X, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  const { settings } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !settings.is_announcement_active || !settings.announcement_text) {
    return null;
  }

  return (
    <div className="relative bg-zinc-100 text-zinc-900 text-xs font-medium border-b border-zinc-200 px-4 py-2 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6 hidden sm:block" />
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
          <span className="tracking-wider uppercase text-[11px] font-semibold text-zinc-800">
            {settings.announcement_text}
          </span>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center text-[11px] underline font-bold text-zinc-950 hover:text-zinc-600 transition-colors ml-1 uppercase tracking-wider"
          >
            Shop Now &rarr;
          </Link>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-zinc-500 hover:text-zinc-950 p-1 rounded transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
