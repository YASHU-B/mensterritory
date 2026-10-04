'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // Show active categories ordered by display_order
  const displayCategories = categories
    .filter((c) => c.is_active)
    .slice(0, 8);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Curated Wardrobe Edits
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-zinc-950 mt-1 font-heading">
            Shop By Silhouette
          </h2>
        </div>
        <Link
          href="/shop"
          className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-zinc-600 hover:text-zinc-950 transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowUpRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="luxury-card group relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all"
          >
            {/* Image or Clean Light Grey Atelier Pattern */}
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 flex items-center justify-center">
                <span className="text-6xl font-black font-mono text-zinc-300 select-none tracking-tighter">
                  MT
                </span>
              </div>
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Label */}
            <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between z-10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-300">
                  Collection
                </span>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide group-hover:text-zinc-200 transition-colors font-heading">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-[11px] text-zinc-300 line-clamp-1 mt-0.5 font-light">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="w-8 h-8 rounded-full bg-white text-zinc-950 group-hover:bg-zinc-950 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-sm">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
