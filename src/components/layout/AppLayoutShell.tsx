'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import InitialPageLoader from '@/components/ui/InitialPageLoader';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInvoicePage = pathname?.startsWith('/invoice');
  const isAdminPage = pathname?.startsWith('/admin');

  if (isInvoicePage || isAdminPage) {
    return (
      <main className="min-h-screen bg-zinc-50 print:bg-white w-full">
        {children}
      </main>
    );
  }

  return (
    <>
      <InitialPageLoader />
      <div className="print:hidden">
        <AnnouncementBar />
        <Navbar />
      </div>
      <main className="flex-1 w-full pb-20 lg:pb-0">{children}</main>
      <div className="print:hidden">
        <Footer />
        <CartDrawer />
        <WhatsAppFloatingButton />
      </div>
    </>
  );
}
