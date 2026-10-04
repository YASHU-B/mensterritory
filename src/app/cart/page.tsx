'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-6 text-zinc-400 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black uppercase text-zinc-950 tracking-tight">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mt-2 mb-8">
          You haven&apos;t added any items to your bag yet. Explore our curated collections of baggy fits, tailored formals, and oversized shirts.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-105"
        >
          <span>Explore The Territory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Clear Action */}
      <div className="flex items-end justify-between border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Review Bag
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-950 tracking-tight mt-1">
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-red-500 transition-colors underline"
        >
          Clear entire bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Items list (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white border border-zinc-200 transition-colors shadow-xs"
            >
              {/* Product Thumbnail */}
              <div className="relative w-full sm:w-28 h-36 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                <Image
                  src={item.product.thumbnail || item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                        {item.product.category_name || 'Men\'s Wear'}
                      </span>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-base font-bold text-zinc-950 hover:text-zinc-600 transition-colors block line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-zinc-400 font-mono">SKU: {item.product.sku}</span>
                    </div>

                    <span className="text-base sm:text-lg font-black text-zinc-950 font-mono">
                      ₹{item.total_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Size & Color Tags */}
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono text-[11px] font-semibold">
                      Size: {item.selected_size}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200 text-[11px] font-semibold">
                      Color: {item.selected_color}
                    </span>
                    <span className="text-zinc-400 font-mono">
                      (₹{item.unit_price} each)
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Stepper & Remove */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4">
                  <div className="flex items-center border border-zinc-300 rounded-xl bg-white p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 rounded-lg transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-zinc-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 rounded-lg transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 transition-colors p-1 font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-xs">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 border-b border-zinc-200 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-mono font-semibold text-zinc-900">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Shipping & Handling</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Direct WhatsApp Service</span>
                <span className="font-bold text-emerald-600">Included</span>
              </div>

              <div className="border-t border-zinc-200 pt-3 flex justify-between text-base font-black text-zinc-950">
                <span>Estimated Total</span>
                <span className="font-mono">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-98"
              >
                <span>Proceed to WhatsApp Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Badges */}
            <div className="pt-4 border-t border-zinc-200 space-y-2.5 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Fast dispatch from Nagari showroom</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified products with easy exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>7-Day size replacement assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
