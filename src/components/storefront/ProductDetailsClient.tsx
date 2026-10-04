'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import ProductGallery from './ProductGallery';
import SizeGuideModal from './SizeGuideModal';
import {
  ShoppingBag,
  MessageSquareText,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import { generateWhatsAppUrl } from '@/services/orderService';

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

  // Direct WhatsApp message formatting for single-click order
  const phone = settings.whatsapp_number || '7815858973';
  const whatsappOrderMessage = `*MEN'S TERRITORY - DIRECT ORDER*

Product: *${product.name}*
SKU: ${product.sku}
Size: ${selectedSize}
Color: ${selectedColor}
Quantity: ${quantity}
Price: ₹${product.price} each
Total Amount: ₹${(product.price * quantity).toLocaleString('en-IN')}

Hello, I would like to place this order directly. Please confirm availability and payment details.`;

  const whatsappUrl = generateWhatsAppUrl(phone, whatsappOrderMessage);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
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
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & Category */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
                {product.brand || "MEN'S TERRITORY"}
              </span>
              <span className="text-xs text-zinc-400 font-mono">SKU: {product.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating & Reviews Placeholder */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
              ))}
            </div>
            <span className="text-zinc-800 font-semibold">4.9 / 5.0</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500">Territory Verified Quality</span>
          </div>

          {/* Pricing Row */}
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between shadow-xs">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.original_price > product.price && (
                  <span className="text-sm text-zinc-400 line-through font-mono">
                    ₹{product.original_price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Inclusive of all taxes. Free shipping on WhatsApp checkout.
              </p>
            </div>

            {product.discount_percent > 0 && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                {product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Stock Notification */}
          <div>
            {isOutOfStock ? (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold uppercase tracking-wider flex items-center gap-2">
                <span>Sold Out — Restocking Soon</span>
              </div>
            ) : isLowStock ? (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Hurry! Only {product.stock_quantity} units remaining in stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                <Check className="w-4 h-4" />
                <span>In Stock & Ready for Rapid Dispatch</span>
              </div>
            )}
          </div>

          {/* Color Selector */}
          {product.available_colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex justify-between">
                <span>Color: {selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.available_colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-700">
                  Select Size: {selectedSize}
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 hover:underline font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.available_sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-bold border text-center transition-all ${
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

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Quantity
              </label>
              <div className="inline-flex items-center border border-zinc-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-zinc-900 font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="p-2 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md ${
                isOutOfStock
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white hover:scale-[1.01] active:scale-98'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md hover:scale-[1.01] active:scale-98"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>ORDER ON WHATSAPP DIRECTLY</span>
            </a>
          </div>

          {/* Guarantees Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs text-zinc-600">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-zinc-700 shrink-0" />
              <span>Direct delivery dispatch across India with tracking updates</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-zinc-700 shrink-0" />
              <span>Hassle-free 7-day size exchange assistance via WhatsApp</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Genuine Fabric & Guaranteed Men&apos;s Territory Original</span>
            </div>
          </div>

          {/* Fabric, Fit & Specs */}
          <div className="border-t border-zinc-200 pt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950">
              Specifications & Details
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Fabric</span>
                <span className="text-zinc-900 font-semibold">{product.fabric}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Fit</span>
                <span className="text-zinc-900 font-semibold">{product.fit}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Material</span>
                <span className="text-zinc-900 font-semibold">{product.material || 'Cotton Blend'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Pattern</span>
                <span className="text-zinc-900 font-semibold">{product.pattern || 'Solid'}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-zinc-600 leading-relaxed">
              <h4 className="font-bold text-zinc-900 mb-1">Description</h4>
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
