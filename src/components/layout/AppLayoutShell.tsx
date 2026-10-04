'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInvoicePage = pathname?.startsWith('/invoice');

  if (isInvoicePage) {
    return (
      <main className="min-h-screen bg-zinc-50 print:bg-white w-full">
        {children}
      </main>
    );
  }

  return (
    <>
      <div className="print:hidden">
        <AnnouncementBar />
        <Navbar />
      </div>
      <main className="flex-1 w-full">{children}</main>
      <div className="print:hidden">
        <Footer />
        <CartDrawer />
        <WhatsAppFloatingButton />
      </div>
    </>
  );
}
