-- ==============================================================================
-- MEN'S TERRITORY - DEFINITIVE SUPABASE UPDATE & FIX SCRIPT
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Make sure banners table supports both banner_type and type columns
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS banner_type TEXT NOT NULL DEFAULT 'hero';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'hero';

-- 3. Ensure all public tables have Row Level Security enabled
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 4. Drop all old/restrictive policies to prevent permission conflicts
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN (
              'store_settings', 
              'categories', 
              'products', 
              'product_variants', 
              'product_images', 
              'banners', 
              'orders', 
              'order_items'
          )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- 5. Create Permissive Policies (Full Access for Storefront, Admin & Sync)
-- Store Settings
CREATE POLICY "store_settings_select" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "store_settings_modify" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- Categories
CREATE POLICY "categories_select" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_modify" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Products
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_modify" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Variants & Images
CREATE POLICY "variants_select" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "variants_modify" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "images_select" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "images_modify" ON public.product_images FOR ALL USING (true) WITH CHECK (true);

-- Banners
CREATE POLICY "banners_select" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners_modify" ON public.banners FOR ALL USING (true) WITH CHECK (true);

-- Orders & Order Items
CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_modify" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "order_items_modify" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

-- 6. Grant Permissions to Database Roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- 7. Ensure Storage Buckets Exist & Are Public
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('product-images', 'product-images', true),
    ('banners', 'banners', true),
    ('categories', 'categories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 8. Configure Storage Upload & View Policies
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Anyone can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can view banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete banners" ON storage.objects;

CREATE POLICY "Public can view banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Anyone can upload banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners');
CREATE POLICY "Anyone can update banners" ON storage.objects FOR UPDATE USING (bucket_id = 'banners');
CREATE POLICY "Anyone can delete banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Public can view categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete categories bucket" ON storage.objects;

CREATE POLICY "Public can view categories bucket" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Anyone can upload categories bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'categories');
CREATE POLICY "Anyone can update categories bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'categories');
CREATE POLICY "Anyone can delete categories bucket" ON storage.objects FOR DELETE USING (bucket_id = 'categories');

-- 9. Ensure Default Store Settings Exist (if table is empty)
INSERT INTO public.store_settings (
    id,
    store_name,
    tagline,
    whatsapp_number,
    phone_primary,
    phone_secondary,
    instagram_handle,
    address_line1,
    address_line2,
    city,
    district,
    state,
    pincode,
    email,
    about_text,
    currency_symbol,
    announcement_text,
    is_announcement_active,
    hero_title,
    hero_subtitle,
    hero_cta_text,
    hero_cta_link,
    hero_image_url
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Men''s Territory',
    'The Real Man''s Choice',
    '7815858973',
    '7815858973',
    '8897899946',
    '@mens_territory_mt',
    '7HCJ+QC7, Thadukupeta',
    'Nagari, Taduku',
    'Nagari',
    'Chittoor District',
    'Andhra Pradesh',
    '517590',
    'orders@mensterritory.com',
    'Men''s Territory is a curated men''s fashion destination focused on bringing modern, confident and versatile styles for today''s man.',
    '₹',
    '⚡ New Collection Live | Order Directly on WhatsApp | Fast Dispatch Across India',
    true,
    'MEN''S TERRITORY',
    'The Real Man''s Choice — Modern, Confident, Versatile Styles Crafted for the Urban Gentleman.',
    'SHOP COLLECTION',
    '/shop',
    '/images/banners/banner-horizontal.jpg'
) ON CONFLICT (id) DO NOTHING;

-- Verification query
SELECT 'store_settings' AS "table", count(*) FROM public.store_settings
UNION ALL
SELECT 'categories', count(*) FROM public.categories
UNION ALL
SELECT 'products', count(*) FROM public.products
UNION ALL
SELECT 'banners', count(*) FROM public.banners;
