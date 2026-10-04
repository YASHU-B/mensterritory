import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/ui/Toast';
import AppLayoutShell from '@/components/layout/AppLayoutShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Men's Territory | The Real Man's Choice — Premium Men's Fashion",
  description:
    "Men's Territory - The Real Man's Choice. Discover premium oversized t-shirts, tailored formal shirts, baggy pants, tactical cargos, and jackets. Order directly on WhatsApp.",
  keywords: [
    "Men's Fashion",
    "Men's Territory",
    "The Real Man's Choice",
    "Baggy Pants",
    "Oversized T-Shirts",
    "Formal Shirts",
    "Nagari Men's Wear",
    "WhatsApp Men's Store",
  ],
  authors: [{ name: "Men's Territory" }],
  openGraph: {
    title: "Men's Territory | The Real Man's Choice",
    description: "Premium men's clothing designed for confidence and modern presence. Order directly on WhatsApp.",
    type: 'website',
    locale: 'en_IN',
    siteName: "Men's Territory",
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
        <ToastProvider>
          <StoreProvider>
            <CartProvider>
              <AppLayoutShell>{children}</AppLayoutShell>
            </CartProvider>
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
