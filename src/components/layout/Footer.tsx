'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { MapPin, Phone, MessageCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';

export default function Footer() {
  const { settings } = useStore();

  const categories = [
    { name: 'Formal Shirts', href: '/category/formal-shirts' },
    { name: 'Casual Shirts', href: '/category/casual-shirts' },
    { name: 'Baggy Shirts', href: '/category/baggy-shirts' },
    { name: 'Oversized T-Shirts', href: '/category/oversized-t-shirts' },
    { name: 'Baggy Pants', href: '/category/baggy-pants' },
    { name: 'Cargo Pants', href: '/category/cargo-pants' },
    { name: 'Jeans & Denim', href: '/category/jeans' },
    { name: 'Jackets & Overshirts', href: '/category/jackets' },
  ];

  const quickLinks = [
    { name: 'About Brand', href: '/about' },
    { name: 'Full Collection', href: '/shop' },
    { name: 'Track Your Order', href: '/track' },
    { name: 'Store Location & Contact', href: '/contact' },
    { name: 'Frequently Asked Questions', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Admin Login', href: '/admin/login' },
  ];

  return (
    <footer className="bg-white text-zinc-600 border-t border-zinc-200 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-zinc-200">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center font-mono font-black text-white text-base transition-colors shadow-sm">
                MT
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-widest text-zinc-950 uppercase">
                  {settings.store_name || "MEN'S TERRITORY"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
                  {settings.tagline || "The Real Man's Choice"}
                </span>
              </div>
            </Link>

            <p className="text-xs text-zinc-600 leading-relaxed max-w-sm">
              {settings.about_text ||
                "Men's Territory brings confident, high-street streetwear, tailored formals, and relaxed silhouettes straight from our cutting-edge design workshop to modern men across India."}
            </p>

            {/* Social & WhatsApp Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/91${settings.whatsapp_number || '7815858973'}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all hover:scale-105 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Store</span>
              </a>

              <a
                href={`https://instagram.com/${(settings.instagram_handle || '@mens_territory_mt').replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
              >
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <span>{settings.instagram_handle || '@mens_territory_mt'}</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-zinc-950 uppercase mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.map((c) => (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className="hover:text-zinc-950 transition-colors flex items-center justify-between group"
                  >
                    <span>{c.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-zinc-950 uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((q) => (
                <li key={q.name}>
                  <Link
                    href={q.href}
                    className="hover:text-zinc-950 transition-colors"
                  >
                    {q.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Physical Store Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-zinc-950 uppercase mb-4">
              Physical Store
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-zinc-950 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed text-zinc-600">
                <p className="font-bold text-zinc-950">Men&apos;s Territory Store</p>
                <p>{settings.address_line1 || 'VNR Peta (Taduku Peta)'}</p>
                <p>{settings.address_line2 || 'Nagari (M)'}, {settings.district || 'Chittoor District'}</p>
                <p>{settings.state || 'Andhra Pradesh'}, India - {settings.pincode || '517590'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs pt-1">
              <Phone className="w-4 h-4 text-zinc-950 shrink-0" />
              <div className="text-zinc-700">
                <a href={`tel:${settings.phone_primary || '7815858973'}`} className="hover:text-zinc-950 font-medium">
                  +91 {settings.phone_primary || '7815858973'}
                </a>
                {settings.phone_secondary && (
                  <>
                    <span className="mx-1 text-zinc-400">/</span>
                    <a href={`tel:${settings.phone_secondary}`} className="hover:text-zinc-950 font-medium">
                      +91 {settings.phone_secondary}
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Fabrics & Direct Brand Assurance</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Men&apos;s Territory. All rights reserved.</p>
          <p className="tracking-wider uppercase font-semibold text-[10px] text-zinc-600">
            THE REAL MAN&apos;S CHOICE • NAGARI, ANDHRA PRADESH
          </p>
        </div>
      </div>
    </footer>
  );
}
