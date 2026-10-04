'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 text-zinc-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-zinc-950" />
              <h2 className="text-base font-bold tracking-wider uppercase text-zinc-950">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="text-zinc-500 hover:text-zinc-950 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Note */}
          <div className="bg-zinc-50 px-5 py-2.5 border-b border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fast dispatch directly via WhatsApp | Cash/UPI on Delivery</span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4 text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zinc-950">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mt-1">
                  Discover our modern oversized fits, crisp formals, and premium baggy collections.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 relative group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                    <Image
                      src={item.product.thumbnail || item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start pr-6">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-bold text-zinc-950 hover:text-zinc-600 line-clamp-1 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-500">
                        {item.selected_size && (
                          <span className="bg-white px-2 py-0.5 rounded border border-zinc-200 text-zinc-800 font-mono text-[11px] font-semibold">
                            Size: {item.selected_size}
                          </span>
                        )}
                        {item.selected_color && (
                          <span className="bg-white px-2 py-0.5 rounded border border-zinc-200 text-zinc-800 text-[11px] font-semibold">
                            {item.selected_color}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-zinc-900 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="text-sm font-black text-zinc-950">
                        ₹{item.total_price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Delete item button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50/70 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-zinc-600 text-xs">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-zinc-600 text-xs">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="border-t border-zinc-200 pt-2 flex justify-between text-base font-black text-zinc-950">
                  <span>Estimated Total</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-[0.18em] rounded-xl shadow-md transition-all active:scale-98"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full block text-center py-2.5 text-xs text-zinc-600 hover:text-zinc-950 transition-colors font-semibold"
                >
                  View Full Cart Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
