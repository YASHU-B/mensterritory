'use client';

import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export default function ProductGrid({
  products,
  isLoading = false,
  emptyTitle = 'No products found',
  emptyMessage = 'Try adjusting your filters or search keywords to find what you are looking for.',
  onResetFilters,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse shadow-xs"
          >
            <div className="aspect-[3/4] w-full bg-zinc-100 rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 bg-zinc-100 rounded w-1/3" />
              <div className="h-4 bg-zinc-200 rounded w-4/5" />
              <div className="h-4 bg-zinc-100 rounded w-1/4" />
            </div>
            <div className="h-8 bg-zinc-100 rounded-xl w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center bg-white rounded-3xl border border-zinc-200 max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-950 mb-2">{emptyTitle}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed mb-6">{emptyMessage}</p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors shadow-xs"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
