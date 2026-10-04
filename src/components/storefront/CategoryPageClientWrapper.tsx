'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, Product } from '@/types';
import { getCategoryBySlug, getCategories, getProducts } from '@/lib/supabase/data-service';
import ProductGrid from '@/components/storefront/ProductGrid';
import { ChevronRight, ArrowLeft, Package } from 'lucide-react';

interface CategoryPageClientWrapperProps {
  initialCategory: Category | null;
  initialProducts: Product[];
  slug: string;
  initialOtherCategories: Category[];
}

export default function CategoryPageClientWrapper({
  initialCategory,
  initialProducts,
  slug,
  initialOtherCategories,
}: CategoryPageClientWrapperProps) {
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [otherCategories, setOtherCategories] = useState<Category[]>(initialOtherCategories);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryData() {
      try {
        const [cat, prods, allCats] = await Promise.all([
          getCategoryBySlug(slug),
          getProducts({ categorySlug: slug }),
          getCategories(),
        ]);

        if (isMounted) {
          if (cat) {
            setCategory(cat);
          }
          setProducts(prods);
          if (allCats && allCats.length > 0) {
            setOtherCategories(allCats.filter((c) => c.slug !== slug && c.is_active).slice(0, 6));
          }
        }
      } catch (err) {
        console.error('Failed to load category client data:', err);
      }
    }

    loadCategoryData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!category) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-zinc-400 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-950">Category Not Found</h2>
        <p className="text-xs text-zinc-500">
          The collection you are looking for is not currently active.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-4 px-6 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors shadow-xs"
        >
          Explore Full Collection
        </Link>
      </div>
    );
  }

  const categoryName = category.name || 'Collection';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-950 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-zinc-950 transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-950 font-semibold">{categoryName}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 p-8 sm:p-14 shadow-xs">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              category.image_url ||
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600'
            }
            alt={categoryName}
            fill
            priority
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 via-zinc-100/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-zinc-500">
            Men&apos;s Territory Collection
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-zinc-950 tracking-tight leading-none font-heading">
            {categoryName}
          </h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
              {category.description}
            </p>
          )}
          <div className="pt-2 text-xs text-zinc-500 font-mono">
            Showing {products.length} {products.length === 1 ? 'exclusive style' : 'exclusive styles'}
          </div>
        </div>
      </div>

      {/* Category Products Grid */}
      <div>
        <ProductGrid
          products={products}
          emptyTitle={`No ${categoryName} available right now`}
          emptyMessage="Check back shortly or explore our other collections."
        />
      </div>

      {/* Related Categories Rail */}
      {otherCategories.length > 0 && (
        <div className="pt-12 border-t border-zinc-200">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Explore Other Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-semibold border border-zinc-200 transition-colors shadow-xs"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
