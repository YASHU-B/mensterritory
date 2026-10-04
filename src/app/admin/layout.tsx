'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import {
  LayoutDashboard,
  Shirt,
  Layers,
  ShoppingBag,
  Image as ImageIcon,
  Sliders,
  Store,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, adminUser, logout } = useAdminAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  // Route protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // If on login page, render children directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center text-zinc-500">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest font-mono text-zinc-600">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Shirt },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Hero Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Store Settings', href: '/admin/settings', icon: Sliders },
    { name: 'Physical Store', href: '/admin/store', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col lg:flex-row">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg bg-zinc-100 text-zinc-700 hover:text-zinc-950"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 font-mono font-bold text-sm text-zinc-950">
            <span className="w-6 h-6 rounded bg-zinc-950 text-white flex items-center justify-center font-black text-xs">
              MT
            </span>
            <span>ADMIN</span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs text-zinc-700 hover:text-zinc-950 flex items-center gap-1 font-semibold"
        >
          <span>Store</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-zinc-200 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 shadow-xs ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo */}
        <div>
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center font-mono font-black text-white text-sm shadow-xs">
                MT
              </div>
              <div>
                <span className="text-xs font-black tracking-widest text-zinc-950 uppercase block leading-none">
                  MEN&apos;S TERRITORY
                </span>
                <span className="text-[10px] tracking-widest text-zinc-500 font-mono font-semibold">
                  CONTROL CENTER
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 text-zinc-400 hover:text-zinc-950"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                    isActive
                      ? 'bg-zinc-950 text-white font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="p-4 border-t border-zinc-200 space-y-3">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-950 truncate">{adminUser?.full_name}</p>
                <p className="text-[10px] text-zinc-500 truncate font-mono">{adminUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[11px] font-bold text-zinc-800 border border-zinc-200 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Live Store</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center justify-center p-2 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-500 hover:text-red-600 border border-zinc-200 transition-colors shadow-xs"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#fafafa] min-w-0 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
