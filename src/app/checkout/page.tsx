'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { processWhatsAppOrder } from '@/services/orderService';
import { Order } from '@/types';
import {
  MessageSquareText,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  ArrowLeft,
  Truck,
  Package,
  FileText,
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { settings } = useStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    alternative_phone: '',
    email: '',
    address: '',
    city: 'Nagari',
    district: 'Chittoor District',
    state: 'Andhra Pradesh',
    pincode: '517590',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }
    if (!formData.address.trim()) {
      showToast('Please enter your delivery address', 'error');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.trim().length < 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsToOrder = cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        size: item.selected_size,
        color: item.selected_color,
        unit_price: item.unit_price,
        total_price: item.total_price,
        image_url: item.product.thumbnail || item.product.images[0] || '',
      }));

      const result = await processWhatsAppOrder(
        {
          customer_name: formData.customer_name,
          phone: formData.phone,
          alternative_phone: formData.alternative_phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          notes: formData.notes,
          subtotal: cartTotal,
          discount: 0,
          total: cartTotal,
          items: itemsToOrder,
        },
        settings
      );

      if (result.success && result.order && result.whatsappUrl) {
        setCompletedOrder(result.order);
        setWhatsappUrl(result.whatsappUrl);

        // Confetti celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas blocked
        }

        showToast('Order saved! Redirecting to WhatsApp...', 'success');

        // Clear local shopping bag
        clearCart();

        // Open WhatsApp in new window
        window.open(result.whatsappUrl, '_blank');
      } else {
        showToast(result.error || 'Failed to place order. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderDetails = () => {
    if (!completedOrder) return;
    const text = `Order ID: ${completedOrder.order_number}\nCustomer: ${completedOrder.customer_name}\nTotal: ₹${completedOrder.total}`;
    navigator.clipboard.writeText(text);
    showToast('Order details copied to clipboard!', 'info');
  };

  // SUCCESS STATE VIEW
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Order Submitted
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-950 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs text-zinc-600 max-w-md mx-auto">
            Your order has been recorded in our store system. Complete the confirmation on WhatsApp with our team.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 text-left space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                Order Reference
              </span>
              <p className="text-lg font-mono font-black text-zinc-950">
                {completedOrder.order_number}
              </p>
            </div>
            <button
              onClick={copyOrderDetails}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-700 transition-colors font-medium border border-zinc-200"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Customer</span>
              <span className="text-zinc-900 font-semibold">{completedOrder.customer_name}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Phone Number</span>
              <span className="text-zinc-900 font-mono font-medium">{completedOrder.phone}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Delivery PIN</span>
              <span className="text-zinc-900 font-mono font-medium">{completedOrder.pincode}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Total Amount</span>
              <span className="text-zinc-950 font-black font-mono text-sm">
                ₹{completedOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 text-xs text-zinc-600">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold mb-0.5">
              Delivery Address
            </span>
            <p className="text-zinc-700">
              {completedOrder.address}, {completedOrder.city}, {completedOrder.district}, {completedOrder.state} - {completedOrder.pincode}
            </p>
          </div>
        </div>

        {/* WhatsApp CTA Action & Tracking */}
        <div className="space-y-3 pt-2">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[1.02]"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Open WhatsApp Chat Again</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Link
              href={`/track?id=${encodeURIComponent(completedOrder.order_number)}`}
              className="w-full inline-flex items-center justify-center gap-1.5 py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Track Live</span>
            </Link>

            <Link
              href={`/invoice/${encodeURIComponent(completedOrder.order_number)}`}
              target="_blank"
              className="w-full inline-flex items-center justify-center gap-1.5 py-3.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-300 transition-colors shadow-xs"
            >
              <FileText className="w-4 h-4 text-zinc-700" />
              <span>Tax Invoice</span>
            </Link>

            <Link
              href="/shop"
              className="w-full inline-flex items-center justify-center gap-1.5 py-3.5 px-4 bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-200 transition-colors shadow-xs"
            >
              <span>Shop More</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART CHECK
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-zinc-400 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-950">Your bag is empty</h2>
        <p className="text-xs text-zinc-500">Please add items to your shopping bag before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block mt-4 px-6 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors shadow-xs"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 transition-colors mb-3 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-zinc-950 tracking-tight">
          WhatsApp Order Checkout
        </h1>
        <p className="text-xs text-zinc-600 mt-1">
          Provide your shipping details below. We will save your order and generate your prefilled WhatsApp order message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Customer Information Form (7 Cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950 border-b border-zinc-200 pb-4">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  placeholder="e.g. Yaswanth Kumar"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Phone (WhatsApp Number) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Alternative Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="alternative_phone"
                  placeholder="Secondary contact"
                  value={formData.alternative_phone}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="For digital dispatch invoice"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950 border-b border-zinc-200 pb-4">
              2. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Street Address & House / Flat No. <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  name="address"
                  required
                  placeholder="Door No, Street Name, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  City / Town <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  placeholder="6-digit PIN"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Customer Notes / Special Packing Request
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Please call before delivery / Gift wrapping requested"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md hover:scale-[1.01] active:scale-98"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Order...
              </span>
            ) : (
              <>
                <MessageSquareText className="w-5 h-5" />
                <span>PLACE ORDER ON WHATSAPP &rarr;</span>
              </>
            )}
          </button>
        </form>

        {/* Right: Order Summary Sidebar (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-xs">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950 border-b border-zinc-200 pb-4">
              Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h2>

            {/* Product items mini list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                    <Image
                      src={item.product.thumbnail || item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-950 truncate">{item.product.name}</p>
                    <p className="text-zinc-500 mt-0.5">
                      Size: {item.selected_size} • Color: {item.selected_color}
                    </p>
                    <p className="text-zinc-500 font-mono">
                      Qty: {item.quantity} × ₹{item.unit_price}
                    </p>
                  </div>
                  <span className="font-bold text-zinc-950 font-mono shrink-0">
                    ₹{item.total_price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-zinc-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-zinc-900">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery</span>
                <span className="text-emerald-600 font-bold">Free</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between text-base font-black text-zinc-950">
                <span>Total Amount</span>
                <span className="font-mono">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-zinc-200 space-y-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Orders confirmed and tracked on WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Payment via UPI / Cash upon order confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
