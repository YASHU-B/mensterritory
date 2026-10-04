'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getBanners, saveBanner, deleteBanner } from '@/lib/supabase/data-service';
import { Banner } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { Plus, Edit, Trash2, CheckCircle, XCircle, ImageIcon, X, ArrowUpRight } from 'lucide-react';

export default function AdminBannersPage() {
  const { showToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('SHOP NOW');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [type, setType] = useState<'hero' | 'promo' | 'announcement'>('hero');
  const [isActive, setIsActive] = useState(true);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (e) {
      console.error('Failed to load banners', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle("MEN'S TERRITORY");
    setSubtitle('The Real Man\'s Choice — Explore high-street streetwear and tailored formals.');
    setCtaText('SHOP COLLECTION');
    setCtaLink('/shop');
    setImageUrl('https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1600&q=85');
    setDisplayOrder(banners.length + 1);
    setType('hero');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setCtaText(banner.cta_text);
    setCtaLink(banner.cta_link);
    setImageUrl(banner.image_url);
    setDisplayOrder(banner.display_order);
    setType(banner.type);
    setIsActive(banner.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      showToast('Please fill in title and image URL', 'error');
      return;
    }

    try {
      await saveBanner({
        id: editingBanner?.id,
        title: title.trim(),
        subtitle: subtitle.trim(),
        cta_text: ctaText.trim(),
        cta_link: ctaLink.trim(),
        image_url: imageUrl.trim(),
        display_order: Number(displayOrder),
        type,
        is_active: isActive,
      });

      showToast('Banner saved successfully', 'success');
      setIsModalOpen(false);
      loadBanners();
    } catch (err) {
      showToast('Error saving banner', 'error');
    }
  };

  const handleDelete = async (id: string, bannerTitle: string) => {
    if (!window.confirm(`Delete banner "${bannerTitle}"?`)) return;
    try {
      await deleteBanner(id);
      showToast('Banner deleted', 'info');
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch {
      showToast('Failed to delete banner', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Visual Merchandising
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight mt-0.5">
            Hero & Promo Banners ({banners.length})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Banner</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="rounded-3xl bg-white border border-zinc-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            {/* Banner Image Preview */}
            <div className="relative aspect-[16/8] w-full bg-zinc-100 overflow-hidden">
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/90 text-zinc-900 border border-zinc-200 uppercase shadow-xs">
                  {banner.type} • #{banner.display_order}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    banner.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                  }`}
                >
                  {banner.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-base font-black uppercase text-white tracking-wide">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs text-zinc-200 line-clamp-1">{banner.subtitle}</p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs">
              <span className="text-zinc-600 font-mono text-[11px]">
                CTA: &ldquo;{banner.cta_text}&rdquo; &rarr; {banner.cta_link}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors border border-zinc-200"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id, banner.title)}
                  className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors border border-zinc-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-zinc-900" />
                <h3 className="text-base font-black uppercase tracking-wide text-zinc-950">
                  {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Banner Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. THE REAL MAN'S CHOICE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Subtitle
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Supporting promotional caption"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'hero' | 'promo' | 'announcement')}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
                  >
                    <option value="hero">Hero Main</option>
                    <option value="promo">Promo Mid-Page</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-zinc-700 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-zinc-950 focus:ring-zinc-950"
                />
                <span>Active on homepage</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
