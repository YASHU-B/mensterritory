'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  MessageCircle,
  Copy,
  ExternalLink,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Calendar,
  Printer,
  FileText,
} from 'lucide-react';
import { lookupCustomerOrders } from '@/lib/supabase/data-service';
import { Order, OrderStatus } from '@/types';
import { useToast } from '@/components/ui/Toast';

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Order Placed', desc: 'Order received & logged in system' },
  { status: 'Confirmed', label: 'Confirmed', desc: 'Verified by Men\'s Territory team' },
  { status: 'Packed', label: 'Packed & Inspected', desc: 'Quality checked & packed for dispatch' },
  { status: 'Shipped', label: 'Dispatched / In Transit', desc: 'Handed over to courier partner' },
  { status: 'Delivered', label: 'Delivered', desc: 'Safely delivered to your address' },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'Pending':
      return 0;
    case 'WhatsApp Contacted':
    case 'Confirmed':
      return 1;
    case 'Processing':
    case 'Packed':
      return 2;
    case 'Shipped':
      return 3;
    case 'Delivered':
      return 4;
    case 'Cancelled':
      return -1;
    default:
      return 0;
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('order') || searchParams.get('phone') || '';
  const { showToast } = useToast();

  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchStr: string) => {
    const term = searchStr.trim();
    if (!term) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await lookupCustomerOrders(term);
      setOrders(results);
      if (results.length > 0) {
        setSelectedOrder(results[0]);
      } else {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Tracking search error:', err);
      showToast('Failed to retrieve order details. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const copyOrderId = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    showToast(`Order reference ${orderNumber} copied to clipboard!`, 'info');
  };

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.status) : 0;
  const isCancelled = selectedOrder?.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-zinc-200/70 text-zinc-700 text-[10px] font-bold tracking-widest uppercase">
            Real-Time Fulfillment
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-zinc-950 tracking-tight font-heading">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Check the live fulfillment progress of your Men&apos;s Territory order. Enter your <strong>Order ID</strong> (e.g. <code className="bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-900 font-mono text-xs">MT-20261004-XXXX</code>) or your <strong>10-digit mobile number</strong>.
          </p>
        </div>

        {/* Search Bar Form */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. MT-...) or 10-digit phone number"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper Tips */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500 pt-3 border-t border-zinc-100">
            <span>Tip: Check your WhatsApp order confirmation for your Order Reference ID.</span>
            <a
              href="https://wa.me/917815858973?text=Hi%20Men's%20Territory,%20I%20need%20help%20tracking%20my%20order"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Need help? Ask on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Multiple Orders Tabs (if customer has several orders with the same phone) */}
        {orders.length > 1 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Found {orders.length} orders matching your inquiry:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono whitespace-nowrap transition-all border ${
                    selectedOrder?.id === ord.id
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {ord.order_number} ({ord.status})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {selectedOrder ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Order Card */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
                      Order Reference
                    </span>
                    <button
                      onClick={() => copyOrderId(selectedOrder.order_number)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 transition-colors"
                      title="Copy Reference Number"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                    <Link
                      href={`/invoice/${encodeURIComponent(selectedOrder.order_number)}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-800 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-0.5 rounded border border-zinc-300 transition-colors"
                      title="View & Print Official Tax Invoice"
                    >
                      <FileText className="w-3 h-3 text-zinc-600" />
                      <span>Invoice</span>
                    </Link>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 tracking-tight">
                    {selectedOrder.order_number}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span>Source: {selectedOrder.order_source || 'WhatsApp'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
                    Current Status
                  </span>
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      isCancelled
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : selectedOrder.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-zinc-900 text-white shadow-xs'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCancelled
                          ? 'bg-rose-500'
                          : selectedOrder.status === 'Delivered'
                          ? 'bg-emerald-500'
                          : 'bg-amber-400 animate-pulse'
                      }`}
                    />
                    <span>{selectedOrder.status}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">
                    Total:{' '}
                    <strong className="text-zinc-950 font-mono">
                      ₹{selectedOrder.total.toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Progress Milestones Stepper */}
              {isCancelled ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold uppercase tracking-wider text-rose-950">
                      Order Cancelled
                    </h4>
                    <p className="text-rose-700">
                      This order was cancelled. If you believe this was done in error or would like to reactivate this order, please contact our team via WhatsApp.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-700 mb-6">
                    Fulfillment Milestones
                  </h3>

                  {/* Desktop / Tablet Stepper */}
                  <div className="relative">
                    {/* Connecting Bar */}
                    <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-zinc-200 -z-0">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{
                          width: `${(Math.max(0, currentStep) / (STATUS_STEPS.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div
                            key={step.status}
                            className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2 group"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'bg-zinc-100 text-zinc-400 border border-zinc-300'
                              } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <p
                                className={`text-xs font-bold leading-tight ${
                                  isCompleted ? 'text-zinc-950 font-black' : 'text-zinc-400'
                                }`}
                              >
                                {step.label}
                              </p>
                              <p className="text-[10px] text-zinc-500 leading-normal max-w-[130px] sm:mx-auto">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tracking / Internal Dispatch Notes (if store admin entered courier details) */}
              {selectedOrder.internal_notes && selectedOrder.internal_notes.trim() && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-950">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Courier / Dispatch Information</span>
                  </div>
                  <p className="text-xs text-zinc-700 whitespace-pre-wrap font-mono">
                    {selectedOrder.internal_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Two Column Layout: Order Items & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Order Items (7 Cols) */}
              <div className="md:col-span-7 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 border-b border-zinc-200 pb-3 flex items-center justify-between">
                  <span>Ordered Items</span>
                  <span className="text-zinc-500 font-mono font-medium">
                    {selectedOrder.items?.length || 0} items
                  </span>
                </h3>

                <div className="space-y-4">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex gap-4 items-center pb-4 border-b border-zinc-100 last:border-none last:pb-0"
                      >
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                          {it.image_url ? (
                            <Image
                              src={it.image_url}
                              alt={it.product_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-950 truncate">
                            {it.product_name}
                          </p>
                          <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500 mt-1">
                            {it.size && (
                              <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-800 font-semibold border border-zinc-200">
                                Size: {it.size}
                              </span>
                            )}
                            {it.color && (
                              <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-800 font-semibold border border-zinc-200">
                                Color: {it.color}
                              </span>
                            )}
                            <span className="text-zinc-600 font-mono">
                              Qty: {it.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-black text-zinc-950 font-mono">
                            ₹{it.total_price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            ₹{it.unit_price} each
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500">Order item details stored with order.</p>
                  )}
                </div>

                {/* Pricing Summary */}
                <div className="pt-4 border-t border-zinc-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-mono text-zinc-900">
                      ₹{selectedOrder.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span className="font-mono">
                        -₹{selectedOrder.discount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase">Free</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-950">
                    <span>Total Paid / Payable</span>
                    <span className="font-mono">
                      ₹{selectedOrder.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Details & Support (5 Cols) */}
              <div className="md:col-span-5 space-y-6">
                {/* Delivery Address Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 border-b border-zinc-200 pb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-950" />
                    <span>Shipping Destination</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                        Customer
                      </span>
                      <p className="font-bold text-zinc-950">{selectedOrder.customer_name}</p>
                    </div>

                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                        Phone Number
                      </span>
                      <p className="font-mono text-zinc-800 font-semibold">{selectedOrder.phone}</p>
                      {selectedOrder.alternative_phone && (
                        <p className="font-mono text-zinc-500 text-[11px]">
                          Alt: {selectedOrder.alternative_phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                        Address
                      </span>
                      <p className="text-zinc-700 leading-relaxed">
                        {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.district}, {selectedOrder.state} -{' '}
                        <strong className="text-zinc-950 font-mono">{selectedOrder.pincode}</strong>
                      </p>
                    </div>

                    {selectedOrder.notes && (
                      <div className="pt-2 border-t border-zinc-100">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                          Delivery Note
                        </span>
                        <p className="text-zinc-600 italic">&ldquo;{selectedOrder.notes}&rdquo;</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tax Invoice Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-3.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-zinc-950" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950">
                      Official Tax Invoice
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    View or download the official GST-compliant retail cash memo with itemized tax and pricing breakdown.
                  </p>
                  <Link
                    href={`/invoice/${encodeURIComponent(selectedOrder.order_number)}`}
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:scale-[1.02]"
                  >
                    <Printer className="w-4 h-4" />
                    <span>View & Print Tax Invoice</span>
                  </Link>
                </div>

                {/* Direct WhatsApp Action */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950">
                      Need Assistance?
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Have questions about delivery timing, sizing, or want to make changes to your order? Our team is available on WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/917815858973?text=Hi%20Men's%20Territory,%20I'm%20tracking%20my%20Order%20${encodeURIComponent(
                      selectedOrder.order_number
                    )}%20(Status:%20${encodeURIComponent(
                      selectedOrder.status
                    )}).%20Please%20share%20an%20update.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          hasSearched &&
          !loading && (
            <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center space-y-4 shadow-sm max-w-lg mx-auto">
              <Package className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-950">No Order Found</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                We couldn&apos;t find an order matching <code className="bg-zinc-100 px-2 py-0.5 rounded font-mono text-zinc-900">{query}</code>. Please double check the Order ID or phone number used during checkout.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/917815858973?text=Hello%20Men's%20Territory,%20I'm%20trying%20to%20track%20my%20order%20(${encodeURIComponent(
                    query
                  )})%20but%20couldn't%20find%20it.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat With Store Support</span>
                </a>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <div className="w-8 h-8 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
