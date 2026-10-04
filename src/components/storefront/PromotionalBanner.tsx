'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';
import { getBanners } from '@/lib/supabase/data-service';
import { Banner } from '@/types';

export default function PromotionalBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    async function loadBanner() {
      const banners = await getBanners();
      const active = banners.find((b) => b.is_active);
      if (active) {
        setBanner(active);
      }
    }
    loadBanner();
  }, []);

  const title = banner?.title || "Up to 50% Off On Street & Baggy Edits";
  const subtitle = banner?.subtitle || "Architectural oversized drop-shoulder t-shirts, heavy duck canvas overshirts, and wide-leg baggy trousers tailored for true masculine presence.";
  const ctaText = banner?.cta_text || "EXPLORE OFFERS";
  const ctaLink = banner?.cta_link || "/shop?filter=offer";
  const imageUrl = banner?.image_url || "";

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xs">
        {/* Background Image if uploaded by admin */}
        <div className="absolute inset-0 z-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover object-center opacity-25"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 via-zinc-100/90 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-[0.2em] shadow-xs">
            <Flame className="w-3.5 h-3.5 text-red-600" />
            <span>Limited Celebration Drop</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-zinc-950 tracking-tight leading-tight font-heading">
            {title}
          </h2>

          <p className="text-sm text-zinc-600 leading-relaxed font-normal">
            {subtitle}
          </p>

          <div className="pt-2">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-[0.18em] rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
