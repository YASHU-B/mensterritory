'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getCategories, saveCategory, deleteCategory } from '@/lib/supabase/data-service';
import { uploadImage } from '@/lib/supabase/storage-service';
import { Category } from '@/types';
import { useToast } from '@/components/ui/Toast';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Layers,
  X,
  Save,
  ArrowUpRight,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fast instant local cache initialization
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('mt_categories_v2');
        if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(categories.length === 0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();

    // Listen for realtime category updates across windows and saves
    const handleRealtime = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      }
    };
    window.addEventListener('mt_categories_updated', handleRealtime);
    return () => {
      window.removeEventListener('mt_categories_updated', handleRealtime);
    };
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setDisplayOrder(cat.display_order);
    setIsActive(cat.is_active);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size exceeds 10MB limit', 'error');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file, 'categories');
      setImageUrl(url);
      showToast('Category image uploaded successfully!', 'success');
    } catch {
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    try {
      const saved = await saveCategory({
        id: editingCategory?.id,
        name: name.trim(),
        slug: slug.trim() || `cat-${Date.now()}`,
        description: description.trim(),
        image_url: imageUrl.trim(),
        display_order: Number(displayOrder),
        is_active: isActive,
      });

      // 1. Immediately reflect in real time
      setCategories((prev) => {
        const index = prev.findIndex((c) => c.id === saved.id);
        let next: Category[];
        if (index >= 0) {
          next = [...prev];
          next[index] = saved;
        } else {
          next = [...prev, saved];
        }
        return next.sort((a, b) => a.display_order - b.display_order);
      });

      showToast(`Category "${saved.name}" saved successfully`, 'success');
      setIsModalOpen(false);
      loadCategories();
    } catch {
      showToast('Error saving category', 'error');
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      await deleteCategory(id);
      showToast(`Deleted category ${catName}`, 'info');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      showToast('Failed to delete category', 'error');
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      const updated = await saveCategory({
        ...cat,
        is_active: !cat.is_active,
      });
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      showToast(`${cat.name} is now ${!cat.is_active ? 'active' : 'hidden'}`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Taxonomy & Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight mt-0.5">
            Categories ({categories.length})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl bg-white border border-zinc-200 p-4 flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-colors shadow-xs"
          >
            <div className="flex gap-3">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                <Image
                  src={cat.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 font-bold">
                    ORDER #{cat.display_order}
                  </span>
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={cat.is_active ? 'text-emerald-600' : 'text-zinc-400'}
                    title="Toggle Visibility"
                  >
                    {cat.is_active ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <h3 className="text-sm font-bold text-zinc-950 truncate mt-0.5">{cat.name}</h3>
                <p className="text-xs text-zinc-500 font-mono">/category/{cat.slug}</p>
                {cat.description && (
                  <p className="text-xs text-zinc-600 line-clamp-1 mt-1 font-light">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
              <a
                href={`/category/${cat.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-zinc-950 flex items-center gap-1 text-[11px] font-medium transition-colors"
              >
                <span>View on store</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors border border-zinc-200"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors border border-zinc-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-zinc-900" />
                <h3 className="text-base font-black uppercase tracking-wide text-zinc-950">
                  {editingCategory ? `Edit: ${editingCategory.name}` : 'Create New Category'}
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
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Formal Shirts"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
                  />
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
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
                  />
                </div>
              </div>

              {/* Category Image Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Category Image <span className="text-red-500">*</span>
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[10px] text-red-600 hover:underline uppercase font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {imageUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300">
                      <Image
                        src={imageUrl}
                        alt="Category preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <p className="text-xs font-bold text-zinc-950 truncate">Category Photo Selected</p>
                      <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1 font-sans">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Ready to Save</span>
                      </p>
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-zinc-200 text-[11px] font-bold text-zinc-800 hover:bg-zinc-100 transition-colors shadow-2xs"
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-zinc-600" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-zinc-700" />
                            <span>Change Photo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                      isUploadingImage
                        ? 'border-zinc-400 bg-zinc-100 pointer-events-none'
                        : 'border-zinc-300 hover:border-zinc-950 bg-zinc-50 hover:bg-zinc-100/60'
                    }`}
                  >
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center justify-center space-y-2 py-2">
                        <Loader2 className="w-7 h-7 text-zinc-950 animate-spin" />
                        <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                          Uploading to Cloud Storage...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2 py-1">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shadow-2xs">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">
                            Click to upload category image
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            PNG, JPG, or WEBP up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short tagline explaining this fashion category"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white resize-none"
                />
              </div>

              <label className="flex items-center gap-2.5 text-xs text-zinc-700 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-zinc-950 focus:ring-zinc-950"
                />
                <span>Active and visible on navigation</span>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
