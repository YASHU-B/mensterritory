import { supabase, isSupabaseConfigured } from './client';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_STORE_SETTINGS,
  INITIAL_ORDERS,
} from './fallback-data';
import {
  Product,
  Category,
  Banner,
  StoreSettings,
  Order,
  OrderItem,
  OrderStatus,
} from '@/types';

// Browser LocalStorage Keys for Clean Catalog Persistence
const LS_SETTINGS = 'mt_store_settings_v2';
const LS_CATEGORIES = 'mt_categories_v2';
const LS_PRODUCTS = 'mt_products_v2';
const LS_BANNERS = 'mt_banners_v2';
const LS_ORDERS = 'mt_orders_v2';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// Clean old demo cache if present
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('mt_products');
    localStorage.removeItem('mt_banners');
  } catch {}
}

// In-memory fallback cache in case localStorage is unavailable or quota exceeded
const memoryStore: Record<string, unknown> = {};

function getStored<T>(key: string, fallback: T): T {
  if (memoryStore[key]) return memoryStore[key] as T;
  if (!isBrowser()) return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item) as T;
    memoryStore[key] = parsed;
    return parsed;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  memoryStore[key] = val;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, preserving in memory cache');
    } else {
      console.error('Failed to save to localStorage', e);
    }
  }
}

// -----------------------------------------------------------------------------
// STORE SETTINGS
// -----------------------------------------------------------------------------
export async function getStoreSettings(): Promise<StoreSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) {
        return data as StoreSettings;
      }
    } catch (e) {
      console.warn('Supabase store settings fetch error, using fallback:', e);
    }
  }
  return getStored<StoreSettings>(LS_SETTINGS, INITIAL_STORE_SETTINGS);
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated: StoreSettings = { ...current, ...settings, updated_at: new Date().toISOString() };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .upsert(updated)
        .select()
        .single();
      if (!error && data) {
        setStored(LS_SETTINGS, data);
        return data as StoreSettings;
      }
    } catch (e) {
      console.error('Supabase settings update error:', e);
    }
  }

  setStored(LS_SETTINGS, updated);
  return updated;
}

// -----------------------------------------------------------------------------
// CATEGORIES
// -----------------------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase categories fetch error:', e);
    }
  }
  const cached = getStored<Category[]>(LS_CATEGORIES, INITIAL_CATEGORIES);
  return cached.sort((a, b) => a.display_order - b.display_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const clean = slug.trim().toLowerCase();
  const norm = clean.replace(/[^a-z0-9]/g, '');
  const categories = await getCategories();
  return (
    categories.find(
      (c) =>
        c.is_active &&
        (c.slug.toLowerCase() === clean ||
          c.slug.replace(/[^a-z0-9]/g, '') === norm ||
          c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === norm)
    ) || null
  );
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const categories = await getCategories();
  let updatedCategory: Category;

  if (category.id) {
    const idx = categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      updatedCategory = { ...categories[idx], ...category, updated_at: new Date().toISOString() };
      categories[idx] = updatedCategory;
    } else {
      updatedCategory = {
        id: category.id,
        name: category.name || 'New Category',
        slug: category.slug || 'new-category',
        description: category.description || '',
        image_url: category.image_url || '',
        display_order: category.display_order || categories.length + 1,
        is_active: category.is_active ?? true,
        created_at: new Date().toISOString(),
      };
      categories.push(updatedCategory);
    }
  } else {
    updatedCategory = {
      id: 'cat_' + Date.now(),
      name: category.name || 'New Category',
      slug: category.slug || `cat-${Date.now()}`,
      description: category.description || '',
      image_url: category.image_url || '',
      display_order: category.display_order || categories.length + 1,
      is_active: category.is_active ?? true,
      created_at: new Date().toISOString(),
    };
    categories.push(updatedCategory);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .upsert(updatedCategory)
        .select()
        .single();
      if (!error && data) {
        setStored(LS_CATEGORIES, categories);
        return data as Category;
      }
    } catch (e) {
      console.error('Supabase category save error:', e);
    }
  }

  setStored(LS_CATEGORIES, categories);
  return updatedCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase category delete error:', e);
    }
  }
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  setStored(LS_CATEGORIES, filtered);
  return true;
}

