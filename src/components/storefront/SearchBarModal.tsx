'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { Product } from '@/types';
import { getProducts } from '@/lib/supabase/data-service';

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchBarModal({ isOpen, onClose }: SearchBarModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await getProducts({ search: query.trim(), limit: 6 });
        setResults(data);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularTags = ['Oversized', 'Baggy Pants', 'Formal Shirts', 'Cargo', 'Black', 'Jackets'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-4 border-b border-zinc-200">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shirts, baggy pants, oversized tees, SKUs..."
            className="w-full bg-transparent text-zinc-950 placeholder-zinc-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-950 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1.5 rounded-lg border border-zinc-200 font-mono transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4">
          {isLoading ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin mx-auto mb-3" />
              Searching styles...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-2 px-2">
                Matching Products ({results.length})
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors group border border-transparent hover:border-zinc-200"
                >
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                    <Image
                      src={product.thumbnail || product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-950 truncate group-hover:text-zinc-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {product.category_name || product.subcategory || 'Men\'s Wear'} • SKU: {product.sku}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-zinc-950">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.original_price > product.price && (
                        <span className="text-xs text-zinc-400 line-through">
                          ₹{product.original_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all mr-2 shrink-0" />
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center">
              <p className="text-zinc-800 font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-zinc-500 text-xs mt-1">Try checking for typos or searching general terms like shirts, pants, or baggy.</p>
            </div>
          ) : (
            <div>
              <div className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 px-1 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-zinc-950" /> Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-950 text-zinc-700 px-3 py-1.5 rounded-full border border-zinc-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <span>Men&apos;s Territory • The Real Man&apos;s Choice</span>
          {results.length > 0 && (
            <Link
              href={`/shop?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-zinc-950 hover:underline font-semibold flex items-center gap-1"
            >
              View all results &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
