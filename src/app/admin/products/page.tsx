'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProductsAdmin, deleteProduct, saveProduct, getCategories } from '@/lib/supabase/data-service';
import { Product, Category } from '@/types';
import { useToast } from '@/components/ui/Toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
} from 'lucide-react';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getAllProductsAdmin(),
        getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await saveProduct({
        ...product,
        is_active: !product.is_active,
      });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(
        `${product.name} is now ${!product.is_active ? 'active' : 'hidden'}`,
        'success'
      );
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast(`Deleted ${productToDelete.name}`, 'info');
      setProductToDelete(null);
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  };

  // Filtered List
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !selectedCategory || p.category_id === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
    } else if (stockFilter === 'out') {
      matchesStock = p.stock_quantity <= 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight mt-0.5">
            Products ({filteredProducts.length})
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 shadow-xs"
          />
        </div>

        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-950 shadow-xs"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'out')}
          className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-950 shadow-xs"
        >
          <option value="all">All Inventory</option>
          <option value="low">Low Stock Only</option>
          <option value="out">Out of Stock Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-widest text-[10px] font-bold border-b border-zinc-200">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-mono text-zinc-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400 font-sans">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.stock_quantity <= 0;
                  const isLow = !isOut && p.stock_quantity <= p.low_stock_threshold;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="p-4 font-sans">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                            <Image
                              src={p.thumbnail || p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="font-bold text-zinc-950 hover:text-zinc-600 transition-colors truncate block flex items-center gap-1"
                            >
                              <span>{p.name}</span>
                              <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                            </Link>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              {p.fit} • {p.available_sizes.join(', ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 font-sans text-zinc-700">{p.category_name || 'Men\'s Wear'}</td>

                      {/* SKU */}
                      <td className="p-4 font-bold text-zinc-600">{p.sku}</td>

                      {/* Price */}
                      <td className="p-4 font-bold text-zinc-950">
                        ₹{p.price.toLocaleString('en-IN')}
                        {p.original_price > p.price && (
                          <span className="text-zinc-400 text-[10px] line-through block">
                            ₹{p.original_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="p-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            Out (0)
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            Low ({p.stock_quantity})
                          </span>
                        ) : (
                          <span className="text-zinc-700">{p.stock_quantity} in stock</span>
                        )}
                      </td>

                      {/* Active Toggle */}
                      <td className="p-4 text-center font-sans">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.is_active
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-zinc-400 hover:bg-zinc-100'
                          }`}
                          title={p.is_active ? 'Active on store' : 'Hidden from store'}
                        >
                          {p.is_active ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors border border-zinc-200 shadow-xs"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-2 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors border border-zinc-200 shadow-xs"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-zinc-950 uppercase tracking-tight">
              Confirm Delete Product?
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-zinc-950">{productToDelete.name}</strong> (SKU: {productToDelete.sku})? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold border border-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
