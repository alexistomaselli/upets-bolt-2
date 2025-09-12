import { useState, useEffect } from 'react';
import { Cart, CartItem, Product } from '../types/product';
import { WooCommerceAPI } from '../services/woocommerce';

// Estado global del carrito para reactividad
let globalCart: Cart = {
  items: [],
  item_count: 0,
  total: 0,
  subtotal: 0,
  shipping_total: 0,
  tax_total: 0
};

const cartListeners: Set<(cart: Cart) => void> = new Set();

const notifyCartChange = (newCart: Cart) => {
  globalCart = newCart;
  cartListeners.forEach(listener => listener(newCart));
};

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => {
    const storedCart = WooCommerceAPI.getCartFromStorage();
    globalCart = storedCart;
    return storedCart;
  });

  useEffect(() => {
    // Suscribirse a cambios del carrito
    cartListeners.add(setCart);
    
    // Cleanup
    return () => {
      cartListeners.delete(setCart);
    };
  }, []);

  const addToCart = async (product: Product, quantity: number = 1, variation?: any) => {
    const currentCart = globalCart;
    const existingItemIndex = currentCart.items.findIndex(
      item => item.id === product.id && 
      JSON.stringify(item.variation) === JSON.stringify(variation)
    );

    let newItems = [...currentCart.items];

    if (existingItemIndex >= 0) {
      newItems[existingItemIndex].quantity += quantity;
      newItems[existingItemIndex].line_total = 
        newItems[existingItemIndex].quantity * newItems[existingItemIndex].price;
    } else {
      const newItem: CartItem = {
        key: `${product.id}-${Date.now()}`,
        id: product.id,
        quantity,
        name: product.name,
        price: parseFloat(product.price),
        line_total: parseFloat(product.price) * quantity,
        variation,
        product_data: product,
      };
      newItems.push(newItem);
    }

    const updatedCart = await WooCommerceAPI.updateCart(newItems);
    notifyCartChange(updatedCart);
  };

  const removeFromCart = async (itemKey: string) => {
    const newItems = globalCart.items.filter(item => item.key !== itemKey);
    const updatedCart = await WooCommerceAPI.updateCart(newItems);
    notifyCartChange(updatedCart);
  };

  const updateQuantity = async (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemKey);
    }

    const newItems = globalCart.items.map(item => {
      if (item.key === itemKey) {
        return {
          ...item,
          quantity,
          line_total: item.price * quantity,
        };
      }
      return item;
    });

    const updatedCart = await WooCommerceAPI.updateCart(newItems);
    notifyCartChange(updatedCart);
  };

  const clearCart = async () => {
    const updatedCart = await WooCommerceAPI.updateCart([]);
    notifyCartChange(updatedCart);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};