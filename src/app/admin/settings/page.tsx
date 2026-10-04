'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { updateStoreSettings } from '@/lib/supabase/data-service';
import { useToast } from '@/components/ui/Toast';
import { StoreSettings } from '@/types';
import {
  Save,
  Store,
  Phone,
  MessageSquareText,
  MapPin,
  Sparkles,
  Sliders,
  Database,
  CheckCircle,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, refreshSettings } = useStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'hero' | 'announcement' | 'database'>('general');

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStoreSettings(formData);
      await refreshSettings();
      showToast('Store settings updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Storefront Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight mt-0.5">
            Store Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            All changes update the live customer website and WhatsApp ordering immediately.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:scale-105 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2">
        {[
          { id: 'general', label: 'Store Identity', icon: Store },
          { id: 'contact', label: 'Contact & WhatsApp', icon: Phone },
          { id: 'hero', label: 'Homepage Hero', icon: Sparkles },
          { id: 'announcement', label: 'Announcement Bar', icon: Sliders },
          { id: 'database', label: 'Database & Sync', icon: Database },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === t.id
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: General */}
      {activeTab === 'general' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Store Name
              </label>
              <input
                type="text"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Brand Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              About Brand Text (Footer & About Page)
            </label>
            <textarea
              rows={3}
              name="about_text"
              value={formData.about_text}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Currency Symbol
              </label>
              <input
                type="text"
                name="currency_symbol"
                value={formData.currency_symbol}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Official Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Contact & WhatsApp */}
      {activeTab === 'contact' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-bold uppercase tracking-wider">Crucial WhatsApp Configuration</p>
            <p className="text-zinc-600">
              All checkout orders generated by customers will open WhatsApp using this number. Ensure it has an active WhatsApp account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                WhatsApp Order Line Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="whatsapp_number"
                required
                value={formData.whatsapp_number}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Instagram Handle
              </label>
              <input
                type="text"
                name="instagram_handle"
                value={formData.instagram_handle}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Primary Calling Phone
              </label>
              <input
                type="tel"
                name="phone_primary"
                value={formData.phone_primary}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Secondary Calling Phone
              </label>
              <input
                type="tel"
                name="phone_secondary"
                value={formData.phone_secondary}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950">
              Physical Showroom Address
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Address Line 2 (Mandal)
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  City / Town
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Hero */}
      {activeTab === 'hero' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Hero Main Headline
            </label>
            <input
              type="text"
              name="hero_title"
              value={formData.hero_title}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Hero Subtitle
            </label>
            <textarea
              rows={2}
              name="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Primary CTA Text
              </label>
              <input
                type="text"
                name="hero_cta_text"
                value={formData.hero_cta_text}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Primary CTA Link
              </label>
              <input
                type="text"
                name="hero_cta_link"
                value={formData.hero_cta_link}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Hero Background Image URL
            </label>
            <input
              type="url"
              name="hero_image_url"
              value={formData.hero_image_url}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Tab: Announcement Bar */}
      {activeTab === 'announcement' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <label className="flex items-center gap-2.5 text-xs text-zinc-800 cursor-pointer p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <input
              type="checkbox"
              name="is_announcement_active"
              checked={formData.is_announcement_active}
              onChange={handleChange}
              className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-950"
            />
            <div>
              <span className="font-bold uppercase tracking-wider block text-zinc-950">Enable Announcement Bar</span>
              <span className="text-[11px] text-zinc-500">Shows banner above top navbar on every page</span>
            </div>
          </label>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Announcement Ticker Text
            </label>
            <input
              type="text"
              name="announcement_text"
              value={formData.announcement_text}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Tab: Database & Sync */}
      {activeTab === 'database' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
              Database Connectivity & Migration Files
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Men&apos;s Territory is architected with dual-layer persistence. It runs with complete data locally right out of the box, and seamlessly synchronizes with Supabase PostgreSQL when your environment variables are configured.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-zinc-700">Migration File:</span>
              <span className="font-mono text-zinc-950 font-bold">supabase/migrations/20261004_init.sql</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-zinc-700">Seed Data File:</span>
              <span className="font-mono text-zinc-950 font-bold">supabase/seed.sql</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
            <h4 className="font-bold text-zinc-950 uppercase tracking-wider">How to seed Supabase:</h4>
            <ol className="list-decimal pl-5 space-y-1 text-zinc-700">
              <li>Open your Supabase Project Dashboard &rarr; SQL Editor.</li>
              <li>Paste and run <code className="text-zinc-950 font-bold">supabase/migrations/20261004_init.sql</code>.</li>
              <li>Paste and run <code className="text-zinc-950 font-bold">supabase/seed.sql</code>.</li>
              <li>Add your <code className="text-zinc-950 font-bold">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-zinc-950 font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs hover:scale-105 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </form>
  );
}
