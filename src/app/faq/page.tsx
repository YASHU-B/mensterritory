'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquareText } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { generateWhatsAppUrl } from '@/services/orderService';

export default function FAQPage() {
  const { settings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const phone = settings.whatsapp_number || '7815858973';
  const whatsappUrl = generateWhatsAppUrl(
    phone,
    "Hello Men's Territory, I have a question regarding my order."
  );

  const faqs = [
    {
      q: 'How does ordering on WhatsApp work?',
      a: 'Browse our catalog, choose your preferred size and color, and add items to your shopping bag. At checkout, click "Place Order on WhatsApp". Your order details, address, and items are automatically pre-formatted into a WhatsApp message directly to our store team. We immediately confirm stock, share payment options (UPI, GPay, PhonePe, or Cash on Delivery), and prepare your package for dispatch.',
    },
    {
      q: 'Do I need to create an account to purchase?',
      a: 'No! Men\'s Territory believes in a frictionless shopping experience. You do not need passwords or customer logins. Everything is verified and tracked seamlessly through your WhatsApp contact number.',
    },
    {
      q: 'What are your delivery timelines across India?',
      a: 'Orders are dispatched within 24 hours from our Nagari fulfillment hub. Delivery typically takes 2-4 business days for South India (Andhra Pradesh, Telangana, Tamil Nadu, Karnataka) and 4-6 business days for the rest of India.',
    },
    {
      q: 'What is your size exchange policy?',
      a: 'We want you to look and feel commanding in your clothes. If the fit isn\'t perfect, contact our WhatsApp line within 7 days of receiving your package. We will gladly arrange a size replacement for unworn items with tags intact.',
    },
    {
      q: 'Can I visit your physical showroom?',
      a: 'Yes, absolutely! Our flagship showroom is located at VNR Peta (Taduku Peta), Nagari (M), Chittoor District, Andhra Pradesh - PIN 517590. You can try our full collection of baggy trousers, tailored shirts, and streetwear in person.',
    },
    {
      q: 'What fabrics do you use for oversized and baggy wear?',
      a: 'We use high-density 240+ GSM combed compact cotton for our oversized t-shirts, heavy 320 GSM French terry for shorts, two-ply Giza and Egyptian cotton for formal shirts, and durable cotton canvas/ripstop for cargo pants.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">
          Help & Answers
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-zinc-950 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600">
          Everything you need to know about our products, sizing, dispatch, and WhatsApp ordering.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-zinc-950 text-sm"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-zinc-950' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="p-8 rounded-3xl bg-white border border-zinc-200 text-center space-y-3 shadow-xs">
        <HelpCircle className="w-8 h-8 text-zinc-900 mx-auto" />
        <h3 className="text-lg font-bold text-zinc-950">Still have questions?</h3>
        <p className="text-xs text-zinc-600 max-w-sm mx-auto">
          Our store representatives are available on WhatsApp to assist you directly with custom styling or order questions.
        </p>
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-transform hover:scale-105"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Chat With Us on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
