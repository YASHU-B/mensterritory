'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Dark Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Clear Centered Modal Container */}
      <div className="relative w-full max-w-lg sm:max-w-xl bg-white border border-zinc-200 text-zinc-900 rounded-3xl flex flex-col shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
        {/* Clear Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-zinc-950 font-heading">
                Shopping Bag
              </h2>
              <span className="text-[11px] text-zinc-500 font-medium">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your selection
              </span>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="text-zinc-400 hover:text-zinc-950 p-2 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close cart modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Delivery Notice */}
        <div className="bg-zinc-100/70 px-4 sm:px-5 py-2.5 border-b border-zinc-200 text-[11px] text-zinc-600 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
          <span>Shipping fee is calculated at checkout based on your delivery address.</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4 text-zinc-400 shadow-xs">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">Your bag is empty</h3>
              <p className="text-xs text-zinc-500 max-w-xs mt-1 leading-relaxed">
                Explore our curated collections of baggy denim, crisp formals, and premium menswear.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 px-6 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 sm:gap-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-200 relative group"
              >
                {/* Thumbnail */}
                <div className="relative w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                  <Image
                    src={item.product.thumbnail || item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                    alt={item.product.name}
                    fill
                    sizes="80px"
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
                        className="text-xs sm:text-sm font-bold text-zinc-950 hover:text-zinc-600 line-clamp-1 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold text-zinc-900">
                        {item.selected_size}
                      </span>
                      {item.selected_color && item.selected_color !== 'Standard' && (
                        <span>&bull; {item.selected_color}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Price Row */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-zinc-300 rounded-lg bg-white p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-zinc-100 text-zinc-600 rounded transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-zinc-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-zinc-100 text-zinc-600 rounded transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-black text-zinc-950 font-mono">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[10px] text-zinc-400 font-mono">
                          ₹{item.product.price} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove Item Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-3 right-3 text-zinc-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50/80 space-y-3.5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-semibold text-zinc-900 font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span className="text-zinc-800 font-medium">Calculated by delivery location</span>
              </div>
              <div className="border-t border-zinc-200 pt-2 flex justify-between text-base font-black text-zinc-950 font-mono">
                <span className="font-sans">Estimated Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-[0.18em] rounded-xl shadow-md transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  onClick={closeCart}
                  className="text-zinc-500 hover:text-zinc-950 font-medium transition-colors cursor-pointer"
                >
                  &larr; Continue Shopping
                </button>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="text-zinc-900 font-bold hover:underline transition-colors"
                >
                  View Full Bag &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
