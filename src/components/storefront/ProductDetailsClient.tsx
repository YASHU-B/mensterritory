'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import ProductGallery from './ProductGallery';
import SizeGuideModal from './SizeGuideModal';
import {
  ShoppingBag,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Check,
  Plus,
  Minus,
} from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { settings } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.available_sizes[0] || 'M'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.available_colors[0] || 'Standard'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-14">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={
              [
                ...(Array.isArray(product.images) ? product.images : []),
                product.thumbnail,
                product.featured_image,
              ].filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
            }
            productName={product.name}
          />
        </div>

        {/* Right: Product Information & Purchase CTAs (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-5">
          {/* Brand, Title & Rating Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="uppercase tracking-[0.2em] text-zinc-500 font-bold">
                {product.brand || "MEN'S TERRITORY"}
              </span>
              <span className="text-zinc-400 font-mono">SKU: {product.sku}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-zinc-950 tracking-tight leading-snug font-heading">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 pt-0.5 text-[11px] sm:text-xs">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-500" />
                ))}
              </div>
              <span className="text-zinc-800 font-semibold">4.9</span>
              <span className="text-zinc-300">•</span>
              {isOutOfStock ? (
                <span className="text-red-600 font-bold">Sold Out</span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Only {product.stock_quantity} left
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  In Stock &bull; Fast Dispatch
                </span>
              )}
            </div>
          </div>

          {/* Compact Pricing Row */}
          <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-50 sm:bg-white border border-zinc-200 flex items-center justify-between shadow-xs">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 font-mono">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.original_price > product.price && (
                  <span className="text-xs sm:text-sm text-zinc-400 line-through font-mono">
                    ₹{product.original_price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">
                Inclusive of all taxes &bull; Shipping calculated based on delivery location
              </p>
            </div>

            {product.discount_percent > 0 && (
              <span className="px-2.5 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                {product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Color Selector */}
          {product.available_colors.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700 flex justify-between">
                <span>Color: {selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.available_colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      selectedColor === color
                        ? 'bg-zinc-950 text-white font-bold border-zinc-950 shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector + Size Guide Link */}
          {product.available_sizes.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-700">
                  Size: <span className="text-zinc-950">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.available_sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-10 sm:min-w-12 py-1.5 sm:py-2 px-2.5 rounded-lg sm:rounded-xl text-xs font-mono font-bold border text-center transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart Button */}
          <div className="pt-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Compact Quantity Stepper */}
              {!isOutOfStock && (
                <div className="flex items-center border border-zinc-300 rounded-xl bg-white p-0.5 shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 rounded-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs sm:text-sm font-bold text-zinc-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-2 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 rounded-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-[0.16em] transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                    : 'bg-zinc-950 hover:bg-zinc-800 text-white active:scale-98 cursor-pointer'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-[11px] sm:text-xs text-zinc-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
              <span>Direct delivery dispatch across India with tracking updates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
              <span>Hassle-free 7-day size exchange assistance via WhatsApp</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Genuine Fabric & Guaranteed Men&apos;s Territory Original</span>
            </div>
          </div>

          {/* Fabric, Fit & Specs */}
          <div className="border-t border-zinc-200 pt-3.5 space-y-2.5">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-950">
              Specifications & Details
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Fabric</span>
                <span className="text-zinc-900 font-semibold">{product.fabric}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Fit</span>
                <span className="text-zinc-900 font-semibold">{product.fit}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Material</span>
                <span className="text-zinc-900 font-semibold">{product.material || 'Cotton Blend'}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Pattern</span>
                <span className="text-zinc-900 font-semibold">{product.pattern || 'Solid'}</span>
              </div>
            </div>

            <div className="pt-1 text-xs text-zinc-600 leading-relaxed">
              <h4 className="font-bold text-zinc-900 mb-0.5">Description</h4>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        categoryName={product.category_name || product.subcategory}
      />
    </>
  );
}
