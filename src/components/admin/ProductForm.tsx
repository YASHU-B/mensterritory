'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { saveProduct, getCategories } from '@/lib/supabase/data-service';
import { uploadImage } from '@/lib/supabase/storage-service';
import { useToast } from '@/components/ui/Toast';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  ImageIcon,
  Sparkles,
  UploadCloud,
  Loader2,
} from 'lucide-react';

interface ProductFormProps {
  initialProduct?: Product | null;
  isEditing?: boolean;
}

export default function ProductForm({ initialProduct, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'variants' | 'images' | 'badges'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingSecondary, setIsUploadingSecondary] = useState(false);

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [shortDescription, setShortDescription] = useState(initialProduct?.short_description || '');

  const [price, setPrice] = useState<number>(initialProduct?.price || 1299);
  const [originalPrice, setOriginalPrice] = useState<number>(initialProduct?.original_price || 1999);

  const [sku, setSku] = useState(initialProduct?.sku || 'MT-PRD-' + Math.floor(100 + Math.random() * 900));
  const [stockQuantity, setStockQuantity] = useState<number>(initialProduct?.stock_quantity ?? 20);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(initialProduct?.low_stock_threshold ?? 3);

  const [availableSizes, setAvailableSizes] = useState<string[]>(
    initialProduct?.available_sizes || ['S', 'M', 'L', 'XL']
  );
  const [availableColors, setAvailableColors] = useState<string[]>(
    initialProduct?.available_colors || ['Black']
  );

  const [fabric, setFabric] = useState(initialProduct?.fabric || '100% Premium Cotton');
  const [fit, setFit] = useState(initialProduct?.fit || 'Relaxed Fit');
  const [material, setMaterial] = useState(initialProduct?.material || 'Cotton Blend');
  const [pattern, setPattern] = useState(initialProduct?.pattern || 'Solid');

  const [thumbnail, setThumbnail] = useState(initialProduct?.thumbnail || '');
  const [secondaryImage, setSecondaryImage] = useState(
    initialProduct?.images[1] || ''
  );

  const [isActive, setIsActive] = useState(initialProduct?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.is_featured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(initialProduct?.is_best_seller ?? false);
  const [isTrending, setIsTrending] = useState(initialProduct?.is_trending ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.is_new_arrival ?? true);
  const [isOffer, setIsOffer] = useState(initialProduct?.is_offer ?? false);

  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorInput, setCustomColorInput] = useState('');

  // Auto-slugify on title change if new
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  useEffect(() => {
    async function loadCats() {
      const data = await getCategories();
      setCategories(data);
      if (!categoryId && data.length > 0) {
        setCategoryId(data[0].id);
      }
    }
    loadCats();
  }, [categoryId]);

  const discountPercent =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddSize = () => {
    if (customSizeInput.trim() && !availableSizes.includes(customSizeInput.trim())) {
      setAvailableSizes([...availableSizes, customSizeInput.trim().toUpperCase()]);
      setCustomSizeInput('');
    }
  };

  const handleRemoveSize = (s: string) => {
    setAvailableSizes(availableSizes.filter((item) => item !== s));
  };

  const handleAddColor = () => {
    if (customColorInput.trim() && !availableColors.includes(customColorInput.trim())) {
      setAvailableColors([...availableColors, customColorInput.trim()]);
      setCustomColorInput('');
    }
  };

  const handleRemoveColor = (c: string) => {
    setAvailableColors(availableColors.filter((item) => item !== c));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please provide a product title', 'error');
      return;
    }
    if (!sku.trim()) {
      showToast('Please provide a unique SKU', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCat = categories.find((c) => c.id === categoryId);

      const imagesArray = [thumbnail];
      if (secondaryImage.trim()) imagesArray.push(secondaryImage.trim());

      const productPayload: Partial<Product> = {
        id: initialProduct?.id,
        name: name.trim(),
        slug: slug.trim() || `prod-${Date.now()}`,
        description: description.trim() || 'Premium quality men\'s garment.',
        short_description: shortDescription.trim(),
        category_id: categoryId,
        category_name: selectedCat?.name || "Men's Wear",
        subcategory: selectedCat?.name || '',
        price,
        original_price: originalPrice,
        discount_price: originalPrice > price ? originalPrice - price : 0,
        discount_percent: discountPercent,
        sku: sku.trim().toUpperCase(),
        brand: "Men's Territory",
        available_sizes: availableSizes,
        available_colors: availableColors,
        stock_quantity: Number(stockQuantity),
        low_stock_threshold: Number(lowStockThreshold),
        images: imagesArray,
        thumbnail,
        featured_image: thumbnail,
        material,
        fabric,
        fit,
        pattern,
        gender: 'Men',
        tags: [
          fit.toLowerCase(),
          material.toLowerCase(),
          selectedCat?.name.toLowerCase() || 'wear',
          selectedCat?.slug.toLowerCase() || '',
        ].filter(Boolean),
        is_active: isActive,
        is_featured: isFeatured,
        is_best_seller: isBestSeller,
        is_trending: isTrending,
        is_new_arrival: isNewArrival,
        is_offer: isOffer,
        display_order: 0,
      };

      await saveProduct(productPayload);
      showToast(isEditing ? 'Product updated successfully' : 'Product created successfully', 'success');
      router.push('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      showToast('Error saving product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 transition-colors mb-2 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight">
            {isEditing ? `Edit: ${name}` : 'Create New Product'}
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:scale-105 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save Product'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2">
        {[
          { id: 'basic', label: '1. Basic Info' },
          { id: 'pricing', label: '2. Pricing & Discounts' },
          { id: 'inventory', label: '3. Inventory & SKU' },
          { id: 'variants', label: '4. Sizes & Colors' },
          { id: 'images', label: '5. Product Imagery' },
          { id: 'badges', label: '6. Badges & Visibility' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === t.id
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Basic Info */}
      {activeTab === 'basic' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Classic Midnight Black Formal Shirt"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 font-mono placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Primary Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Short Description (Card view)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One sentence summary of fabric and styling"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Full Product Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the weave, fit, styling suggestions, and occasion suitability..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:bg-white resize-none"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Pricing */}
      {activeTab === 'pricing' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Original MRP / Cross Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Calculated Discount
              </label>
              <div className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-red-600 font-mono">
                {discountPercent > 0 ? `${discountPercent}% OFF` : 'No Discount'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Inventory & SKU */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. MT-FS-001"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 font-mono uppercase focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Total Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Variants & Fabric */}
      {activeTab === 'variants' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Sizes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {availableSizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-900 font-mono text-xs border border-zinc-300 font-bold"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(s)}
                    className="text-zinc-400 hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                placeholder="Add size (e.g. 46 or XXL)"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                className="bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2 border-t border-zinc-200 pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Available Colors
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {availableColors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-900 text-xs border border-zinc-300 font-bold"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(c)}
                    className="text-zinc-400 hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                placeholder="Add color (e.g. Charcoal)"
                value={customColorInput}
                onChange={(e) => setCustomColorInput(e.target.value)}
                className="bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Fabric</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% Giza Cotton"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Fit Profile</label>
              <input
                type="text"
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                placeholder="e.g. Wide Leg Baggy / Slim Tailored"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Imagery */}
      {activeTab === 'images' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Primary Thumbnail Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Primary Product Photo <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-zinc-500">Upload JPG, PNG or WebP</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Direct File Upload */}
              <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-zinc-100 text-center group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploadingThumbnail(true);
                    try {
                      const url = await uploadImage(file, 'product-images');
                      setThumbnail(url);
                      showToast('Photo uploaded successfully to Supabase Storage!', 'success');
                    } catch (err) {
                      console.error(err);
                      showToast('Upload failed. Please try again.', 'error');
                    } finally {
                      setIsUploadingThumbnail(false);
                    }
                  }}
                  className="hidden"
                />
                {isUploadingThumbnail ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="w-8 h-8 text-zinc-950 animate-spin" />
                    <span className="text-xs font-semibold text-zinc-700">Uploading to Storage...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 mb-3 group-hover:scale-110 transition-transform shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider block">
                      Click to Upload Photo
                    </span>
                    <span className="text-[11px] text-zinc-500 mt-1">
                      Direct upload from device to Supabase
                    </span>
                  </>
                )}
              </label>

              {/* Or paste external URL */}
              <div className="space-y-2 flex flex-col justify-center">
                <span className="text-xs text-zinc-600 font-medium">Or enter direct Image URL:</span>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://your-domain.com/image.jpg"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950"
                />
                <span className="text-[11px] text-zinc-500">
                  Tip: Uploading a file automatically populates this field.
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Preview Image */}
          <div className="space-y-3 border-t border-zinc-200 pt-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Secondary Photo (Hover Angle / Back View)
              </label>
              <span className="text-[11px] text-zinc-500">Optional</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Direct File Upload */}
              <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-zinc-100 text-center group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploadingSecondary(true);
                    try {
                      const url = await uploadImage(file, 'product-images');
                      setSecondaryImage(url);
                      showToast('Secondary angle uploaded successfully!', 'success');
                    } catch (err) {
                      console.error(err);
                      showToast('Upload failed. Please try again.', 'error');
                    } finally {
                      setIsUploadingSecondary(false);
                    }
                  }}
                  className="hidden"
                />
                {isUploadingSecondary ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="w-8 h-8 text-zinc-950 animate-spin" />
                    <span className="text-xs font-semibold text-zinc-700">Uploading to Storage...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 mb-3 group-hover:scale-110 transition-transform shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider block">
                      Click to Upload Secondary Angle
                    </span>
                    <span className="text-[11px] text-zinc-500 mt-1">
                      Direct upload to Supabase Storage
                    </span>
                  </>
                )}
              </label>

              {/* Or paste external URL */}
              <div className="space-y-2 flex flex-col justify-center">
                <span className="text-xs text-zinc-600 font-medium">Or enter Secondary Image URL:</span>
                <input
                  type="url"
                  value={secondaryImage}
                  onChange={(e) => setSecondaryImage(e.target.value)}
                  placeholder="https://your-domain.com/secondary.jpg"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-950"
                />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="pt-6 border-t border-zinc-200">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-3">
              Photo Previews
            </span>
            <div className="flex items-center gap-4">
              {thumbnail ? (
                <div className="space-y-1">
                  <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-300 shadow-xs">
                    <Image src={thumbnail} alt="Primary Thumbnail" fill className="object-cover" />
                  </div>
                  <span className="text-[10px] text-zinc-950 font-bold block text-center">Primary</span>
                </div>
              ) : (
                <div className="w-28 h-36 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 text-[10px] p-2 text-center">
                  <ImageIcon className="w-6 h-6 mb-1 text-zinc-400" />
                  <span>No primary photo yet</span>
                </div>
              )}

              {secondaryImage ? (
                <div className="space-y-1">
                  <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-300 shadow-xs">
                    <Image src={secondaryImage} alt="Secondary Preview" fill className="object-cover" />
                  </div>
                  <span className="text-[10px] text-zinc-600 font-medium block text-center">Secondary</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Badges & Flags */}
      {activeTab === 'badges' && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-950"
            />
            <div>
              <span className="font-bold uppercase tracking-wider block text-zinc-950">Product is Active</span>
              <span className="text-[11px] text-zinc-500">Visible to customers in the catalog</span>
            </div>
          </label>

          <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-950"
            />
            <div>
              <span className="font-bold uppercase tracking-wider block text-zinc-950">Featured Product</span>
              <span className="text-[11px] text-zinc-500">Highlighted on category showcases</span>
            </div>
          </label>

          <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-950"
            />
            <div>
              <span className="font-bold uppercase tracking-wider block text-zinc-950">Best Seller Badge</span>
              <span className="text-[11px] text-zinc-500">Displays on Homepage Best Sellers rail</span>
            </div>
          </label>

          <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors">
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-950"
            />
            <div>
              <span className="font-bold uppercase tracking-wider block text-zinc-950">Trending Collection</span>
              <span className="text-[11px] text-zinc-500">Displays on Trending Streetwear feed</span>
            </div>
          </label>

          <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-950"
            />
            <div>
              <span className="font-bold uppercase tracking-wider block text-zinc-950">New Arrival</span>
              <span className="text-[11px] text-zinc-500">Marks as new release drop</span>
            </div>
          </label>

          <label className="flex items-center gap-3 text-xs text-zinc-800 cursor-pointer p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors">
            <input
              type="checkbox"
              checked={isOffer}
              onChange={(e) => setIsOffer(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-950"
            />
            <div>
              <span className="font-bold uppercase tracking-wider block text-zinc-950">Special Offer / Promotion</span>
              <span className="text-[11px] text-zinc-500">Categorized in Offers feed</span>
            </div>
          </label>
        </div>
      )}

      {/* Bottom Save Trigger */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-105 active:scale-98"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save Product'}</span>
        </button>
      </div>
    </form>
  );
}
