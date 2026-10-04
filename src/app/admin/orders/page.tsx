'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOrders, updateOrderStatus } from '@/lib/supabase/data-service';
import { Order, OrderStatus } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { generateWhatsAppUrl } from '@/services/orderService';
import {
  Search,
  MessageSquareText,
  Eye,
  X,
  Phone,
  MapPin,
  Calendar,
  Save,
  PackageCheck,
  CheckCircle,
  Clock,
  Filter,
  Printer,
  FileText,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modal editing state
  const [editingStatus, setEditingStatus] = useState<OrderStatus>('Pending');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setEditingStatus(order.status);
    setInternalNotes(order.internal_notes || '');
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const updated = await updateOrderStatus(
        selectedOrder.id,
        editingStatus,
        internalNotes
      );
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOrder(updated);
        showToast(`Order status updated to ${editingStatus}`, 'success');
      }
    } catch (err) {
      showToast('Failed to update order', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Direct WhatsApp contact link from admin to customer
  const getAdminToCustomerWhatsAppLink = (order: Order) => {
    const text = `Hello ${order.customer_name},

Thank you for your order with Men's Territory!
Order ID: *${order.order_number}*
Total Amount: ₹${Number(order.total).toLocaleString('en-IN')}

We are reviewing your order status: *${order.status}*.
Please let us know if you need any adjustments to sizes or delivery address.`;

    return generateWhatsAppUrl(order.phone, text);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statuses: OrderStatus[] = [
    'Pending',
    'WhatsApp Contacted',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Order Fulfillment & WhatsApp Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight mt-0.5">
            Orders ({filteredOrders.length})
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 shadow-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-950 shadow-xs"
        >
          <option value="all">All Order Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-widest text-[10px] font-bold border-b border-zinc-200">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-mono text-zinc-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-400 font-sans">
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                    {/* Order ID */}
                    <td className="p-4 font-bold text-zinc-950">{order.order_number}</td>

                    {/* Customer */}
                    <td className="p-4 font-sans font-semibold text-zinc-900">
                      {order.customer_name}
                      {order.city && (
                        <span className="block text-[11px] text-zinc-500 font-normal">
                          {order.city}, {order.state}
                        </span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="p-4 text-zinc-700">
                      <a
                        href={`tel:${order.phone}`}
                        className="hover:text-zinc-950 hover:underline"
                      >
                        {order.phone}
                      </a>
                    </td>

                    {/* Items Count */}
                    <td className="p-4 text-zinc-600 font-sans">
                      {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                    </td>

                    {/* Total */}
                    <td className="p-4 font-bold text-zinc-950">
                      ₹{Number(order.total).toLocaleString('en-IN')}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 font-sans">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Confirmed' || order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : order.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-zinc-500 font-sans text-[11px]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        {/* Open WhatsApp Contact */}
                        <a
                          href={getAdminToCustomerWhatsAppLink(order)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                          title="Open WhatsApp chat with customer"
                        >
                          <MessageSquareText className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>

                        {/* Invoice Link */}
                        <Link
                          href={`/invoice/${encodeURIComponent(order.order_number)}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors border border-zinc-200"
                          title="Print / View Tax Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>

                        {/* View Details */}
                        <button
                          onClick={() => openOrderModal(order)}
                          className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors border border-zinc-200"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-widest">
                  ORDER DETAILS
                </span>
                <h3 className="text-xl font-mono font-black text-zinc-950">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/invoice/${encodeURIComponent(selectedOrder.order_number)}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold transition-colors border border-zinc-300"
                  title="Print / Download Official Tax Invoice"
                >
                  <Printer className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Invoice</span>
                </Link>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer & Address Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Customer</span>
                <p className="font-semibold text-zinc-950 text-sm">{selectedOrder.customer_name}</p>
                <p className="text-zinc-600 font-mono">Phone: {selectedOrder.phone}</p>
                {selectedOrder.alternative_phone && (
                  <p className="text-zinc-600 font-mono">Alt: {selectedOrder.alternative_phone}</p>
                )}
                {selectedOrder.email && <p className="text-zinc-600">{selectedOrder.email}</p>}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Shipping Address</span>
                <p className="text-zinc-700 leading-relaxed">
                  {selectedOrder.address},<br />
                  {selectedOrder.city}, {selectedOrder.district},<br />
                  {selectedOrder.state} - {selectedOrder.pincode}
                </p>
              </div>
            </div>

            {/* Customer Notes */}
            {selectedOrder.notes && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Customer Note:</strong> {selectedOrder.notes}
              </div>
            )}

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Ordered Products
              </h4>
              <div className="space-y-2 border border-zinc-200 rounded-2xl p-3 bg-zinc-50">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between text-xs py-2 border-b border-zinc-200 last:border-0"
                    >
                      <div>
                        <p className="font-bold text-zinc-950">{it.product_name}</p>
                        <p className="text-zinc-500 font-mono text-[11px] mt-0.5">
                          SKU: {it.sku} • Size: {it.size} • Color: {it.color} • Qty: {it.quantity}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-zinc-950">
                        ₹{Number(it.total_price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 py-2">Item snapshot details not loaded.</p>
                )}

                <div className="pt-2 flex justify-between items-center text-sm font-bold text-zinc-950">
                  <span>Total Order Value:</span>
                  <span className="text-zinc-950 font-mono text-base">
                    ₹{Number(selectedOrder.total).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Internal Notes Modification Form */}
            <div className="space-y-4 border-t border-zinc-100 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Update Order Status
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Contact Customer
                  </label>
                  <a
                    href={getAdminToCustomerWhatsAppLink(selectedOrder)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-transform hover:scale-105"
                  >
                    <MessageSquareText className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Internal Administrative Notes (Private)
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Courier tracking AWB #123456789 / Customer requested size exchange on call"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleUpdateOrder}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isUpdating ? 'Updating...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
