'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Store, MapPin, Phone, MessageSquareText, ExternalLink } from 'lucide-react';
import { generateWhatsAppUrl } from '@/services/orderService';

export default function AdminStorePage() {
  const { settings } = useStore();
  const phone = settings.whatsapp_number || '7815858973';
  const whatsappUrl = generateWhatsAppUrl(phone, "Hello, store management enquiry.");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Physical Showroom & Outlet
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight mt-0.5">
            Flagship Store Information
          </h1>
        </div>

        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
        >
          <span>Edit Address in Settings</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Details Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 border border-zinc-200">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                Showroom Location
              </h3>
              <p className="text-[11px] text-zinc-500">Retail Outlet & Dispatch Center</p>
            </div>
          </div>

          <div className="space-y-1 text-xs text-zinc-700 leading-relaxed font-mono pt-2">
            <p className="font-bold text-zinc-950 font-sans">{settings.store_name}</p>
            <p>{settings.address_line1}</p>
            <p>{settings.address_line2}</p>
            <p>{settings.city}, {settings.district}</p>
            <p>{settings.state}, India - {settings.pincode}</p>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <a
              href="https://maps.google.com/?q=Nagari+Chittoor+Andhra+Pradesh+517590"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-900 hover:underline font-semibold"
            >
              <span>View On Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Contact Channels Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                Direct Channels
              </h3>
              <p className="text-[11px] text-zinc-500">Calling lines and online support</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-700 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">WhatsApp Order Desk:</span>
              <span className="font-mono text-emerald-700 font-bold">+{settings.whatsapp_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Primary Phone:</span>
              <span className="font-mono text-zinc-950 font-semibold">+{settings.phone_primary}</span>
            </div>
            {settings.phone_secondary && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Secondary Phone:</span>
                <span className="font-mono text-zinc-950 font-semibold">+{settings.phone_secondary}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Instagram:</span>
              <span className="text-zinc-950 font-semibold">{settings.instagram_handle}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Test WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