// -----------------------------------------------------------------------------
// PRODUCTS
// -----------------------------------------------------------------------------
export interface ProductFilterOptions {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  fit?: string;
  fabric?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'discount' | 'name-asc';
  onlyFeatured?: boolean;
  onlyBestSeller?: boolean;
  onlyTrending?: boolean;
  onlyNewArrival?: boolean;
  onlyOffer?: boolean;
  limit?: number;
}

export async function getProducts(options?: ProductFilterOptions): Promise<Product[]> {
  let products: Product[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('products').select('*');
      if (options?.onlyFeatured) query = query.eq('is_featured', true);
      if (options?.onlyBestSeller) query = query.eq('is_best_seller', true);
      if (options?.onlyTrending) query = query.eq('is_trending', true);
      if (options?.onlyNewArrival) query = query.eq('is_new_arrival', true);
      if (options?.onlyOffer) query = query.eq('is_offer', true);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        products = data.map((d: any) => ({
          ...d,
          category_name: d.category_name || d.subcategory || '',
        })) as Product[];
      }
    } catch (e) {
      console.warn('Supabase products fetch error:', e);
    }
  }

  // Also merge with locally stored products so newly added admin products are immediately visible
  const localProducts = getStored<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  if (localProducts.length > 0) {
    const existingIds = new Set(products.map((p) => p.id));
    const existingSlugs = new Set(products.map((p) => p.slug));
    for (const lp of localProducts) {
      if (!existingIds.has(lp.id) && !existingSlugs.has(lp.slug)) {
        products.push(lp);
      }
    }
  }

  if (products.length === 0) {
    products = getStored<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  }

  // Filter Active
  let filtered = [...products].filter((p) => p.is_active);

  // Category filter
  if (options?.categorySlug) {
    const slug = options.categorySlug.toLowerCase().trim();
    const normSlug = slug.replace(/[^a-z0-9]/g, '');
    const categories = await getCategories();
    const matchedCategory = categories.find(
      (c) =>
        c.slug.toLowerCase() === slug ||
        c.slug.replace(/[^a-z0-9]/g, '') === normSlug ||
        c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normSlug
    );

    filtered = filtered.filter((p) => {
      // 1. Direct category ID match
      if (matchedCategory && p.category_id && p.category_id === matchedCategory.id) {
        return true;
      }

      // 2. Category name match
      const pCatName = (p.category_name || p.subcategory || '').toLowerCase();
      const pNormCat = pCatName.replace(/[^a-z0-9]/g, '');
      if (matchedCategory) {
        const targetName = matchedCategory.name.toLowerCase();
        const targetNorm = targetName.replace(/[^a-z0-9]/g, '');
        if (pCatName === targetName || pNormCat === targetNorm) return true;
      }

      // 3. Normalized slug / category name match
      if (pNormCat && (pNormCat === normSlug || pNormCat.includes(normSlug) || normSlug.includes(pNormCat))) {
        return true;
      }

      // 4. Tags match
      if (
        p.tags &&
        p.tags.some((t) => {
          const normTag = t.toLowerCase().replace(/[^a-z0-9]/g, '');
          return normTag === normSlug || normTag.includes(normSlug) || normSlug.includes(normTag);
        })
      ) {
        return true;
      }

      // 5. Special keyword matching for common apparel categories:
      // T-Shirts: matches "tshirt", "tshirts", "t-shirt", "tee", "oversized t-shirt", "polo"
      if (normSlug === 'tshirts' || normSlug === 'tshirt' || normSlug === 'tees') {
        const n = p.name.toLowerCase();
        if (
          pCatName.includes('t-shirt') ||
          pCatName.includes('tshirt') ||
          pCatName.includes('tee') ||
          n.includes('t-shirt') ||
          n.includes('tshirt') ||
          n.includes(' tee') ||
          n.endsWith('tee')
        ) {
          return true;
        }
      }

      // Formal shirts: matches "formal", "formal-shirt"
      if (normSlug === 'formalshirts' || normSlug === 'formalshirt') {
        const n = p.name.toLowerCase();
        if (pCatName.includes('formal') || n.includes('formal')) {
          return true;
        }
      }

      // Baggy shirts: matches "baggy" & "shirt"
      if (normSlug === 'baggyshirts' || normSlug === 'baggyshirt') {
        const n = p.name.toLowerCase();
        if (
          (pCatName.includes('baggy') && pCatName.includes('shirt')) ||
          (n.includes('baggy') && n.includes('shirt'))
        ) {
          return true;
        }
      }

      // Baggy pants: matches "baggy" & "pant"
      if (normSlug === 'baggypants' || normSlug === 'baggypant') {
        const n = p.name.toLowerCase();
        if (
          (pCatName.includes('baggy') && (pCatName.includes('pant') || pCatName.includes('trouser'))) ||
          (n.includes('baggy') && (n.includes('pant') || n.includes('trouser')))
        ) {
          return true;
        }
      }

      // Pants: matches any pants / trousers / chinos / cargos
      if (normSlug === 'pants' || normSlug === 'pant') {
        const n = p.name.toLowerCase();
        if (
          pCatName.includes('pant') ||
          pCatName.includes('trouser') ||
          pCatName.includes('chino') ||
          pCatName.includes('cargo') ||
          n.includes('pant') ||
          n.includes('trouser') ||
          n.includes('chino') ||
          n.includes('cargo')
        ) {
          return true;
        }
      }

      return false;
    });
  }

  // Search filter
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Price filters
  if (options?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= options.minPrice!);
  }
  if (options?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= options.maxPrice!);
  }

  // Size filter
  if (options?.size) {
    filtered = filtered.filter((p) =>
      p.available_sizes.some((s) => s.toLowerCase() === options.size!.toLowerCase())
    );
  }

  // Color filter
  if (options?.color) {
    filtered = filtered.filter((p) =>
      p.available_colors.some((c) => c.toLowerCase() === options.color!.toLowerCase())
    );
  }

  // Fit filter
  if (options?.fit) {
    filtered = filtered.filter((p) =>
      p.fit.toLowerCase().includes(options.fit!.toLowerCase())
    );
  }

  // Flags filter
  if (options?.onlyFeatured) filtered = filtered.filter((p) => p.is_featured);
  if (options?.onlyBestSeller) filtered = filtered.filter((p) => p.is_best_seller);
  if (options?.onlyTrending) filtered = filtered.filter((p) => p.is_trending);
  if (options?.onlyNewArrival) filtered = filtered.filter((p) => p.is_new_arrival);
  if (options?.onlyOffer) filtered = filtered.filter((p) => p.is_offer);

  // Sorting
  if (options?.sortBy) {
    switch (options.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount_percent - a.discount_percent);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
  }

  if (options?.limit && options.limit > 0) {
    return filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Product[];
    } catch (e) {
      console.warn('Supabase admin products fetch error:', e);
    }
  }
  return getStored<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
}

function isValidUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) return data as Product;
    } catch (e) {
      console.warn('Supabase getProductBySlug error:', e);
    }
  }
  const products = await getAllProductsAdmin();
  return products.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) return data as Product;
    } catch (e) {
      console.warn('Supabase getProductById error:', e);
    }
  }
  const products = await getAllProductsAdmin();
  return products.find((p) => p.id === id || p.slug === id) || null;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const products = await getAllProductsAdmin();
  let updatedProduct: Product;

  const discountPercent =
    product.original_price && product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : product.discount_percent || 0;

  // Ensure a valid UUID for Supabase
  const targetId = isValidUUID(product.id) ? product.id! : generateUUID();

  if (product.id) {
    const idx = products.findIndex((p) => p.id === product.id || p.id === targetId);
    if (idx >= 0) {
      updatedProduct = {
        ...products[idx],
        ...product,
        id: targetId,
        discount_percent: discountPercent,
        updated_at: new Date().toISOString(),
      } as Product;
      products[idx] = updatedProduct;
    } else {
      updatedProduct = {
        ...product,
        id: targetId,
        discount_percent: discountPercent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Product;
      products.push(updatedProduct);
    }
  } else {
    updatedProduct = {
      ...product,
      id: targetId,
      discount_percent: discountPercent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Product;
    products.push(updatedProduct);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // Build safe Supabase payload containing ONLY columns that exist in public.products table
      const categoryId = isValidUUID(updatedProduct.category_id) ? updatedProduct.category_id : null;
      const supabasePayload = {
        id: targetId,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        description: updatedProduct.description || '',
        short_description: updatedProduct.short_description || '',
        category_id: categoryId,
        subcategory: updatedProduct.subcategory || updatedProduct.category_name || '',
        price: Number(updatedProduct.price) || 0,
        original_price: Number(updatedProduct.original_price) || 0,
        discount_price: Number(updatedProduct.discount_price || 0),
        discount_percent: Number(updatedProduct.discount_percent || 0),
        sku: updatedProduct.sku,
        brand: updatedProduct.brand || "Men's Territory",
        available_sizes: updatedProduct.available_sizes || [],
        available_colors: updatedProduct.available_colors || [],
        stock_quantity: Number(updatedProduct.stock_quantity) || 0,
        low_stock_threshold: Number(updatedProduct.low_stock_threshold) || 3,
        images: updatedProduct.images || [],
        thumbnail: updatedProduct.thumbnail || '',
        featured_image: updatedProduct.featured_image || updatedProduct.thumbnail || '',
        material: updatedProduct.material || 'Cotton Blend',
        fabric: updatedProduct.fabric || '100% Premium Cotton',
        fit: updatedProduct.fit || 'Relaxed Fit',
        pattern: updatedProduct.pattern || 'Solid',
        gender: updatedProduct.gender || 'Men',
        tags: updatedProduct.tags || [],
        is_active: updatedProduct.is_active ?? true,
        is_featured: updatedProduct.is_featured ?? false,
        is_best_seller: updatedProduct.is_best_seller ?? false,
        is_trending: updatedProduct.is_trending ?? false,
        is_new_arrival: updatedProduct.is_new_arrival ?? false,
        is_offer: updatedProduct.is_offer ?? false,
        display_order: Number(updatedProduct.display_order || 0),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('products')
        .upsert(supabasePayload)
        .select()
        .single();

      if (!error && data) {
        const fullProduct = {
          ...updatedProduct,
          ...data,
          category_name: updatedProduct.category_name || data.subcategory || '',
        };
        const updatedList = products.map((p) => (p.id === targetId ? fullProduct : p));
        setStored(LS_PRODUCTS, updatedList);
        return fullProduct as Product;
      } else if (error) {
        console.warn('Supabase product upsert warning:', error.message);
      }
    } catch (e) {
      console.error('Supabase product save error:', e);
    }
  }

  setStored(LS_PRODUCTS, products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase product delete error:', e);
    }
  }
  const products = await getAllProductsAdmin();
  const filtered = products.filter((p) => p.id !== id);
  setStored(LS_PRODUCTS, filtered);
  return true;
}

