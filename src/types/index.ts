export type OrderStatus =
  | 'Pending'
  | 'WhatsApp Contacted'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus =
  | 'Not Required'
  | 'Pending'
  | 'Paid'
  | 'Refunded';

export type OrderSource = 'WhatsApp' | 'Website' | 'Admin';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id?: string;
  size: string;
  color: string;
  sku?: string;
  price?: number;
  stock: number;
  is_available: boolean;
}

export interface ProductImage {
  id: string;
  product_id?: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id: string;
  category_name?: string;
  subcategory?: string;
  price: number;
  original_price: number;
  discount_price?: number;
  discount_percent: number;
  sku: string;
  brand: string;
  available_sizes: string[];
  available_colors: string[];
  stock_quantity: number;
  low_stock_threshold: number;
  images: string[];
  thumbnail: string;
  featured_image?: string;
  material?: string;
  fabric: string;
  fit: string;
  pattern?: string;
  gender: string;
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_trending: boolean;
  is_new_arrival: boolean;
  is_offer: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
}

export interface CartItem {
  id: string; // generated unique key: productId_size_color
  product_id: string;
  product: Product;
  selected_size: string;
  selected_color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  alternative_phone?: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  notes?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  order_source: OrderSource;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  size: string;
  color: string;
  unit_price: number;
  total_price: number;
  image_url?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  type: 'hero' | 'promo' | 'announcement';
  created_at?: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  tagline: string;
  logo_url: string;
  whatsapp_number: string;
  phone_primary: string;
  phone_secondary: string;
  instagram_handle: string;
  address_line1: string;
  address_line2: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  email: string;
  about_text: string;
  currency_symbol: string;
  announcement_text: string;
  is_announcement_active: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_image_url: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  full_name: string;
  created_at?: string;
}

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity: string;
  entity_id: string;
  details?: Record<string, unknown>;
  created_at: string;
}
