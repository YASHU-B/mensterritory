import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-zinc-300">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-bold">
          Legal & Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500">Last updated: October 2026</p>
      </div>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          1. Commitment to Your Privacy
        </h2>
        <p>
          At <strong>Men&apos;s Territory (&ldquo;The Real Man&apos;s Choice&rdquo;)</strong>, we respect your personal privacy. We do not require customer accounts or public profile registrations to browse our collections or place an order.
        </p>
      </section>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          2. Information We Collect
        </h2>
        <p>
          When you place an order, we collect only the necessary information required for fulfillment and delivery:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li>Full name and phone number (for WhatsApp order communication and courier dispatch)</li>
          <li>Delivery address, city, district, state, and PIN code</li>
          <li>Optional email address (for digital dispatch invoices)</li>
          <li>Customer notes or special packing requests</li>
        </ul>
      </section>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          3. How Your Information is Used
        </h2>
        <p>
          We strictly use your information to process, confirm, pack, and ship your apparel orders, and to provide customer support via our official WhatsApp line (+91 7815858973). We will never sell, rent, or distribute your personal details to third-party advertisers.
        </p>
      </section>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          4. Contact Us
        </h2>
        <p>
          If you have questions regarding our privacy practices, contact us at:
          <br />
          <strong>Men&apos;s Territory</strong>
          <br />
          VNR Peta (Taduku Peta), Nagari (M), Chittoor District, Andhra Pradesh - 517590
          <br />
          WhatsApp: +91 7815858973 | Email: contact@mensterritory.com
        </p>
      </section>
    </div>
  );
}
