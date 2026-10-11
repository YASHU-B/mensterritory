'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { MapPin, Phone, MessageSquareText, Navigation, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { generateWhatsAppUrl } from '@/services/orderService';
import {
  STORE_DIRECTIONS_URL,
  STORE_MAP_EMBED_URL,
  STORE_PLUS_CODE,
} from '@/lib/constants';

export default function StoreLocationSection() {
  const { settings } = useStore();
  const phone = settings.whatsapp_number || '7815858973';
  const whatsappUrl = generateWhatsAppUrl(
    phone,
    "Hello Men's Territory, I would like to visit your store at Thadukupeta, Nagari. Please share location directions."
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-white border border-zinc-200 p-8 sm:p-12 lg:p-16 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Information */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-[0.2em]">
              <MapPin className="w-3.5 h-3.5 text-zinc-900" />
              <span>Flagship Atelier & Storefront</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-zinc-950 tracking-tight leading-tight font-heading">
              Visit The Territory In Person
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed font-normal">
              Step into our flagship retail destination in Nagari to experience premium fabric weights, bespoke draping, tailored fits, and personal styling concierge.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-950 border border-zinc-200">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-950">
                    Store Address
                  </h4>
                  <p className="text-xs text-zinc-800 mt-1 leading-relaxed">
                    <span className="font-bold text-zinc-950">Men&apos;s Territory Men&apos;s wear</span><br />
                    7HCJ+QC7, Thadukupeta, Nagari, Taduku,<br />
                    Chittoor District, Andhra Pradesh - 517590
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-950 border border-zinc-200">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-950">
                    Direct VIP Concierge
                  </h4>
                  <p className="text-xs text-zinc-700 mt-1 font-mono">
                    <a href={`tel:${settings.phone_primary || '7815858973'}`} className="hover:text-zinc-950 font-bold transition-colors">
                      +91 {settings.phone_primary || '7815858973'}
                    </a>
                    {settings.phone_secondary && (
                      <>
                        <span className="mx-2 text-zinc-400">•</span>
                        <a href={`tel:${settings.phone_secondary}`} className="hover:text-zinc-950 font-bold transition-colors">
                          +91 {settings.phone_secondary}
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-950 border border-zinc-200">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-950">
                    Opening Hours
                  </h4>
                  <p className="text-xs text-zinc-700 mt-1">
                    Monday – Sunday: 09:30 AM – 10:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.15em] shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>Chat Store on WhatsApp</span>
              </a>

              <a
                href={STORE_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <Navigation className="w-4 h-4 text-white" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Showcase Box */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 p-6 sm:p-8 flex flex-col justify-between shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-[0.2em] text-zinc-600 uppercase font-bold">
                PLUS CODE: {STORE_PLUS_CODE} • NAGARI
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Open Today
              </span>
            </div>

            {/* Live Google Maps Embedded View */}
            <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-zinc-200 shadow-inner bg-zinc-200">
              <iframe
                title="Men's Territory Men's wear Map Location"
                src={STORE_MAP_EMBED_URL}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={STORE_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-zinc-950 rounded-lg text-[11px] font-bold shadow-md backdrop-blur-xs border border-zinc-200 transition-transform hover:scale-105"
              >
                <span>Navigate</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-2 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-zinc-800">Trial & Fitting Suites Open</span>
              </div>
              <a
                href={STORE_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-zinc-950 hover:underline"
              >
                <span>Direct Navigation &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
