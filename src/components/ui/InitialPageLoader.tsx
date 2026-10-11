'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function InitialPageLoader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Check if user has already seen the splash in this browser session
    const hasSeenSplash = sessionStorage.getItem('mt_has_entered');

    // Simulate luxury loader progress
    const pTimer1 = setTimeout(() => setProgress(45), 250);
    const pTimer2 = setTimeout(() => setProgress(80), 650);
    const pTimer3 = setTimeout(() => setProgress(100), 1050);

    // Transition out
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, hasSeenSplash ? 850 : 1350);

    const finishTimer = setTimeout(() => {
      setLoading(false);
      try {
        sessionStorage.setItem('mt_has_entered', 'true');
      } catch {
        // Safe for private browsing
      }
    }, hasSeenSplash ? 1200 : 1800);

    return () => {
      clearTimeout(pTimer1);
      clearTimeout(pTimer2);
      clearTimeout(pTimer3);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#fafafa] transition-all duration-700 ease-out ${
        fading ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 bg-radial from-zinc-200/50 via-transparent to-transparent opacity-60 pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm px-6 text-center select-none">
        {/* Orbital Brand Container */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-6">
          {/* Outer Rotating Halo Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-zinc-200 border-t-zinc-950 border-r-zinc-600 animatic-spin-slow" />
          
          {/* Inner Counter Ring */}
          <div
            className="absolute inset-2 rounded-full border border-zinc-300 border-b-zinc-900 border-l-zinc-500"
            style={{ animation: 'orbit-spin 2s linear infinite reverse' }}
          />

          {/* Central Metallic 3D MT Emblem */}
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden animatic-pulse-scale shadow-lg bg-zinc-950 p-1.5 flex items-center justify-center border border-zinc-800">
            <Image
              src="/images/favicon-512.png"
              alt="Men's Territory"
              width={72}
              height={72}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Brand Typography */}
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-[0.25em] text-zinc-950 font-heading mb-1.5">
          MEN&apos;S TERRITORY
        </h1>
        <p className="text-xs sm:text-sm font-serif italic text-zinc-600 tracking-wider mb-6">
          &ldquo;The Real Man&apos;s Choice&rdquo;
        </p>

        {/* Progress Bar Container with Metallic Shimmer */}
        <div className="w-48 sm:w-56 h-1 bg-zinc-200 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-zinc-950 rounded-full transition-all duration-300 ease-out animatic-shimmer"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Tag */}
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 mt-3 font-semibold">
          Curating Haute Streetwear &bull; {progress}%
        </span>
      </div>
    </div>
  );
}
