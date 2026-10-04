'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { Search, ShoppingBag, Menu, X, Shield } from 'lucide-react';
import SearchBarModal from '@/components/storefront/SearchBarModal';

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, cartCount } = useCart();
  const { settings } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for subtle shadow/blur enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Formal Shirts', href: '/category/formal-shirts' },
    { name: 'Pants', href: '/category/pants' },
    { name: 'Baggy Pants', href: '/category/baggy-pants' },
    { name: 'Baggy Shirts', href: '/category/baggy-shirts' },
    { name: 'T-Shirts', href: '/category/t-shirts' },
    { name: 'New Arrivals', href: '/shop?filter=new-arrival' },
    { name: 'Offers', href: '/shop?filter=offer' },
    { name: 'Track Order', href: '/track' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm'
            : 'bg-white/90 backdrop-blur-sm border-b border-zinc-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu Trigger & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-zinc-700 hover:text-zinc-950 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-3.5 group">
                <div className="relative w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-base font-black tracking-tighter text-white font-mono">
                    MT
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-black tracking-[0.18em] text-zinc-950 uppercase leading-tight font-heading">
                    {settings.store_name || "MEN'S TERRITORY"}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-semibold -mt-0.5">
                    {settings.tagline || "The Real Man's Choice"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase rounded-lg transition-all ${
                      isActive
                        ? 'text-zinc-950 bg-zinc-100 border border-zinc-200 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Cart, Admin) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-xs transition-colors border border-zinc-200"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 text-zinc-600" />
                <span className="hidden sm:inline-block text-zinc-600 font-medium tracking-wide">Search...</span>
              </button>

              {/* Shopping Bag Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Discreet Admin Portal Link */}
              <Link
                href="/admin"
                className="hidden md:flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                title="Admin Control Center"
              >
                <Shield className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg bg-zinc-50 text-zinc-800 hover:text-black hover:bg-zinc-100 border border-zinc-200 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-4 flex flex-col gap-2 text-xs text-zinc-600">
              <div className="flex justify-between items-center py-1">
                <span>WhatsApp Line:</span>
                <a
                  href={`https://wa.me/91${settings.whatsapp_number || '7815858973'}`}
                  className="text-emerald-600 font-semibold"
                >
                  +{settings.whatsapp_number || '7815858973'}
                </a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Instagram:</span>
                <a
                  href={`https://instagram.com/${(settings.instagram_handle || '@mens_territory_mt').replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-950 hover:underline font-medium"
                >
                  {settings.instagram_handle || '@mens_territory_mt'}
                </a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Store Location:</span>
                <span className="text-zinc-900 font-medium">Nagari (M), Chittoor Dist.</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="block text-center py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg border border-zinc-200 font-semibold transition-colors"
                >
                  Admin Portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Overlay Modal */}
      <SearchBarModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
