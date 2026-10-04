-- ==============================================================================
-- MEN'S TERRITORY (The Real Man's Choice)
-- Complete E-commerce Schema, RLS, Functions & Triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORE SETTINGS TABLE
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
    email TEXT NOT NULL DEFAULT 'contact@mensterritory.com',
    about_text TEXT NOT NULL DEFAULT 'Men''s Territory is a premier men''s fashion destination focused on bringing modern, confident and versatile styles for today''s man.',
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    announcement_text TEXT NOT NULL DEFAULT '🔥 Exclusive Styles | The Real Man''s Choice | Order Directly on WhatsApp',
    is_announcement_active BOOLEAN NOT NULL DEFAULT true,
    hero_title TEXT NOT NULL DEFAULT 'MEN''S TERRITORY',
    hero_subtitle TEXT NOT NULL DEFAULT 'The Real Man''s Choice — Modern, Confident, Versatile Styles Crafted for the Urban Gentleman.',
    hero_cta_text TEXT NOT NULL DEFAULT 'EXPLORE SHOP',
    hero_cta_link TEXT NOT NULL DEFAULT '/shop',
    hero_image_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
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

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT DEFAULT '',
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory TEXT DEFAULT '',
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) NOT NULL CHECK (original_price >= 0),
    discount_price NUMERIC(10, 2) DEFAULT 0,
    discount_percent INT NOT NULL DEFAULT 0,
    sku TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL DEFAULT 'Men''s Territory',
    available_sizes TEXT[] NOT NULL DEFAULT ARRAY['S', 'M', 'L', 'XL'],
    available_colors TEXT[] NOT NULL DEFAULT ARRAY['Black', 'White'],
    stock_quantity INT NOT NULL DEFAULT 10 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 3 CHECK (low_stock_threshold >= 0),
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    thumbnail TEXT NOT NULL DEFAULT '',
    featured_image TEXT DEFAULT '',
    material TEXT DEFAULT 'Cotton Blend',
    fabric TEXT NOT NULL DEFAULT '100% Premium Cotton',
    fit TEXT NOT NULL DEFAULT 'Relaxed Fit',
    pattern TEXT DEFAULT 'Solid',
    gender TEXT NOT NULL DEFAULT 'Men',
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
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

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    sku TEXT DEFAULT '',
    price NUMERIC(10, 2),
    stock INT NOT NULL DEFAULT 5 CHECK (stock >= 0),
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_product_size_color UNIQUE (product_id, size, color)
);

-- 5. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    cta_text TEXT NOT NULL DEFAULT 'SHOP NOW',
    cta_link TEXT NOT NULL DEFAULT '/shop',
    image_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    type TEXT NOT NULL DEFAULT 'hero', -- 'hero', 'promo', 'announcement'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    alternative_phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    notes TEXT DEFAULT '',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Pending',
    payment_status TEXT NOT NULL DEFAULT 'Not Required',
    order_source TEXT NOT NULL DEFAULT 'WhatsApp',
    internal_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    image_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- linked to auth.users if Supabase auth is active
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    full_name TEXT NOT NULL DEFAULT 'Administrator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ==============================================================================
-- AUTO-GENERATE ORDER NUMBER FUNCTION
-- Format: MT-YYYYMMDD-XXXX (e.g., MT-20261004-0001)
-- ==============================================================================
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    today_str TEXT;
    seq_val INT;
BEGIN
    today_str := TO_CHAR(NOW(), 'YYYYMMDD');
    seq_val := NEXTVAL('order_number_seq');
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'MT-' || today_str || '-' || LPAD(seq_val::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_order_number ON public.orders;
CREATE TRIGGER trigger_generate_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid() OR email = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Store settings: Public can read, admin can update
CREATE POLICY "Public can view store settings" ON public.store_settings
    FOR SELECT TO public USING (true);
CREATE POLICY "Admin can update store settings" ON public.store_settings
    FOR ALL TO authenticated USING (is_admin());

-- 2. Categories: Public can read active, admin can manage all
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT TO public USING (is_active = true OR is_admin());
CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL TO authenticated USING (is_admin());

-- 3. Products: Public can read active, admin can manage all
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT TO public USING (is_active = true OR is_admin());
CREATE POLICY "Admin can manage products" ON public.products
    FOR ALL TO authenticated USING (is_admin());

-- 4. Product Variants: Public can read, admin can manage
CREATE POLICY "Public can view variants" ON public.product_variants
    FOR SELECT TO public USING (true);
CREATE POLICY "Admin can manage variants" ON public.product_variants
    FOR ALL TO authenticated USING (is_admin());

-- 5. Product Images: Public can read, admin can manage
CREATE POLICY "Public can view product images" ON public.product_images
    FOR SELECT TO public USING (true);
CREATE POLICY "Admin can manage product images" ON public.product_images
    FOR ALL TO authenticated USING (is_admin());

-- 6. Banners: Public can read active, admin can manage
CREATE POLICY "Public can view active banners" ON public.banners
    FOR SELECT TO public USING (is_active = true OR is_admin());
CREATE POLICY "Admin can manage banners" ON public.banners
    FOR ALL TO authenticated USING (is_admin());

-- 7. Orders: Anyone can create an order, but only admin can view & update all orders
CREATE POLICY "Public can create orders" ON public.orders
    FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admin can manage orders" ON public.orders
    FOR ALL TO authenticated USING (is_admin());

-- 8. Order items: Anyone can insert items with their order, admin can manage all
CREATE POLICY "Public can insert order items" ON public.order_items
    FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admin can manage order items" ON public.order_items
    FOR ALL TO authenticated USING (is_admin());

-- 9. Admin users & logs: only admin can access
CREATE POLICY "Admins can view admin_users" ON public.admin_users
    FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can view audit_logs" ON public.audit_logs
    FOR ALL TO authenticated USING (is_admin());

-- ==============================================================================
-- 10. SUPABASE STORAGE BUCKETS (Product Images, Banners, Store Assets)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies: Public read, authenticated/public insert for admin operations
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
CREATE POLICY "Anyone can upload product images" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can view banners bucket" ON storage.objects;
CREATE POLICY "Public can view banners bucket" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Anyone can upload banners" ON storage.objects;
CREATE POLICY "Anyone can upload banners" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'banners');

DROP POLICY IF EXISTS "Public can view categories bucket" ON storage.objects;
CREATE POLICY "Public can view categories bucket" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'categories');

DROP POLICY IF EXISTS "Anyone can upload categories" ON storage.objects;
CREATE POLICY "Anyone can upload categories" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'categories');

