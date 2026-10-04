'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardStats, getOrders } from '@/lib/supabase/data-service';
import { Order } from '@/types';
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  Clock,
  CheckCircle,
  IndianRupee,
  Calendar,
  Plus,
  ArrowRight,
  MessageSquareText,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0,
    totalOrderValue: 0,
    todayOrders: 0,
    thisMonthOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [dashStats, allOrders] = await Promise.all([
          getDashboardStats(),
          getOrders(),
        ]);
        setStats(dashStats);
        setRecentOrders(allOrders.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Overview & Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight mt-0.5">
            Admin Dashboard
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>

          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-200 transition-colors shadow-xs"
          >
            <Layers className="w-4 h-4 text-zinc-700" />
            <span>Categories</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-zinc-950" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
            {stats.totalProducts}
          </p>
          <p className="text-[11px] text-zinc-500">
            {stats.activeProducts} active in catalog
          </p>
        </div>

        {/* Low & Out of Stock */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {stats.lowStockProducts}
            </span>
            <span className="text-xs text-zinc-500">low</span>
            <span className="text-zinc-300">/</span>
            <span className="text-xl font-bold text-red-600 font-mono">
              {stats.outOfStockProducts}
            </span>
            <span className="text-xs text-zinc-500">out</span>
          </div>
          <p className="text-[11px] text-zinc-500">Threshold-controlled</p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
            {stats.totalOrders}
          </p>
          <p className="text-[11px] text-zinc-500">
            {stats.pendingOrders} pending • {stats.confirmedOrders} confirmed
          </p>
        </div>

        {/* Total Order Value */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Order Value</span>
            <IndianRupee className="w-4 h-4 text-zinc-950" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
            ₹{stats.totalOrderValue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-zinc-500">Total volume processed</p>
        </div>

        {/* Today's Orders */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Orders</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
            {stats.todayOrders}
          </p>
          <p className="text-[11px] text-zinc-500">Received today</p>
        </div>

        {/* This Month's Orders */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">This Month</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
            {stats.thisMonthOrders}
          </p>
          <p className="text-[11px] text-zinc-500">Current monthly run-rate</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black uppercase text-zinc-950 tracking-wider">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-zinc-500">Latest submissions directly via WhatsApp checkout</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 flex items-center gap-1"
          >
            <span>Manage All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-widest text-[10px] font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono text-zinc-700">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-400 font-sans">
                      No orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4 font-bold text-zinc-950">{o.order_number}</td>
                      <td className="p-4 font-sans font-medium text-zinc-900">{o.customer_name}</td>
                      <td className="p-4 text-zinc-500">{o.phone}</td>
                      <td className="p-4 font-bold text-zinc-950">₹{Number(o.total).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-sans ${
                            o.status === 'Confirmed' || o.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : o.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : o.status === 'Cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500 font-sans text-[11px]">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href="/admin/orders"
                          className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sans text-xs transition-colors border border-zinc-200"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
