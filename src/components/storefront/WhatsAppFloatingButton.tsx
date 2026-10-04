'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { MessageSquareText } from 'lucide-react';
import { generateWhatsAppUrl } from '@/services/orderService';

export default function WhatsAppFloatingButton() {
  const { settings } = useStore();
  const phone = settings.whatsapp_number || '7815858973';
  const defaultMessage = "Hello Men's Territory, I would like to know more about your products.";
  const whatsappUrl = generateWhatsAppUrl(phone, defaultMessage);

  return (
    <aside aria-label="WhatsApp Quick Contact" className="fixed bottom-6 left-6 z-40 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group-hover:ring-4 ring-emerald-500/30"
        aria-label="Order or Chat on WhatsApp"
      >
        {/* Pulsing beacon ping */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-zinc-950"></span>
        </span>

        {/* WhatsApp Icon */}
        <MessageSquareText className="w-7 h-7" />

        {/* Hover Tooltip */}
        <div className="absolute left-16 bottom-2 hidden sm:group-hover:flex items-center bg-zinc-900 text-white text-xs px-3.5 py-2 rounded-xl whitespace-nowrap border border-zinc-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="font-semibold text-emerald-400 mr-1.5">Direct Store Line:</span>
          Chat on WhatsApp
        </div>
      </a>
    </aside>
  );
}
