'use client';

import React from 'react';
import { Category } from '@/types';
import { Filter, X, RotateCcw, Check } from 'lucide-react';

export interface FilterState {
  categorySlug: string;
  minPrice: number;
  maxPrice: number;
  size: string;
  color: string;
  fit: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'discount' | 'name-asc';
  onlyFeatured: boolean;
  onlyBestSeller: boolean;
  onlyTrending: boolean;
  onlyOffer: boolean;
}

interface ProductFiltersProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  totalResults: number;
}

export default function ProductFilters({
  categories,
  filters,
  onFilterChange,
  onReset,
  isMobileOpen,
  setIsMobileOpen,
  totalResults,
}: ProductFiltersProps) {
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '40', '42', '44'];
  const colors = ['Black', 'White', 'Charcoal', 'Navy', 'Cream', 'Beige', 'Olive Green', 'Sky Blue'];
  const fits = ['Slim Tailored', 'Relaxed Baggy', 'Boxy Oversized', 'Wide Leg Baggy', 'Classic Regular'];

  const filterContent = (
    <div className="space-y-6 text-sm text-zinc-700">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-3 flex items-center justify-between">
          <span>Categories</span>
          {filters.categorySlug && (
            <button
              onClick={() => onFilterChange({ ...filters, categorySlug: '' })}
              className="text-[10px] text-zinc-500 hover:underline uppercase font-bold"
            >
              Clear
            </button>
          )}
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ ...filters, categorySlug: '' })}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
              !filters.categorySlug
                ? 'bg-zinc-950 text-white font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories
            .filter((c) => c.is_active)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ ...filters, categorySlug: cat.slug })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                  filters.categorySlug === cat.slug
                    ? 'bg-zinc-950 text-white font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <span>{cat.name}</span>
                {filters.categorySlug === cat.slug && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-zinc-200 pt-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-3">
          Price Range (₹)
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-600 font-semibold">
            <span>₹{filters.minPrice}</span>
            <span>₹{filters.maxPrice}</span>
          </div>
          <input
            type="range"
            min="500"
            max="4000"
            step="100"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-zinc-950 bg-zinc-200 rounded-lg cursor-pointer h-1.5"
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="border-t border-zinc-200 pt-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-3 flex items-center justify-between">
          <span>Available Sizes</span>
          {filters.size && (
            <button
              onClick={() => onFilterChange({ ...filters, size: '' })}
              className="text-[10px] text-zinc-500 hover:underline uppercase font-bold"
            >
              Clear
            </button>
          )}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => onFilterChange({ ...filters, size: filters.size === s ? '' : s })}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                filters.size === s
                  ? 'bg-zinc-950 text-white font-bold border-zinc-950 shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="border-t border-zinc-200 pt-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-3 flex items-center justify-between">
          <span>Color Palette</span>
          {filters.color && (
            <button
              onClick={() => onFilterChange({ ...filters, color: '' })}
              className="text-[10px] text-zinc-500 hover:underline uppercase font-bold"
            >
              Clear
            </button>
          )}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => onFilterChange({ ...filters, color: filters.color === c ? '' : c })}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                filters.color === c
                  ? 'bg-zinc-950 text-white font-bold border-zinc-950 shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Fit Profile */}
      <div className="border-t border-zinc-200 pt-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-3 flex items-center justify-between">
          <span>Fit Profile</span>
          {filters.fit && (
            <button
              onClick={() => onFilterChange({ ...filters, fit: '' })}
              className="text-[10px] text-zinc-500 hover:underline uppercase font-bold"
            >
              Clear
            </button>
          )}
        </h4>
        <div className="space-y-1">
          {fits.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange({ ...filters, fit: filters.fit === f ? '' : f })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                filters.fit === f
                  ? 'bg-zinc-950 text-white font-bold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <span>{f}</span>
              {filters.fit === f && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Special Highlights Toggle */}
      <div className="border-t border-zinc-200 pt-6 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-2">
          Collections
        </h4>
        <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyBestSeller}
            onChange={(e) => onFilterChange({ ...filters, onlyBestSeller: e.target.checked })}
            className="rounded border-zinc-300 bg-white text-zinc-950 focus:ring-0"
          />
          <span>Best Sellers Only</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyTrending}
            onChange={(e) => onFilterChange({ ...filters, onlyTrending: e.target.checked })}
            className="rounded border-zinc-300 bg-white text-zinc-950 focus:ring-0"
          />
          <span>Trending Items</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyOffer}
            onChange={(e) => onFilterChange({ ...filters, onlyOffer: e.target.checked })}
            className="rounded border-zinc-300 bg-white text-zinc-950 focus:ring-0"
          />
          <span>Special Offers / Discounts</span>
        </label>
      </div>

      {/* Reset Button */}
      <div className="border-t border-zinc-200 pt-6">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filter Panel */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-6 rounded-2xl border border-zinc-200 h-fit sticky top-28 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-950" />
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950">
              Filters ({totalResults})
            </h3>
          </div>
        </div>
        {filterContent}
      </aside>

      {/* Mobile Drawer Filter Panel */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white border-l border-zinc-200 p-6 overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-950" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950">
                    Refine Selection
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="text-zinc-500 hover:text-zinc-950 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">{filterContent}</div>

              <div className="pt-6 border-t border-zinc-200 mt-6">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full py-3.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  Show {totalResults} Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
