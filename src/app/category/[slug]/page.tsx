import React from 'react';
import { getCategoryBySlug, getCategories, getProducts } from '@/lib/supabase/data-service';
import CategoryPageClientWrapper from '@/components/storefront/CategoryPageClientWrapper';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: "Collection | Men's Territory" };
  }
  return {
    title: `${category.name} | Men's Territory — The Real Man's Choice`,
    description:
      category.description ||
      `Shop premium ${category.name} from Men's Territory. Direct WhatsApp ordering available.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, products, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug }),
    getCategories(),
  ]);

  const otherCategories = (allCategories || [])
    .filter((c) => c.slug !== slug && c.is_active)
    .slice(0, 6);

  return (
    <CategoryPageClientWrapper
      initialCategory={category}
      initialProducts={products}
      slug={slug}
      initialOtherCategories={otherCategories}
    />
  );
}
