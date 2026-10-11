'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { getProductBySlug, getProducts } from '@/lib/supabase/data-service';
import ProductDetailsClient from '@/components/storefront/ProductDetailsClient';
import ProductGrid from '@/components/storefront/ProductGrid';
import { ChevronRight, ArrowLeft, ShoppingBag } from 'lucide-react';

interface ProductPageClientWrapperProps {
  initialProduct: Product | null;
  slug: string;
  initialRelated: Product[];
}

export default function ProductPageClientWrapper({
  initialProduct,
  slug,
  initialRelated,
}: ProductPageClientWrapperProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [related, setRelated] = useState<Product[]>(initialRelated);
  const [isLoading, setIsLoading] = useState(!initialProduct);

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      return;
    }

    let isMounted = true;
    async function loadFallback() {
      setIsLoading(true);
      try {
        const found = await getProductBySlug(slug);
        if (isMounted && found) {
          setProduct(found);
          const relatedProds = await getProducts({ limit: 4 });
          setRelated(relatedProds.filter((p) => p.id !== found.id).slice(0, 4));
        }
      } catch (e) {
        console.error('Failed to load product fallback:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFallback();
    return () => {
      isMounted = false;
    };
  }, [initialProduct, slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10 space-y-8">
        <div className="h-4 w-44 rounded-md animatic-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-14">
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-2.5 sm:gap-4">
            <div className="flex lg:flex-col gap-2 shrink-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-12 h-14 sm:w-16 sm:h-20 lg:w-20 lg:h-24 rounded-xl animatic-shimmer" />
              ))}
            </div>
            <div className="flex-1 w-full h-[270px] sm:h-[380px] lg:h-auto lg:aspect-[3/4] rounded-2xl sm:rounded-3xl animatic-shimmer" />
          </div>
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <div className="h-3.5 w-24 rounded animatic-shimmer" />
              <div className="h-8 w-4/5 rounded-xl animatic-shimmer" />
            </div>
            <div className="h-7 w-32 rounded-lg animatic-shimmer" />
            <div className="h-16 w-full rounded-2xl animatic-shimmer" />
            <div className="space-y-2">
              <div className="h-3 w-20 rounded animatic-shimmer" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-11 h-11 rounded-xl animatic-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-2.5 pt-2">
              <div className="h-13 w-full rounded-2xl animatic-shimmer" />
              <div className="h-13 w-full rounded-2xl animatic-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-950 shadow-xs">
            <ShoppingBag className="w-8 h-8 text-zinc-500" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">
              Catalog Notice
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight">
              Product Not Found
            </h1>
            <p className="text-xs text-zinc-600 leading-relaxed">
              The requested style is currently unavailable or may have been updated.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8 lg:py-10 space-y-8 sm:space-y-12 lg:space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <Link href="/shop" className="hover:text-zinc-950 transition-colors">Shop</Link>
        {product.category_name && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-500">{product.category_name}</span>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-950 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Interactive Product Details Section */}
      <ProductDetailsClient product={product} />

      {/* Related Products Rail */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
                You May Also Like
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight mt-0.5">
                Related Styles
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              View More &rarr;
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
