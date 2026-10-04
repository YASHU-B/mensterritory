'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { ArrowRight, MessageSquareText, Shield, Sparkles, Truck } from 'lucide-react';
import { generateWhatsAppUrl } from '@/services/orderService';

export default function Hero() {
  const { settings } = useStore();

  const heroImage = settings.hero_image_url || '';

  const phone = settings.whatsapp_number || '7815858973';
  const whatsappUrl = generateWhatsAppUrl(
    phone,
    "Hello Men's Territory, I would like to explore your latest collection and place an order."
  );

  return (
    <section className="relative min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden bg-white text-zinc-900 border-b border-zinc-200/80">
      {/* Background Hero Layer if admin uploaded photo */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={settings.hero_title || "Men's Territory Fashion Collection"}
            fill
            priority
            className="object-cover object-top opacity-20 scale-105 transition-transform duration-1000 ease-out"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/60 via-white to-white" />
        <div className="absolute inset-0 hero-aurora-glow pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Subtle Atelier Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-[11px] font-bold uppercase tracking-[0.25em] mb-7 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
          <span>Haute Streetwear &bull; Summer 2026 Collection</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-950 uppercase leading-[0.95] mb-5 font-heading">
          {settings.hero_title || "MEN'S TERRITORY"}
        </h1>

        {/* Tagline */}
        <div className="mb-6">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-[0.18em] uppercase font-serif italic text-zinc-700">
            &ldquo;{settings.tagline || "The Real Man's Choice"}&rdquo;
          </p>
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-600 font-normal leading-relaxed mb-10 tracking-wide">
          {settings.hero_subtitle ||
            "Elevate your presence with architectural oversized fits, tailored heavy-cotton formals, pleated baggy trousers, and signature urban silhouettes."}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href={settings.hero_cta_link || '/shop'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-[0.18em] rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>{settings.hero_cta_text || 'EXPLORE COLLECTION'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.18em] rounded-xl transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>ORDER ON WHATSAPP</span>
          </a>
        </div>

        {/* Feature Pills */}
        <div className="mt-14 pt-8 border-t border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-zinc-700">
          <div className="bg-white py-3 px-3 rounded-xl flex items-center justify-center gap-2 border border-zinc-200 shadow-xs">
            <Shield className="w-4 h-4 text-zinc-950" />
            <span className="font-semibold tracking-wide">100% Genuine Cotton</span>
          </div>
          <div className="bg-white py-3 px-3 rounded-xl flex items-center justify-center gap-2 border border-zinc-200 shadow-xs">
            <Truck className="w-4 h-4 text-zinc-950" />
            <span className="font-semibold tracking-wide">Fast India Dispatch</span>
          </div>
          <div className="bg-white py-3 px-3 rounded-xl flex items-center justify-center gap-2 border border-zinc-200 shadow-xs">
            <MessageSquareText className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold tracking-wide">Direct WhatsApp Order</span>
          </div>
          <div className="bg-white py-3 px-3 rounded-xl flex items-center justify-center gap-2 border border-zinc-200 shadow-xs">
            <Sparkles className="w-4 h-4 text-zinc-950" />
            <span className="font-semibold tracking-wide">Store in Nagari (AP)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
