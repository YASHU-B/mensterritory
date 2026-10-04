import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-zinc-300">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-bold">
          Terms of Service
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-zinc-500">Effective Date: October 2026</p>
      </div>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          1. General Terms
        </h2>
        <p>
          Welcome to <strong>Men&apos;s Territory</strong>. By accessing our catalog, adding items to bag, or communicating with us via WhatsApp, you agree to these terms.
        </p>
      </section>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          2. Products & Pricing
        </h2>
        <p>
          All product prices are quoted in Indian Rupees (₹). While we strive for absolute accuracy in color representation, actual fabric shades may vary marginally due to digital screen display settings. All orders are subject to stock confirmation by our store staff.
        </p>
      </section>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          3. WhatsApp Order Confirmation
        </h2>
        <p>
          Submitting a bag creates an order entry in our database. The purchase is formally finalized when you connect with our representative on WhatsApp, confirm the delivery address, and agree to the payment mode (UPI, GPay, PhonePe, or Cash on Delivery).
        </p>
      </section>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          4. Returns & Size Exchanges
        </h2>
        <p>
          We provide 7-day size replacements on unworn garments with original tags intact. In case of size mismatch, reach out to our WhatsApp support at +91 7815858973 to coordinate replacement.
        </p>
      </section>
    </div>
  );
}
