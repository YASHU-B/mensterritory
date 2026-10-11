'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import Image from 'next/image';
import {
  Search,
  ShoppingBag,
  Shield,
  Home,
  Compass,
  LayoutGrid,
  ChevronRight,
  Sparkles,
  Flame,
  MessageCircle,
  X,
} from 'lucide-react';
import SearchBarModal from '@/components/storefront/SearchBarModal';
import { getCategories } from '@/lib/supabase/data-service';
import { Category } from '@/types';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openCart, cartCount } = useCart();
  const { settings } = useStore();

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('mt_categories_v2');
        if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();

    const handleUpdate = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      }
    };
    window.addEventListener('mt_categories_updated', handleUpdate);
    return () => window.removeEventListener('mt_categories_updated', handleUpdate);
  }, []);

  const navLinks = React.useMemo(() => {
    const activeCats = categories.filter((c) => c.is_active);
    const topCats = activeCats.slice(0, 5).map((c) => ({
      name: c.name,
      href: `/category/${c.slug}`,
    }));
    return [
      { name: 'Home', href: '/' },
      { name: 'Shop', href: '/shop' },
      ...topCats,
      { name: 'New Arrivals', href: '/shop?filter=new-arrival' },
      { name: 'Offers', href: '/shop?filter=offer' },
      { name: 'Track Order', href: '/track' },
    ];
  }, [categories]);

  const mobileCategoryList = React.useMemo(() => {
    const activeCats = categories.filter((c) => c.is_active).map((c) => ({
      name: c.name,
      href: `/category/${c.slug}`,
      tag: c.slug.replace(/-/g, ' '),
      image_url: c.image_url,
      isSpecial: false,
    }));
    return [
      ...activeCats,
      { name: 'New Arrivals', href: '/shop?filter=new-arrival', tag: 'Just Dropped', isSpecial: true },
      { name: 'Special Offers', href: '/shop?filter=offer', tag: 'Up to 50% Off', isSpecial: true },
    ];
  }, [categories]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesSheetOpen, setIsCategoriesSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for subtle shadow/blur enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close categories sheet on route change
  useEffect(() => {
    setIsCategoriesSheetOpen(false);
  }, [pathname, searchParams]);

  // Exact routing check
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    if (href.includes('?')) {
      const [linkPath, queryString] = href.split('?');
      if (pathname !== linkPath) return false;
      const params = new URLSearchParams(queryString);
      for (const [key, val] of params.entries()) {
        if (searchParams.get(key) !== val) return false;
      }
      return true;
    }

    if (pathname === href) {
      if (href === '/shop') {
        const filter = searchParams.get('filter');
        if (
          filter === 'new-arrival' ||
          filter === 'new-arrivals' ||
          filter === 'offer' ||
          filter === 'offers'
        ) {
          return false;
        }
      }
      return true;
    }

    return false;
  };

  // Determine active state for mobile bottom tabs
  const isHomeActive = pathname === '/';
  const isShopActive =
    pathname === '/shop' &&
    !searchParams.get('filter')?.includes('new-arrival') &&
    !searchParams.get('filter')?.includes('offer');
  const isCategoryActive = pathname.startsWith('/category/') || isCategoriesSheetOpen;

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVBAR (Desktop & Mobile Header)                       */}
      {/* ------------------------------------------------------------- */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200/90 shadow-xs'
            : 'bg-white/90 backdrop-blur-sm border-b border-zinc-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Left: Brand Logo with Official Metallic MT Emblem */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-zinc-950 overflow-hidden flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-transform border border-zinc-800 shrink-0">
                  <Image
                    src="/images/favicon-512.png"
                    alt="Men's Territory MT Logo"
                    fill
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base lg:text-lg font-black tracking-[0.16em] sm:tracking-[0.18em] text-zinc-950 uppercase leading-tight font-heading">
                    {settings.store_name || "MEN'S TERRITORY"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.25em] text-zinc-500 font-semibold -mt-0.5">
                    {settings.tagline || "The Real Man's Choice"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links with Smooth Exact Routing */}
            <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase rounded-lg transition-all duration-200 ease-out whitespace-nowrap ${
                      active
                        ? 'text-white bg-zinc-950 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Desktop Search, Cart, Admin / Mobile Quick Contact) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Only: Quick WhatsApp Chat & Order (No duplicate cart or search on top) */}
              <a
                href={`https://wa.me/91${settings.whatsapp_number || '7815858973'}?text=Hello%20Men%27s%20Territory`}
                target="_blank"
                rel="noopener noreferrer"
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-all shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Desktop Only: Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 text-zinc-600 hover:text-zinc-950 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 text-xs transition-all active:scale-95 border border-zinc-200/80 shadow-xs"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-600 font-medium tracking-wide">
                  Search...
                </span>
              </button>

              {/* Desktop Only: Shopping Bag Trigger */}
              <button
                onClick={openCart}
                className="hidden lg:flex relative items-center justify-center p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white transition-all hover:scale-105 active:scale-95 shadow-xs"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
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
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MOBILE BOTTOM NAVIGATION DOCK (Native App Feel)             */}
      {/* ------------------------------------------------------------- */}
      <nav
        aria-label="Mobile Navigation"
        className="mobile-bottom-nav lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 transition-all duration-200"
      >
        <div className="grid grid-cols-5 items-center max-w-lg mx-auto px-2">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 text-center group active:scale-90 transition-transform ${
              isHomeActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <div className="relative">
              <Home
                className={`w-5 h-5 transition-transform duration-200 ${
                  isHomeActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-wide mt-1 transition-colors ${
                isHomeActive ? 'font-bold text-zinc-950' : 'font-medium text-zinc-500'
              }`}
            >
              Home
            </span>
            {isHomeActive && <span className="w-3.5 h-0.5 bg-zinc-950 rounded-full mt-0.5" />}
          </Link>

          {/* 2. Shop */}
          <Link
            href="/shop"
            className={`flex flex-col items-center justify-center py-1 text-center group active:scale-90 transition-transform ${
              isShopActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <div className="relative">
              <Compass
                className={`w-5 h-5 transition-transform duration-200 ${
                  isShopActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-wide mt-1 transition-colors ${
                isShopActive ? 'font-bold text-zinc-950' : 'font-medium text-zinc-500'
              }`}
            >
              Shop
            </span>
            {isShopActive && <span className="w-3.5 h-0.5 bg-zinc-950 rounded-full mt-0.5" />}
          </Link>

          {/* 3. Categories (Opens Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsCategoriesSheetOpen(!isCategoriesSheetOpen)}
            className={`flex flex-col items-center justify-center py-1 text-center group active:scale-90 transition-transform ${
              isCategoryActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-800'
            }`}
            aria-label="Browse categories"
          >
            <div className="relative">
              <LayoutGrid
                className={`w-5 h-5 transition-transform duration-200 ${
                  isCategoryActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-wide mt-1 transition-colors ${
                isCategoryActive ? 'font-bold text-zinc-950' : 'font-medium text-zinc-500'
              }`}
            >
              Categories
            </span>
            {isCategoryActive && (
              <span className="w-3.5 h-0.5 bg-zinc-950 rounded-full mt-0.5" />
            )}
          </button>

          {/* 4. Search */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-center text-zinc-500 hover:text-zinc-950 active:scale-90 transition-transform"
            aria-label="Search store"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium tracking-wide text-zinc-500 mt-1">Search</span>
          </button>

          {/* 5. Bag / Cart */}
          <button
            type="button"
            onClick={openCart}
            className="flex flex-col items-center justify-center py-1 text-center text-zinc-500 hover:text-zinc-950 active:scale-90 transition-transform relative"
            aria-label={`Open shopping cart with ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-wide text-zinc-500 mt-1">Bag</span>
          </button>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 3. MOBILE CATEGORIES BOTTOM SHEET                             */}
      {/* ------------------------------------------------------------- */}
      {isCategoriesSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden flex flex-col justify-end">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsCategoriesSheetOpen(false)}
          />

          {/* Sheet Drawer */}
          <div className="relative bg-white rounded-t-3xl border-t border-zinc-200 shadow-2xl p-5 pb-8 max-h-[82vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-zinc-950 font-heading">
                  Explore Silhouettes
                </h3>
                <p className="text-xs text-zinc-500">Curated menswear collections</p>
              </div>
              <button
                onClick={() => setIsCategoriesSheetOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-950 rounded-xl hover:bg-zinc-100 transition-colors"
                aria-label="Close categories sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mobileCategoryList.map((cat) => {
                const active = isLinkActive(cat.href);
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsCategoriesSheetOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      active
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                        : cat.isSpecial
                        ? 'bg-zinc-50 text-zinc-900 border-zinc-300 hover:bg-zinc-100'
                        : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {cat.name === 'New Arrivals' && (
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      {cat.name === 'Special Offers' && (
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          active
                            ? 'bg-zinc-800 text-zinc-200'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {cat.tag}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Brand Links & Store Info */}
            <div className="mt-5 pt-4 border-t border-zinc-200 flex flex-col gap-2.5 text-xs text-zinc-600">
              <Link
                href="/track"
                onClick={() => setIsCategoriesSheetOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-900 font-semibold border border-zinc-200 transition-colors"
              >
                <span>Track Your Order</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </Link>
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
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Men%27s+Territory+Men%27s+wear,+7HCJ%2BQC7,+Thadukupeta,+Nagari,+Taduku,+Andhra+Pradesh+517590"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-950 font-bold hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Thadukupeta, Nagari &rarr;</span>
                </a>
              </div>
              <div className="pt-1">
                <Link
                  href="/admin"
                  onClick={() => setIsCategoriesSheetOpen(false)}
                  className="block text-center py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl border border-zinc-200 font-bold transition-colors"
                >
                  Admin Portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. GLOBAL SEARCH MODAL OVERLAY                                */}
      {/* ------------------------------------------------------------- */}
      <SearchBarModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 w-full bg-white/90 border-b border-zinc-100 h-18 sm:h-20 flex items-center px-4 sm:px-8">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-zinc-950 overflow-hidden flex items-center justify-center border border-zinc-800">
                <Image
                  src="/images/favicon-512.png"
                  alt="Men's Territory"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-base font-black tracking-[0.18em] text-zinc-950 uppercase font-heading">
                MEN&apos;S TERRITORY
              </span>
            </div>
          </div>
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
