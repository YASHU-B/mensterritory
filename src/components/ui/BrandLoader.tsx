'use client';

import React from 'react';
import Image from 'next/image';

interface BrandLoaderProps {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export default function BrandLoader({
  label = "MEN'S TERRITORY",
  sublabel = 'Curating The Real Man’s Choice...',
  size = 'md',
}: BrandLoaderProps) {
  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
        <div className="relative flex flex-col items-center">
          {/* Subtle Aurora Glow */}
          <div className="absolute -inset-8 bg-zinc-200/40 rounded-full blur-2xl animatic-pulse-scale pointer-events-none" />

          {/* Orbit Rings Container */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Outer Spinning Orbit Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-zinc-200 border-t-zinc-950 border-r-zinc-600 animatic-spin-slow" />
            {/* Counter Inner Orbit Ring */}
            <div
              className="absolute inset-2 rounded-full border border-zinc-300 border-b-zinc-900 border-l-zinc-400"
              style={{ animation: 'orbit-spin 2s linear infinite reverse' }}
            />

            {/* Central MT Emblem */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden animatic-pulse-scale shadow-md bg-zinc-950 p-1 flex items-center justify-center">
              <Image
                src="/images/favicon-512.png"
                alt="Men's Territory Loading"
                width={56}
                height={56}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>

          {/* Typography */}
          <div className="mt-6 text-center space-y-1">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-950 font-heading">
              {label}
            </h4>
            <p className="text-[11px] text-zinc-500 tracking-wider font-medium animatic-float">
              {sublabel}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-2">
        <div className="relative w-5 h-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-300 border-t-zinc-950 animatic-spin-slow" />
          <Image
            src="/images/favicon-512.png"
            alt="Loading"
            width={12}
            height={12}
            className="w-3 h-3 object-contain"
          />
        </div>
        {label && <span className="text-xs text-zinc-600 font-medium">{label}</span>}
      </div>
    );
  }

  // Medium / Default Loader
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Orbit Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-200 border-t-zinc-950 border-r-zinc-700 animatic-spin-slow" />
        {/* Subtle Counter Ring */}
        <div
          className="absolute inset-2 rounded-full border border-zinc-300/60 border-b-zinc-800"
          style={{ animation: 'orbit-spin 2.2s linear infinite reverse' }}
        />
        {/* Central Logo */}
        <div className="relative w-12 h-12 rounded-xl bg-zinc-950 p-1 flex items-center justify-center shadow-xs animatic-pulse-scale">
          <Image
            src="/images/favicon-512.png"
            alt="Men's Territory Loading"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="text-center space-y-0.5">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-950 font-heading block">
          {label}
        </span>
        <span className="text-[10px] text-zinc-500 font-medium tracking-wide">
          {sublabel}
        </span>
      </div>
    </div>
  );
}
