'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/storefront/ProductGrid';
import ProductFilters, { FilterState } from '@/components/storefront/ProductFilters';
import { Category, Product } from '@/types';
import { getCategories, getProducts } from '@/lib/supabase/data-service';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const initialFilters: FilterState = {
    categorySlug: categoryParam,
    minPrice: 500,
    maxPrice: 3500,
    size: '',
    color: '',
    fit: '',
    sortBy: 'newest',
    onlyFeatured: false,
    onlyBestSeller: filterParam === 'best-seller',
    onlyTrending: filterParam === 'trending',
    onlyOffer: filterParam === 'offer',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync url param changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categorySlug: categoryParam,
      onlyBestSeller: filterParam === 'best-seller',
      onlyTrending: filterParam === 'trending',
      onlyOffer: filterParam === 'offer',
    }));
  }, [categoryParam, filterParam]);

  // Load Categories & Products
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts({
            categorySlug: filters.categorySlug || undefined,
            search: searchParam || undefined,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            size: filters.size || undefined,
            color: filters.color || undefined,
            fit: filters.fit || undefined,
            sortBy: filters.sortBy,
            onlyFeatured: filters.onlyFeatured || undefined,
            onlyBestSeller: filters.onlyBestSeller || undefined,
            onlyTrending: filters.onlyTrending || undefined,
            onlyOffer: filters.onlyOffer || undefined,
          }),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [filters, searchParam]);

  const handleResetFilters = () => {
    setFilters({
      categorySlug: '',
      minPrice: 500,
      maxPrice: 3500,
      size: '',
      color: '',
      fit: '',
      sortBy: 'newest',
      onlyFeatured: false,
      onlyBestSeller: false,
      onlyTrending: false,
      onlyOffer: false,
    });
  };

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.slug === filters.categorySlug);
  }, [categories, filters.categorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="mb-10 pb-8 border-b border-zinc-200 relative">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
          Haute Menswear Catalog
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-1.5 relative z-10">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-zinc-950 tracking-tight font-heading">
              {activeCategory ? activeCategory.name : searchParam ? `Search: "${searchParam}"` : 'All Collections'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal mt-1.5 max-w-xl leading-relaxed">
              {activeCategory?.description ||
                "Explore curated oversized wear, high-street baggy pants, crisp executive formals, and premium cotton essentials."}
            </p>
          </div>

          {/* Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-300 text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-zinc-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-700 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="bg-transparent text-zinc-900 focus:outline-none cursor-pointer pr-2 font-medium tracking-wide"
              >
                <option value="newest" className="bg-white text-zinc-900">Newest Arrivals</option>
                <option value="price-asc" className="bg-white text-zinc-900">Price: Low to High</option>
                <option value="price-desc" className="bg-white text-zinc-900">Price: High to Low</option>
                <option value="popular" className="bg-white text-zinc-900">Most Popular</option>
                <option value="discount" className="bg-white text-zinc-900">Highest Discount</option>
                <option value="name-asc" className="bg-white text-zinc-900">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="flex gap-8">
        <ProductFilters
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          isMobileOpen={isMobileFilterOpen}
          setIsMobileOpen={setIsMobileFilterOpen}
          totalResults={products.length}
        />

        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-3" />
          Loading Men&apos;s Territory Catalog...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
