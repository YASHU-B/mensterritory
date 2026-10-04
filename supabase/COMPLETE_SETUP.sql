-- ==============================================================================
-- MEN'S TERRITORY — COMPLETE DATABASE SETUP & SEED SCRIPT
-- Paste and Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'Men''s Territory',
    tagline TEXT NOT NULL DEFAULT 'The Real Man''s Choice',
    logo_url TEXT DEFAULT '',
    whatsapp_number TEXT NOT NULL DEFAULT '7815858973',
    phone_primary TEXT NOT NULL DEFAULT '7815858973',
    phone_secondary TEXT NOT NULL DEFAULT '8897899946',
    instagram_handle TEXT NOT NULL DEFAULT '@mens_territory_mt',
    address_line1 TEXT NOT NULL DEFAULT 'VNR Peta (Taduku Peta)',
    address_line2 TEXT NOT NULL DEFAULT 'Nagari (M)',
    city TEXT NOT NULL DEFAULT 'Nagari',
    district TEXT NOT NULL DEFAULT 'Chittoor District',
    state TEXT NOT NULL DEFAULT 'Andhra Pradesh',
    pincode TEXT NOT NULL DEFAULT '517590',
    email TEXT NOT NULL DEFAULT 'orders@mensterritory.com',
    about_text TEXT NOT NULL DEFAULT 'Men''s Territory is a curated men''s fashion destination focused on bringing modern, confident and versatile styles for today''s man.',
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    announcement_text TEXT NOT NULL DEFAULT '⚡ Exclusive Collection Live | Direct WhatsApp Ordering | Fast Dispatch',
    is_announcement_active BOOLEAN NOT NULL DEFAULT true,
    hero_title TEXT NOT NULL DEFAULT 'MEN''S TERRITORY',
    hero_subtitle TEXT NOT NULL DEFAULT 'The Real Man''s Choice — Modern, Confident, Versatile Styles Crafted for the Urban Gentleman.',
    hero_cta_text TEXT NOT NULL DEFAULT 'EXPLORE SHOP',
    hero_cta_link TEXT NOT NULL DEFAULT '/shop',
    hero_image_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    short_description TEXT DEFAULT '',
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory TEXT DEFAULT '',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_price NUMERIC(10, 2) DEFAULT 0,
    discount_percent INT DEFAULT 0,
    sku TEXT UNIQUE,
    brand TEXT DEFAULT 'Men''s Territory',
    available_sizes TEXT[] DEFAULT ARRAY['M', 'L', 'XL']::TEXT[],
    available_colors TEXT[] DEFAULT ARRAY['Default']::TEXT[],
    stock_quantity INT NOT NULL DEFAULT 10,
    low_stock_threshold INT NOT NULL DEFAULT 3,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    thumbnail TEXT DEFAULT '',
    featured_image TEXT DEFAULT '',
    material TEXT DEFAULT 'Cotton Blend',
    fabric TEXT DEFAULT '100% Premium Cotton',
    fit TEXT DEFAULT 'Relaxed Fit',
    pattern TEXT DEFAULT 'Solid',
    gender TEXT DEFAULT 'Men',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_best_seller BOOLEAN NOT NULL DEFAULT false,
    is_trending BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_offer BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    price_adjustment NUMERIC(10, 2) DEFAULT 0,
    sku TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, size, color)
);

-- 6. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    cta_text TEXT DEFAULT 'SHOP NOW',
    cta_link TEXT DEFAULT '/shop',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    banner_type TEXT NOT NULL DEFAULT 'hero',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT DEFAULT '',
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Andhra Pradesh',
    pincode TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    shipping_fee NUMERIC(10, 2) DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'whatsapp_pay',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'placed',
    tracking_number TEXT DEFAULT '',
    courier_name TEXT DEFAULT '',
    tracking_link TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT DEFAULT '',
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to avoid conflicts
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN ('store_settings', 'categories', 'products', 'product_variants', 'product_images', 'banners', 'orders', 'order_items')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- 11. CONFIGURE POLICIES (Full Read/Write access for App & Service Role)
-- Store Settings
CREATE POLICY "store_settings_read" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "store_settings_all" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- Categories
CREATE POLICY "categories_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_all" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Products
CREATE POLICY "products_read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_all" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Variants & Images
CREATE POLICY "variants_read" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "variants_all" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "images_read" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "images_all" ON public.product_images FOR ALL USING (true) WITH CHECK (true);

-- Banners
CREATE POLICY "banners_read" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners_all" ON public.banners FOR ALL USING (true) WITH CHECK (true);

-- Orders & Items
CREATE POLICY "orders_read" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_all" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "order_items_read" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "order_items_all" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

