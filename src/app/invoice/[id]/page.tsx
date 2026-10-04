'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Printer, ArrowLeft, Share2, FileText, MessageCircle } from 'lucide-react';
import { getOrderById } from '@/lib/supabase/data-service';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types';
import { useToast } from '@/components/ui/Toast';

function numberToIndianWords(amount: number): string {
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const num = Math.floor(amount);
  if (num === 0) return 'Zero Rupees Only';

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000)
      return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000)
      return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return (
      inWords(Math.floor(n / 10000000)) +
      ' Crore' +
      (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '')
    );
  }

  return 'Rupees ' + inWords(num) + ' Only';
}

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default function OrderInvoicePage({ params }: InvoicePageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const { settings } = useStore();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const found = await getOrderById(orderId);
        setOrder(found);
      } catch (err) {
        console.error('Invoice fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Invoice - ${order?.order_number || orderId}`,
          text: `Invoice for Men's Territory Order ${order?.order_number}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Invoice link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
            Loading Invoice...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <FileText className="w-12 h-12 text-zinc-400 mx-auto" />
          <h2 className="text-xl font-bold text-zinc-950">Invoice Not Found</h2>
          <p className="text-xs text-zinc-600">
            We could not find an order matching reference <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded">{orderId}</code>.
          </p>
          <div className="pt-2">
            <Link
              href="/track"
              className="inline-block px-5 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Go to Order Tracker
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const invoiceNumber = `INV-${order.order_number.replace('MT-', '')}`;
  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discount) || 0;
  const grandTotal = Number(order.total) || 0;

  return (
    <div className="min-h-screen bg-zinc-100 py-4 sm:py-8 px-2 sm:px-4 print:p-0 print:m-0 print:bg-white text-zinc-900 font-sans">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.2cm 1cm 1cm 1cm;
          }
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-4">
        {/* On-Screen Action Toolbar (Hidden during print) */}
        <div className="no-print bg-white border border-zinc-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Link
              href={`/track?id=${encodeURIComponent(order.order_number)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tracking</span>
            </Link>
            <span className="text-zinc-300">|</span>
            <span className="text-xs font-mono font-bold text-zinc-900">
              {order.order_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors border border-zinc-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:scale-[1.01]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Clean, Professional Invoice Sheet (Fits 1 A4 Page) */}
        <div className="invoice-sheet bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl p-6 sm:p-9 space-y-6 shadow-sm">
          {/* Header: Store Identity & Invoice Title */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-zinc-900 pb-5">
            {/* Store Branding */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white font-mono font-black flex items-center justify-center text-xs">
                  MT
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-zinc-950 leading-tight font-heading">
                    {settings.store_name || "MEN'S TERRITORY"}
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
                    {settings.tagline || "The Real Man's Choice"}
                  </p>
                </div>
              </div>

              <div className="text-xs text-zinc-600 leading-relaxed pt-1.5">
                <p>{settings.address_line1 || 'VNR Peta (Taduku Peta)'}</p>
                <p>
                  {settings.address_line2 || 'Nagari (M)'}, {settings.district || 'Chittoor District'},{' '}
                  {settings.state || 'Andhra Pradesh'} - {settings.pincode || '517590'}
                </p>
                <p className="pt-0.5 text-zinc-800">
                  Phone: <strong>+91 {settings.whatsapp_number || '7815858973'}</strong>
                </p>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="sm:text-right space-y-1 text-xs">
              <span className="inline-block px-3 py-1 bg-zinc-100 rounded-md font-black uppercase tracking-widest text-[11px] text-zinc-900 border border-zinc-300">
                RETAIL INVOICE
              </span>
              <div className="pt-2">
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Invoice Number</p>
                <p className="font-mono font-black text-sm text-zinc-950">{invoiceNumber}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Order ID</p>
                <p className="font-mono font-bold text-xs text-zinc-800">{order.order_number}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Date</p>
                <p className="font-mono text-zinc-800">{invoiceDate}</p>
              </div>
            </div>
          </div>

          {/* Customer / Delivery Address Card */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-black text-zinc-500 block mb-1">
              Billed & Delivered To:
            </span>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-sm font-black text-zinc-950">{order.customer_name}</p>
                <p className="text-zinc-700 leading-relaxed">
                  {order.address}
                  <br />
                  {order.city}, {order.district}, {order.state} -{' '}
                  <strong className="font-mono text-zinc-950">{order.pincode}</strong>
                </p>
              </div>
              <div className="sm:text-right space-y-0.5 text-zinc-700 font-mono shrink-0">
                <p>
                  Mobile: <strong>{order.phone}</strong>
                </p>
                {order.alternative_phone && (
                  <p className="text-zinc-500 text-[11px]">Alt: {order.alternative_phone}</p>
                )}
                {order.email && <p className="text-zinc-500 text-[11px] font-sans">{order.email}</p>}
              </div>
            </div>
          </div>

          {/* Clean Itemized Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 text-zinc-950 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-2.5 px-2 w-8 text-center">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Size / Color</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items && order.items.length > 0 ? (
                  order.items.map((it, idx) => (
                    <tr key={it.id} className="text-zinc-800">
                      <td className="py-3 px-2 text-center font-mono text-zinc-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-zinc-950">{it.product_name}</p>
                        {it.sku && (
                          <p className="text-[10px] text-zinc-500 font-mono">SKU: {it.sku}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-medium">
                        {it.size || 'Standard'} {it.color ? `/ ${it.color}` : ''}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold">{it.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">
                        ₹{Number(it.unit_price).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-zinc-950">
                        ₹{Number(it.total_price).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-zinc-500">
                      Order details recorded under {order.order_number}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary & Amount In Words */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-3 border-t-2 border-zinc-900">
            {/* Amount In Words (7 Cols) */}
            <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider font-black text-zinc-500 block">
                  Amount in Words:
                </span>
                <p className="text-xs font-bold text-zinc-950 font-heading pt-0.5 italic">
                  {numberToIndianWords(grandTotal)}
                </p>
              </div>

              <div className="text-[11px] text-zinc-500">
                <p>All taxes included in the total order value.</p>
              </div>
            </div>

            {/* Totals Table (5 Cols) */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-zinc-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-mono font-semibold">
                    -₹{discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600">
                <span>Delivery</span>
                <span className="font-bold text-emerald-600 uppercase">FREE</span>
              </div>

              <div className="pt-2 border-t-2 border-zinc-900 flex justify-between items-baseline">
                <span className="text-sm font-black text-zinc-950 uppercase tracking-wider">
                  Grand Total
                </span>
                <span className="text-xl font-black font-mono text-zinc-950">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note & Signature Line */}
          <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-end justify-between gap-4 text-xs">
            <div className="space-y-1 text-[11px] text-zinc-500 max-w-sm">
              <p className="font-semibold text-zinc-800">
                Thank you for choosing Men&apos;s Territory!
              </p>
              <p>For questions or size exchanges (within 7 days), contact us on WhatsApp: +91 {settings.whatsapp_number || '7815858973'}.</p>
            </div>

            <div className="text-right space-y-6 shrink-0">
              <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                For MEN&apos;S TERRITORY
              </p>
              <div className="border-t border-zinc-400 pt-1 text-center min-w-[150px]">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                  Authorized Signatory
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action helper link at bottom (Hidden on print) */}
        <div className="no-print text-center text-xs text-zinc-500 py-2">
          <a
            href={`https://wa.me/917815858973?text=Hi%20Men's%20Territory,%20query%20regarding%20Order%20${encodeURIComponent(
              order.order_number
            )}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:underline font-semibold inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Need assistance? Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