// -----------------------------------------------------------------------------
// BANNERS
// -----------------------------------------------------------------------------
export async function getBanners(): Promise<Banner[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Banner[];
    } catch (e) {
      console.warn('Supabase banners fetch error:', e);
    }
  }
  return getStored<Banner[]>(LS_BANNERS, INITIAL_BANNERS);
}

export async function saveBanner(banner: Partial<Banner>): Promise<Banner> {
  const banners = await getBanners();
  let updatedBanner: Banner;

  if (banner.id) {
    const idx = banners.findIndex((b) => b.id === banner.id);
    if (idx >= 0) {
      updatedBanner = { ...banners[idx], ...banner };
      banners[idx] = updatedBanner;
    } else {
      updatedBanner = {
        id: banner.id,
        title: banner.title || "Men's Territory",
        subtitle: banner.subtitle || '',
        cta_text: banner.cta_text || 'SHOP NOW',
        cta_link: banner.cta_link || '/shop',
        image_url: banner.image_url || '',
        is_active: banner.is_active ?? true,
        display_order: banner.display_order || banners.length + 1,
        type: banner.type || 'hero',
      };
      banners.push(updatedBanner);
    }
  } else {
    updatedBanner = {
      id: 'banner_' + Date.now(),
      title: banner.title || "Men's Territory",
      subtitle: banner.subtitle || '',
      cta_text: banner.cta_text || 'SHOP NOW',
      cta_link: banner.cta_link || '/shop',
      image_url: banner.image_url || '',
      is_active: banner.is_active ?? true,
      display_order: banner.display_order || banners.length + 1,
      type: banner.type || 'hero',
    };
    banners.push(updatedBanner);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .upsert(updatedBanner)
        .select()
        .single();
      if (!error && data) {
        setStored(LS_BANNERS, banners);
        return data as Banner;
      }
    } catch (e) {
      console.error('Supabase banner save error:', e);
    }
  }

  setStored(LS_BANNERS, banners);
  return updatedBanner;
}

