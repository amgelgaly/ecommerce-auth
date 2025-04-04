"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  fetchDBCart,
  syncDBCart,
  addDBItem,
  updateDBItem,
  removeDBItem,
  clearDBCart
} from "@/app/services/cartService";

interface ProductDetails {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
  productDetails?: ProductDetails;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  isCartLoading: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { data: session, status } = useSession();

  // تهيئة السلة من localStorage أو قاعدة البيانات
  useEffect(() => {
    const initializeCart = async () => {
      let initialCart: CartItem[] = [];
      setIsCartLoading(true);

      const fetchProductDetails = async (items: CartItem[]): Promise<CartItem[]> => {
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
          try {
            const response = await fetch(`/api/products/${item.productId}`);
            if (!response.ok) {
              console.warn(`Product ${item.productId} not found or unavailable`);
              // Remove invalid products from cart
              return null;
            }
            const productDetails = await response.json();
            return { ...item, productDetails };
          } catch (error) {
            console.error(`Error fetching details for product ${item.productId}:`, error);
            // Remove products with fetch errors from cart
            return null;
          }
        }));
        // Filter out null items (products that couldn't be fetched)
        return itemsWithDetails.filter((item): item is CartItem => item !== null);
      };

      if (status === 'authenticated') {
        try {
          const { items: dbCart, error } = await fetchDBCart();
          if (error) throw new Error(error);

          const storedCartString = localStorage.getItem("cart");
          const localCart = storedCartString ? JSON.parse(storedCartString) : [];

          // دمج السلة المحلية مع سلة قاعدة البيانات
          const mergedCartMap = new Map<string, CartItem>();
          localCart.forEach((item: CartItem) => mergedCartMap.set(item.productId, item));
          dbCart.forEach((item: CartItem) => mergedCartMap.set(item.productId, item));

          initialCart = Array.from(mergedCartMap.values());
          
          // Fetch product details for all cart items
          initialCart = await fetchProductDetails(initialCart);

          if (localCart.length > 0 && dbCart.length === 0) {
            await syncDBCart(initialCart);
          }
        } catch (error) {
          console.error("Failed to fetch/sync DB cart:", error);
          toast.error("حدث خطأ أثناء تحميل عربة التسوق.");
          const storedCartString = localStorage.getItem("cart");
          initialCart = storedCartString ? JSON.parse(storedCartString) : [];
        }
      } else if (status === 'unauthenticated') {
        const storedCartString = localStorage.getItem("cart");
        initialCart = storedCartString ? JSON.parse(storedCartString) : [];
        initialCart = await fetchProductDetails(initialCart);
      }

      if (status !== 'loading') {
        setCart(initialCart);
        setIsInitialized(true);
        setIsCartLoading(false);
      }
    };

    initializeCart();
  }, [status]);

  // تحديث عدد العناصر في السلة وتخزينها في localStorage
  useEffect(() => {
    if (isInitialized && !isCartLoading && typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [cart, isInitialized, isCartLoading]);

  // إضافة منتج للسلة
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    const previousCart = [...cart];
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === productId);
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }
      return [...prevCart, { productId, quantity }];
    });

    if (session?.user) {
      setIsCartLoading(true);
      try {
        await addDBItem(productId, quantity);
      } catch (error) {
        console.error("Failed to add item to DB cart:", error);
        toast.error("فشل إضافة المنتج لعربة التسوق.");
        setCart(previousCart); // استعادة الحالة السابقة عند حدوث خطأ
      } finally {
        setIsCartLoading(false);
      }
    }
  }, [session, cart]);

  // تحديث كمية منتج في السلة
  const updateCartItemQuantity = useCallback(async (productId: string, quantity: number) => {
    const previousCart = [...cart];
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );

    if (session?.user) {
      setIsCartLoading(true);
      try {
        await updateDBItem(productId, quantity);
      } catch (error) {
        console.error("Failed to update item in DB cart:", error);
        toast.error("فشل تحديث كمية المنتج في عربة التسوق.");
        setCart(previousCart);
      } finally {
        setIsCartLoading(false);
      }
    }
  }, [session, cart]);

  // حذف منتج من السلة
  const removeFromCart = useCallback(async (productId: string) => {
    const previousCart = [...cart];
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));

    if (session?.user) {
      setIsCartLoading(true);
      try {
        await removeDBItem(productId);
      } catch (error) {
        console.error("Failed to remove item from DB cart:", error);
        toast.error("فشل حذف المنتج من عربة التسوق.");
        setCart(previousCart);
      } finally {
        setIsCartLoading(false);
      }
    }
  }, [session, cart]);

  // تفريغ السلة
  const clearCart = useCallback(async () => {
    const previousCart = [...cart];
    setCart([]);

    if (session?.user) {
      setIsCartLoading(true);
      try {
        await clearDBCart();
      } catch (error) {
        console.error("Failed to clear DB cart:", error);
        toast.error("فشل تفريغ عربة التسوق.");
        setCart(previousCart);
      } finally {
        setIsCartLoading(false);
      }
    }
  }, [session, cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isCartLoading,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};