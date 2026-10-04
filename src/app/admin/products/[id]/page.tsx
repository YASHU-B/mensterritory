'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/lib/supabase/data-service';
import ProductForm from '@/components/admin/ProductForm';
import { Product } from '@/types';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const prod = await getProductById(id);
        if (isMounted) {
          if (prod) {
            setProduct(prod);
          } else {
            setHasError(true);
          }
        }
      } catch (err) {
        console.error('Failed to load product for editing:', err);
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse py-8">
        <div className="h-8 bg-zinc-200 rounded-xl w-64" />
        <div className="h-4 bg-zinc-100 rounded-lg w-96" />
        <div className="h-96 bg-white border border-zinc-200 rounded-3xl" />
      </div>
    );
  }

  if (hasError || !product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-900 shadow-xs">
          <AlertCircle className="w-8 h-8 text-zinc-600" />
        </div>
        <h2 className="text-xl font-bold uppercase text-zinc-950">Product Not Found</h2>
        <p className="text-xs text-zinc-600 leading-relaxed">
          The requested product (ID: {id}) could not be located. It may have been removed or the link is incorrect.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEditing={true} />;
}
