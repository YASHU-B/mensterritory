'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { MapPin, Phone, MessageSquareText, Mail, Send, CheckCircle2 } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';
import { generateWhatsAppUrl } from '@/services/orderService';

export default function ContactPage() {
  const { settings } = useStore();
  const { showToast } = useToast();

  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const phone = settings.whatsapp_number || '7815858973';
  const whatsappUrl = generateWhatsAppUrl(
    phone,
    "Hello Men's Territory, I would like to enquire about your store and products."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      showToast('Please fill in required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Message sent! Our store stylist will contact you soon.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-zinc-950 tracking-tight">
          Contact The Territory
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600">
          Have a question about sizes, custom bulk orders, or store visits? Reach out to us directly through WhatsApp or phone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Info Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Store Address Card */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 border border-zinc-200">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                  Store Location
                </h3>
                <span className="text-[11px] text-zinc-500">Physical Flagship Showroom</span>
              </div>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed pl-13">
              {settings.address_line1 || 'VNR Peta (Taduku Peta)'},<br />
              {settings.address_line2 || 'Nagari (M)'}, {settings.district || 'Chittoor District'},<br />
              {settings.state || 'Andhra Pradesh'}, India - {settings.pincode || '517590'}
            </p>
          </div>

          {/* Direct WhatsApp Card */}
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950">
                  WhatsApp Support
                </h3>
                <span className="text-[11px] text-emerald-700 font-semibold">Instant Responses</span>
              </div>
            </div>
            <div className="pl-13 space-y-2">
              <p className="text-xs text-emerald-900">
                Chat directly with our showroom team for stock queries, size guidance, or custom orders.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-transform hover:scale-105 active:scale-95"
              >
                <span>Chat on WhatsApp</span>
                <MessageSquareText className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Calling Lines */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 border border-zinc-200">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                  Phone Numbers
                </h3>
                <span className="text-[11px] text-zinc-500">Monday - Sunday: 9:30 AM - 10:00 PM</span>
              </div>
            </div>
            <div className="pl-13 space-y-1 text-xs font-mono text-zinc-700">
              <p>
                <a href={`tel:${settings.phone_primary || '7815858973'}`} className="hover:text-zinc-950 font-bold">
                  Primary: +91 {settings.phone_primary || '7815858973'}
                </a>
              </p>
              {settings.phone_secondary && (
                <p>
                  <a href={`tel:${settings.phone_secondary}`} className="hover:text-zinc-950 font-bold">
                    Secondary: +91 {settings.phone_secondary}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Instagram Card */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 border border-zinc-200">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
                  Official Instagram
                </h3>
                <span className="text-[11px] text-zinc-500">Daily outfit drops & stories</span>
              </div>
            </div>
            <div className="pl-13">
              <a
                href={`https://instagram.com/${(settings.instagram_handle || '@mens_territory_mt').replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-950 hover:text-zinc-600 font-bold transition-colors inline-block"
              >
                {settings.instagram_handle || '@mens_territory_mt'} &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Right: Interactive Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-3xl p-8 sm:p-10 shadow-xs">
          <h2 className="text-base font-black uppercase tracking-widest text-zinc-950 border-b border-zinc-100 pb-4 mb-6">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="py-16 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-950">Thank You for Reaching Out!</h3>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                Your message has been delivered to Men&apos;s Territory. We will get back to you shortly via phone or WhatsApp.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold uppercase"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yaswanth"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Your Enquiry / Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask about product sizing, custom requests, store visits..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