-- 12. GRANT PERMISSIONS TO anon & authenticated & service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 13. CONFIGURE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('product-images', 'product-images', true),
    ('banners', 'banners', true),
    ('categories', 'categories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
CREATE POLICY "Anyone can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;
CREATE POLICY "Anyone can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;
CREATE POLICY "Anyone can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can view banners" ON storage.objects;
CREATE POLICY "Public can view banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
DROP POLICY IF EXISTS "Anyone can upload banners" ON storage.objects;
CREATE POLICY "Anyone can upload banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners');

DROP POLICY IF EXISTS "Public can view categories bucket" ON storage.objects;
CREATE POLICY "Public can view categories bucket" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
DROP POLICY IF EXISTS "Anyone can upload categories bucket" ON storage.objects;
CREATE POLICY "Anyone can upload categories bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'categories');

-- 14. SEED DEFAULT STORE SETTINGS
INSERT INTO public.store_settings (
    id, store_name, tagline, whatsapp_number, phone_primary, phone_secondary, instagram_handle,
    address_line1, address_line2, city, district, state, pincode, email, about_text, currency_symbol,
    announcement_text, is_announcement_active, hero_title, hero_subtitle, hero_cta_text, hero_cta_link
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Men''s Territory',
    'The Real Man''s Choice',
    '7815858973',
    '7815858973',
    '8897899946',
    '@mens_territory_mt',
    'VNR Peta (Taduku Peta)',
    'Nagari (M)',
    'Nagari',
    'Chittoor District',
    'Andhra Pradesh',
    '517590',
    'orders@mensterritory.com',
    'Men''s Territory is a curated men''s fashion destination focused on bringing modern, confident and versatile styles for today''s man. Established in Nagari, we bring high-street streetwear, classic formals, oversized aesthetics, and relaxed everyday essentials right to your wardrobe.',
    '₹',
    '⚡ New Collection Live | Order Directly on WhatsApp | Fast Dispatch Across India',
    true,
    'MEN''S TERRITORY',
    'The Real Man''s Choice — Modern, Confident, Versatile Styles Crafted for the Urban Gentleman.',
    'SHOP COLLECTION',
    '/shop'
) ON CONFLICT (id) DO NOTHING;

-- 15. SEED ALL 15 APPAREL CATEGORIES
INSERT INTO public.categories (id, name, slug, description, display_order, is_active) VALUES
('b0000000-0000-0000-0000-000000000001', 'Formal Shirts', 'formal-shirts', 'Crisp, structured formal shirts tailored for boardrooms and celebrations.', 1, true),
('b0000000-0000-0000-0000-000000000002', 'Casual Shirts', 'casual-shirts', 'Breathable cotton and linen shirts for effortless everyday styling.', 2, true),
('b0000000-0000-0000-0000-000000000003', 'Baggy Shirts', 'baggy-shirts', 'Boxy silhouette shirts engineered for relaxed contemporary comfort.', 3, true),
('b0000000-0000-0000-0000-000000000004', 'Oversized Shirts', 'oversized-shirts', 'Streetwear-inspired oversized cuts crafted from premium draping fabrics.', 4, true),
('b0000000-0000-0000-0000-000000000005', 'T-Shirts', 't-shirts', 'Essential crew necks made of combed compact luxury cotton.', 5, true),
('b0000000-0000-0000-0000-000000000006', 'Oversized T-Shirts', 'oversized-t-shirts', 'Heavyweight 240+ GSM drop-shoulder tees with clean streetwear fits.', 6, true),
('b0000000-0000-0000-0000-000000000007', 'Polo T-Shirts', 'polo-t-shirts', 'Textured knit and pique polo tees with structured collars.', 7, true),
('b0000000-0000-0000-0000-000000000008', 'Pants', 'pants', 'Sharply tailored trousers and comfort-stretch chinos.', 8, true),
('b0000000-0000-0000-0000-000000000009', 'Baggy Pants', 'baggy-pants', 'Relaxed wide-leg trousers built for modern street aesthetics.', 9, true),
('b0000000-0000-0000-0000-000000000010', 'Cargo Pants', 'cargo-pants', 'Functional tactical utility pockets with durable canvas construction.', 10, true),
('b0000000-0000-0000-0000-000000000011', 'Jeans', 'jeans', 'Vintage washed, straight cut and relaxed silhouette denim.', 11, true),
('b0000000-0000-0000-0000-000000000012', 'Jackets', 'jackets', 'Overshirts, bombers, and utility jackets made for layering.', 12, true),
('b0000000-0000-0000-0000-000000000013', 'Shorts', 'shorts', 'Casual terry and tailored walking shorts for warm days.', 13, true),
('b0000000-0000-0000-0000-000000000014', 'New Arrivals', 'new-arrivals', 'Fresh drops straight from our cutting-edge design workshop.', 14, true),
('b0000000-0000-0000-0000-000000000015', 'Offers', 'offers', 'Curated limited-edition styles with exclusive celebratory discounts.', 15, true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;
