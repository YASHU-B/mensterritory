import React from 'react';
import { getProductBySlug, getProducts } from '@/lib/supabase/data-service';
import ProductPageClientWrapper from '@/components/storefront/ProductPageClientWrapper';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product | Men's Territory" };
  }

  return {
    title: `${product.name} | Men's Territory — The Real Man's Choice`,
    description: product.short_description || product.description.slice(0, 150),
    openGraph: {
      title: `${product.name} — ₹${product.price} | Men's Territory`,
      description: product.short_description || product.description.slice(0, 150),
      images: [
        {
          url: product.thumbnail || product.images[0] || '',
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Load related products
  const relatedProducts = await getProducts({
    limit: 4,
  });

  const filteredRelated = product
    ? relatedProducts.filter((p) => p.id !== product.id).slice(0, 4)
    : [];

  return (
    <ProductPageClientWrapper
      initialProduct={product}
      slug={slug}
      initialRelated={filteredRelated}
    />
  );
}
