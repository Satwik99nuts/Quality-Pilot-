"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

type Product = {
  id: number;
  name: string;
  price: number;
};

type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        setItems([]);
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get("/cart/");
        setItems(response.data.items || []);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await api.post("/cart/items", { product_id: productId, quantity });
      // Refresh cart
      const response = await api.get("/cart/");
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Error adding to cart", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await api.put(`/cart/items/${itemId}`, { quantity });
      setItems(items.map(item => item.id === itemId ? { ...item, quantity } : item));
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isLoading 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
