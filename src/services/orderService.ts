import { Order, OrderItem, StoreSettings } from '@/types';
import { createNewOrder } from '@/lib/supabase/data-service';

export interface PlaceOrderInput {
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
  items: Array<{
    product_id: string;
    product_name: string;
    sku: string;
    quantity: number;
    size: string;
    color: string;
    unit_price: number;
    total_price: number;
    image_url?: string;
  }>;
}

export interface OrderServiceResult {
  success: boolean;
  order?: Order;
  whatsappUrl?: string;
  error?: string;
}

/**
 * Formats order details into a clean, professional WhatsApp message
 */
export function formatWhatsAppOrderMessage(
  order: Order,
  items: OrderItem[],
  settings?: StoreSettings
): string {
  const storeName = settings?.store_name || "Men's Territory";
  const currency = settings?.currency_symbol || '₹';

  let itemsText = '';
  items.forEach((item, index) => {
    itemsText += `\n${index + 1}. *${item.product_name}*\n`;
    if (item.size) itemsText += `   Size: ${item.size}\n`;
    if (item.color) itemsText += `   Color: ${item.color}\n`;
    itemsText += `   Qty: ${item.quantity}\n`;
    itemsText += `   Price: ${currency}${item.unit_price.toLocaleString('en-IN')}\n`;
  });

  const notesText = order.notes && order.notes.trim() ? `\n*Customer Note:*\n${order.notes.trim()}\n` : '';
  const altPhoneText = order.alternative_phone ? `   Alt Phone: ${order.alternative_phone}\n` : '';

  return `*${storeName.toUpperCase()} - NEW ORDER*

Order ID: *${order.order_number}*

*CUSTOMER DETAILS:*
   Name: ${order.customer_name}
   Phone: ${order.phone}
${altPhoneText}
*ORDER ITEMS:*
${itemsText}
*PRICE BREAKDOWN:*
   Subtotal: ${currency}${order.subtotal.toLocaleString('en-IN')}
   Discount: ${currency}${order.discount.toLocaleString('en-IN')}
   *Total Amount: ${currency}${order.total.toLocaleString('en-IN')}*

*DELIVERY ADDRESS:*
   ${order.address}
   City: ${order.city}
   District: ${order.district}
   State: ${order.state}
   PIN Code: ${order.pincode}
${notesText}
Please confirm my order and share estimated dispatch details.

Thank you,
${order.customer_name}`;
}

/**
 * Generates direct WhatsApp URL with phone number and prefilled text
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  // Strip all non-numeric characters
  let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  // If Indian number without country code (10 digits), prepend 91
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Primary Order Service facade
 * Saves order to Supabase / persistent database first, then generates the WhatsApp checkout URL
 */
export async function processWhatsAppOrder(
  input: PlaceOrderInput,
  settings: StoreSettings
): Promise<OrderServiceResult> {
  try {
    // 1. Create order record in database / fallback
    const savedOrder = await createNewOrder(
      {
        customer_name: input.customer_name.trim(),
        phone: input.phone.trim(),
        alternative_phone: input.alternative_phone?.trim() || '',
        email: input.email?.trim() || '',
        address: input.address.trim(),
        city: input.city.trim(),
        district: input.district.trim(),
        state: input.state.trim(),
        pincode: input.pincode.trim(),
        notes: input.notes?.trim() || '',
        subtotal: input.subtotal,
        discount: input.discount,
        total: input.total,
        status: 'Pending',
        payment_status: 'Not Required',
        order_source: 'WhatsApp',
      },
      input.items
    );

    // 2. Build WhatsApp message and link
    const targetPhone = settings.whatsapp_number || '7815858973';
    const message = formatWhatsAppOrderMessage(
      savedOrder,
      savedOrder.items || (input.items as OrderItem[]),
      settings
    );
    const whatsappUrl = generateWhatsAppUrl(targetPhone, message);

    return {
      success: true,
      order: savedOrder,
      whatsappUrl,
    };
  } catch (err) {
    console.error('Order processing failed:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown order processing error',
    };
  }
}

/**
 * Future Extension: placeholder for online payment order service
 */
export async function processOnlinePaymentOrder(input: PlaceOrderInput): Promise<OrderServiceResult> {
  // Ready for Razorpay / Stripe integration in V2
  throw new Error('Online payment gateway integration scheduled for V2.');
}
