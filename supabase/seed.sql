-- ==============================================================================
-- MEN'S TERRITORY (The Real Man's Choice)
-- Clean Production Seed Data
-- ==============================================================================

-- 1. SEED STORE SETTINGS
INSERT INTO public.store_settings (
    id,
    store_name,
    tagline,
    logo_url,
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
    '',
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
    '/shop',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 2. SEED ESSENTIAL MEN'S FASHION CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_active) VALUES
('b0000000-0000-0000-0000-000000000001', 'Formal Shirts', 'formal-shirts', 'Crisp, structured formal shirts tailored for boardrooms and celebrations.', '', 1, true),
('b0000000-0000-0000-0000-000000000002', 'Casual Shirts', 'casual-shirts', 'Breathable cotton and linen shirts for effortless everyday styling.', '', 2, true),
('b0000000-0000-0000-0000-000000000003', 'Baggy Shirts', 'baggy-shirts', 'Boxy silhouette shirts engineered for relaxed contemporary comfort.', '', 3, true),
('b0000000-0000-0000-0000-000000000004', 'Oversized Shirts', 'oversized-shirts', 'Streetwear-inspired oversized cuts crafted from premium draping fabrics.', '', 4, true),
('b0000000-0000-0000-0000-000000000005', 'T-Shirts', 't-shirts', 'Essential crew necks made of combed compact luxury cotton.', '', 5, true),
('b0000000-0000-0000-0000-000000000006', 'Oversized T-Shirts', 'oversized-t-shirts', 'Heavyweight 240+ GSM drop-shoulder tees with clean streetwear fits.', '', 6, true),
('b0000000-0000-0000-0000-000000000007', 'Polo T-Shirts', 'polo-t-shirts', 'Textured knit and pique polo tees with structured collars.', '', 7, true),
('b0000000-0000-0000-0000-000000000008', 'Pants', 'pants', 'Sharply tailored trousers and comfort-stretch chinos.', '', 8, true),
('b0000000-0000-0000-0000-000000000009', 'Baggy Pants', 'baggy-pants', 'Relaxed wide-leg trousers built for modern street aesthetics.', '', 9, true),
('b0000000-0000-0000-0000-000000000010', 'Cargo Pants', 'cargo-pants', 'Functional tactical utility pockets with durable canvas construction.', '', 10, true),
('b0000000-0000-0000-0000-000000000011', 'Jeans', 'jeans', 'Vintage washed, straight cut and relaxed silhouette denim.', '', 11, true),
('b0000000-0000-0000-0000-000000000012', 'Jackets', 'jackets', 'Overshirts, bombers, and utility jackets made for layering.', '', 12, true),
('b0000000-0000-0000-0000-000000000013', 'Shorts', 'shorts', 'Casual terry and tailored walking shorts for warm days.', '', 13, true),
('b0000000-0000-0000-0000-000000000014', 'New Arrivals', 'new-arrivals', 'Fresh drops straight from our cutting-edge design workshop.', '', 14, true),
('b0000000-0000-0000-0000-000000000015', 'Offers', 'offers', 'Curated limited-edition styles with exclusive celebratory discounts.', '', 15, true)
ON CONFLICT (id) DO NOTHING;

-- NOTE: Products, variants, and banners are left EMPTY.
-- Admin can add everything through the Admin Dashboard (/admin/products/new).
