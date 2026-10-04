import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Sparkles, MapPin, Award, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Men's Territory | The Real Man's Choice",
  description: "Learn about Men's Territory: our heritage, uncompromising craftsmanship, and vision for modern men's fashion.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero Brand Story Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">
          Our Story & Ethos
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-zinc-950 tracking-tight leading-none">
          The Real Man&apos;s Choice
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
          Men&apos;s Territory was born out of a simple conviction: modern men deserve apparel that commands authority without sacrificing relaxed comfort.
        </p>
      </div>

      {/* Visual Feature Block */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] max-h-[500px] border border-zinc-200 shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1600&q=85"
          alt="Men's Territory Studio"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 max-w-lg">
          <span className="text-xs font-mono text-zinc-300 uppercase font-bold tracking-widest block mb-1">
            ESTABLISHED IN NAGARI, ANDHRA PRADESH
          </span>
          <p className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
            Crafted for Men Who Value Presence and Quality.
          </p>
        </div>
      </div>

      {/* Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 border border-zinc-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black uppercase text-zinc-950 tracking-wide">
            Architectural Silhouettes
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            From heavyweight 240+ GSM drop-shoulder streetwear tees to fluid wide-leg baggy trousers, our patterns are engineered to drape effortlessly on real men.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 border border-zinc-200">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black uppercase text-zinc-950 tracking-wide">
            Uncompromising Fabrics
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            We source genuine two-ply Egyptian and Giza cottons, French loopback terry, rugged duck canvas, and durable ripstop twill that hold structure through every wash.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 border border-zinc-200">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black uppercase text-zinc-950 tracking-wide">
            Direct WhatsApp Experience
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            No robotic gatekeepers or complex checkouts. Communicate directly with our store stylists on WhatsApp, confirm custom sizing, and track your parcels seamlessly.
          </p>
        </div>
      </div>

      {/* Showroom CTA */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-900 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-lg">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">
            <MapPin className="w-4 h-4 text-white" />
            <span>Retail Destination</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Experience Our Nagari Flagship Store
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mt-1">
            Located at VNR Peta (Taduku Peta), Nagari (M), Chittoor District, Andhra Pradesh.
          </p>
        </div>

        <Link
          href="/shop"
          className="px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-105 shrink-0 inline-flex items-center gap-2"
        >
          <span>Shop The Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
