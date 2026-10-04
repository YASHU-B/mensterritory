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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-4 bg-zinc-200 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-zinc-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-zinc-200 rounded-xl w-3/4" />
            <div className="h-6 bg-zinc-100 rounded-lg w-1/4" />
            <div className="h-24 bg-zinc-100 rounded-2xl" />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
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
