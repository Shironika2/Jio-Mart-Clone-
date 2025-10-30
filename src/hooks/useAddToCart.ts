import { useState, useCallback, useEffect } from "react";
import type { Product, CartItem } from "../types";

const CART_STORAGE_KEY = "cartItems";

export const useAddToCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ Load cart items from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCartItems(JSON.parse(stored));
    } catch (error) {
      console.error("Failed to parse stored cart items:", error);
     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));

    }
  }, []);

  // ✅ Unified function to update state + localStorage + notify
  const updateCartAndStorage = useCallback((newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  // ✅ Add to cart (robust and race-condition free)
  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      let currentCart: CartItem[] = stored ? JSON.parse(stored) : [];

      const existingIndex = currentCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex > -1) {
        // Update quantity for existing product
        currentCart[existingIndex].quantity =
          (currentCart[existingIndex].quantity || 0) + quantity;
      } else {
        // Add new product
        currentCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category,
          quantity,
          rating: product.rating,
        });
      }

      // Update state + storage together
      updateCartAndStorage(currentCart);

      // Alert outside of setState (no blocking)
      window.alert(`${product.title} added to cart!`);
    },
    [updateCartAndStorage]
  );

  // ✅ Remove from cart
  const removeFromCart = useCallback(
    (productId: number) => {
      const newCart = cartItems.filter((item) => item.id !== productId);
      updateCartAndStorage(newCart);
    },
    [cartItems, updateCartAndStorage]
  );

  // ✅ Clear entire cart
  const clearCart = useCallback(() => {
    updateCartAndStorage([]);
  }, [updateCartAndStorage]);

  return { cartItems, addToCart, removeFromCart, clearCart };
};
