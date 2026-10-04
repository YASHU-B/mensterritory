import React from 'react';
import Link from 'next/link';
import Hero from '@/components/storefront/Hero';
import CategoryGrid from '@/components/storefront/CategoryGrid';
import ProductGrid from '@/components/storefront/ProductGrid';
import PromotionalBanner from '@/components/storefront/PromotionalBanner';
import InstagramSection from '@/components/storefront/InstagramSection';
import StoreLocationSection from '@/components/storefront/StoreLocationSection';
import { getCategories, getProducts } from '@/lib/supabase/data-service';
import { ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [categories, newArrivals, bestSellers, trending] = await Promise.all([
    getCategories(),
    getProducts({ onlyNewArrival: true, limit: 4 }),
    getProducts({ onlyBestSeller: true, limit: 4 }),
    getProducts({ onlyTrending: true, limit: 4 }),
  ]);

  const hasAnyProducts = newArrivals.length > 0 || bestSellers.length > 0 || trending.length > 0;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured Categories */}
      <CategoryGrid categories={categories} />

      {/* 3. New Arrivals (Rendered when products exist) */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#d4af37] text-xs uppercase font-bold tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Just Dropped</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-heading">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?filter=new-arrival"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-300 transition-colors"
            >
              <span>See All New Drops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}

      {/* 4. Promotional Banner */}
      <PromotionalBanner />

      {/* 5. Best Sellers (Rendered when products exist) */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#d4af37] text-xs uppercase font-bold tracking-widest mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-heading">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop?filter=best-seller"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-300 transition-colors"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={bestSellers} />
        </section>
      )}

      {/* 6. Trending Streetwear Collection (Rendered when products exist) */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#d4af37] text-xs uppercase font-bold tracking-widest mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Streetwear Edit</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-heading">
                Trending In The Territory
              </h2>
            </div>
            <Link
              href="/shop?filter=trending"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-300 transition-colors"
            >
              <span>Explore Trending</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={trending} />
        </section>
      )}

      {/* If No Products Added Yet: Clean High-Fashion Welcome Block */}
      {!hasAnyProducts && (
        <section className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-xs space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-950">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 font-heading">
              New Season Drops Arriving Daily
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto font-light leading-relaxed">
              Our curated collection is currently being prepared with fresh tailored fits and oversized essentials. Enquire directly on WhatsApp or log into the Admin portal to manage products.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/917815858973?text=Hello%20Men%27s%20Territory,%20I%20would%20like%20to%20know%20about%20your%20latest%20arrivals."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest shadow-xs transition-colors"
              >
                Enquire on WhatsApp
              </a>
              <Link
                href="/admin/products/new"
                className="px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-xs"
              >
                Admin: Add Products &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. Store Location & Heritage */}
      <StoreLocationSection />

      {/* 8. Instagram Showcase */}
      <InstagramSection />
    </div>
  );
}
