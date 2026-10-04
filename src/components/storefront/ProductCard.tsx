'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, MessageSquareText, Eye } from 'lucide-react';
import { generateWhatsAppUrl } from '@/services/orderService';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { settings } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.available_sizes[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.thumbnail || product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  const secondaryImage = product.images[1] || primaryImage;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  // Direct WhatsApp enquiry message for this specific product
  const phone = settings.whatsapp_number || '7815858973';
  const directWhatsAppMessage = `Hello Men's Territory, I would like to order:
- ${product.name} (SKU: ${product.sku})
- Price: ₹${product.price}
- Size: ${selectedSize}
Please confirm availability!`;

  const whatsappUrl = generateWhatsAppUrl(phone, directWhatsAppMessage);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultColor = product.available_colors[0] || 'Standard';
    addToCart(product, selectedSize, defaultColor, 1);
  };

  return (
    <div
      className="luxury-card rounded-2xl flex flex-col group bg-white border border-zinc-200 shadow-xs hover:border-zinc-950 hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Crisp White & Light Grey Background */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 block">
        <Image
          src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discount_percent > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
              {product.discount_percent}% OFF
            </span>
          )}
          {product.is_best_seller && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-950 text-white shadow-xs">
              Best Seller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-zinc-200 shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-red-100 border border-red-300 text-red-700 font-bold text-xs uppercase tracking-widest rounded-lg">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 border border-amber-300 text-amber-800">
              Only {product.stock_quantity} left
            </span>
          </div>
        ) : null}

        {/* Quick View Button */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-8 h-8 rounded-full bg-white text-zinc-900 hover:bg-zinc-950 hover:text-white flex items-center justify-center transition-all shadow-md border border-zinc-200">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Category & Fit */}
          <div className="flex items-center justify-between text-[11px] font-medium mb-1">
            <span className="text-zinc-500 uppercase tracking-[0.15em] font-semibold">
              {product.category_name || product.subcategory || "Men's Wear"}
            </span>
            <span className="text-zinc-400 text-[10px] tracking-wide uppercase">{product.fit}</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-950 group-hover:text-zinc-700 transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-sm sm:text-base font-extrabold text-zinc-950 font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price > product.price && (
              <span className="text-xs text-zinc-400 line-through font-mono">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection Chips */}
        {product.available_sizes.length > 0 && !isOutOfStock && (
          <div className="pt-0.5">
            <div className="flex flex-wrap gap-1">
              {product.available_sizes.slice(0, 5).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border transition-colors ${
                    selectedSize === size
                      ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions Row */}
        <div className="pt-2.5 border-t border-zinc-100 grid grid-cols-2 gap-2">
          {/* Quick Add to Bag */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Add</span>
          </button>

          {/* Direct WhatsApp Order */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs"
            title="Order directly on WhatsApp"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span className="font-semibold">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
