'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateVariant: (itemId: string, newSize: string, newColor: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mt_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to LocalStorage on update
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart, isHydrated]);

  const addToCart = (
    product: Product,
    size: string,
    color: string,
    quantity: number = 1
  ) => {
    if (product.stock_quantity <= 0) {
      showToast('This item is currently out of stock', 'error');
      return;
    }

    const itemKey = `${product.id}_${size}_${color}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemKey);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = existing.quantity + quantity;
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          total_price: newQty * existing.unit_price,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemKey,
          product_id: product.id,
          product,
          selected_size: size,
          selected_color: color,
          quantity,
          unit_price: product.price,
          total_price: product.price * quantity,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${product.name} (${size}) to your bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const itemToRemove = prev.find((i) => i.id === itemId);
      if (itemToRemove) {
        showToast(`Removed from shopping bag`, 'info');
      }
      return prev.filter((item) => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            total_price: quantity * item.unit_price,
          };
        }
        return item;
      })
    );
  };

  const updateVariant = (itemId: string, newSize: string, newColor: string) => {
    setCart((prev) => {
      const targetIndex = prev.findIndex((i) => i.id === itemId);
      if (targetIndex === -1) return prev;

      const target = prev[targetIndex];
      const newKey = `${target.product_id}_${newSize}_${newColor}`;

      // Check if an item with new variant already exists
      const existingTargetIndex = prev.findIndex((i) => i.id === newKey && i.id !== itemId);
      if (existingTargetIndex > -1) {
        // Merge quantities
        const updated = [...prev];
        const combinedQty = updated[existingTargetIndex].quantity + target.quantity;
        updated[existingTargetIndex] = {
          ...updated[existingTargetIndex],
          quantity: combinedQty,
          total_price: combinedQty * target.unit_price,
        };
        // Remove old item
        return updated.filter((i) => i.id !== itemId);
      } else {
        // Rename key and update size & color
        const updated = [...prev];
        updated[targetIndex] = {
          ...target,
          id: newKey,
          selected_size: newSize,
          selected_color: newColor,
        };
        return updated;
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.total_price, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateVariant,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