export async function deleteBanner(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('banners').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase banner delete error:', e);
    }
  }
  const banners = await getBanners();
  const filtered = banners.filter((b) => b.id !== id);
  setStored(LS_BANNERS, filtered);
  return true;
}

// -----------------------------------------------------------------------------
// ORDERS
// -----------------------------------------------------------------------------
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Order[];
    } catch (e) {
      console.warn('Supabase orders fetch error:', e);
    }
  }
  return getStored<Order[]>(LS_ORDERS, INITIAL_ORDERS);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const clean = id.trim();
  if (!clean) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .or(`id.eq.${clean},order_number.ilike.${clean}`)
        .maybeSingle();

      if (!error && data) return data as Order;
    } catch (e) {
      console.warn('Supabase getOrderById error:', e);
    }
  }

  const orders = await getOrders();
  return orders.find((o) => o.id === clean || o.order_number?.toLowerCase() === clean.toLowerCase()) || null;
}

export async function lookupCustomerOrders(query: string): Promise<Order[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const digits = clean.replace(/[^0-9]/g, '');

  if (isSupabaseConfigured && supabase) {
    try {
      let builder = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `);

      if (clean.startsWith('mt-') || clean.includes('-')) {
        builder = builder.ilike('order_number', `%${clean}%`);
      } else if (digits.length >= 6) {
        builder = builder.or(`phone.ilike.%${digits}%,alternative_phone.ilike.%${digits}%,order_number.ilike.%${clean}%`);
      } else {
        builder = builder.or(`order_number.ilike.%${clean}%,customer_name.ilike.%${clean}%`);
      }

      const { data, error } = await builder.order('created_at', { ascending: false }).limit(20);
      if (!error && data && data.length > 0) {
        return data as Order[];
      }
    } catch (e) {
      console.warn('Supabase lookupCustomerOrders error:', e);
    }
  }

  // Fallback to local stored orders
  const orders = await getOrders();
  return orders.filter((o) => {
    const orderNumMatch = o.order_number?.toLowerCase().includes(clean);
    const phoneDigits = o.phone ? o.phone.replace(/[^0-9]/g, '') : '';
    const altDigits = o.alternative_phone ? o.alternative_phone.replace(/[^0-9]/g, '') : '';
    const phoneMatch = digits.length >= 6 && (phoneDigits.includes(digits) || altDigits.includes(digits));
    const exactIdMatch = o.id?.toLowerCase() === clean;
    return orderNumMatch || phoneMatch || exactIdMatch;
  });
}

export async function createNewOrder(
  orderInput: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>,
  items: Omit<OrderItem, 'id' | 'order_id'>[]
): Promise<Order> {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `MT-${dateStr}-${randomSuffix}`;
  const orderId = 'ord_' + Date.now();

  const fullOrder: Order = {
    ...orderInput,
    id: orderId,
    order_number: orderNumber,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    items: items.map((it, idx) => ({
      ...it,
      id: `item_${Date.now()}_${idx}`,
      order_id: orderId,
    })),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      // Insert order into Supabase
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: orderInput.customer_name,
          phone: orderInput.phone,
          alternative_phone: orderInput.alternative_phone || '',
          email: orderInput.email || '',
          address: orderInput.address,
          city: orderInput.city,
          district: orderInput.district,
          state: orderInput.state,
          pincode: orderInput.pincode,
          notes: orderInput.notes || '',
          subtotal: orderInput.subtotal,
          discount: orderInput.discount || 0,
          total: orderInput.total,
          status: orderInput.status || 'Pending',
          payment_status: orderInput.payment_status || 'Not Required',
          order_source: orderInput.order_source || 'WhatsApp',
          internal_notes: '',
        })
        .select()
        .single();

      if (!orderErr && orderData) {
        // Insert items
        const itemsToInsert = items.map((it) => ({
          order_id: orderData.id,
          product_id: it.product_id,
          product_name: it.product_name,
          sku: it.sku,
          quantity: it.quantity,
          size: it.size,
          color: it.color,
          unit_price: it.unit_price,
          total_price: it.total_price,
          image_url: it.image_url || '',
        }));

        await supabase.from('order_items').insert(itemsToInsert);

        const savedOrder = { ...fullOrder, id: orderData.id, order_number: orderData.order_number };
        // Sync local storage as well
        const localOrders = getStored<Order[]>(LS_ORDERS, INITIAL_ORDERS);
        setStored(LS_ORDERS, [savedOrder, ...localOrders]);
        return savedOrder;
      }
    } catch (e) {
      console.error('Supabase order creation error:', e);
    }
  }

  // Local fallback
  const localOrders = getStored<Order[]>(LS_ORDERS, INITIAL_ORDERS);
  setStored(LS_ORDERS, [fullOrder, ...localOrders]);
  return fullOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  internalNotes?: string
): Promise<Order | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const updatePayload: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (internalNotes !== undefined) {
        updatePayload.internal_notes = internalNotes;
      }

      await supabase.from('orders').update(updatePayload).eq('id', orderId);
    } catch (e) {
      console.error('Supabase order status update error:', e);
    }
  }

  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    orders[idx].status = status;
    if (internalNotes !== undefined) {
      orders[idx].internal_notes = internalNotes;
    }
    orders[idx].updated_at = new Date().toISOString();
    setStored(LS_ORDERS, orders);
    return orders[idx];
  }
  return null;
}

// -----------------------------------------------------------------------------
// DASHBOARD ANALYTICS & STATS
// -----------------------------------------------------------------------------
export async function getDashboardStats() {
  const products = await getAllProductsAdmin();
  const orders = await getOrders();

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const lowStockProducts = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock_quantity === 0).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const confirmedOrders = orders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Packed' || o.status === 'Shipped' || o.status === 'Delivered'
  ).length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

  const totalOrderValue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.created_at.startsWith(todayStr)).length;

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const thisMonthOrders = orders.filter((o) => o.created_at.startsWith(currentMonthStr)).length;

  return {
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    cancelledOrders,
    totalOrderValue,
    todayOrders,
    thisMonthOrders,
  };
}
