import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const local = localStorage.getItem('elora_cart');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const local = localStorage.getItem('elora_coupon');
      return local ? JSON.parse(local) : null;
    } catch {
      return null;
    }
  });

  const { success, error: toastError, info } = useToast();

  useEffect(() => {
    localStorage.setItem('elora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('elora_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('elora_coupon');
    }
  }, [coupon]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === (product._id || product.product));
      const effectivePrice = product.discount > 0
        ? Number((product.price * (1 - product.discount / 100)).toFixed(2))
        : Number(product.price);

      if (existItem) {
        const newQty = Math.min(product.stock || 99, existItem.qty + qty);
        return prevItems.map((x) =>
          x.product === existItem.product ? { ...x, qty: newQty } : x
        );
      } else {
        const newItem = {
          product: product._id || product.product,
          name: product.name,
          image: Array.isArray(product.images) ? product.images[0] : (product.image || ''),
          price: product.price,
          discountPrice: effectivePrice,
          discount: product.discount || 0,
          stock: product.stock,
          category: product.category,
          brand: product.brand,
          qty
        };
        return [...prevItems, newItem];
      }
    });

    success(`"${product.name}" added to bag!`);
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product === productId ? { ...item, qty: Math.min(item.stock || 99, qty) } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find((x) => x.product === productId);
    setCartItems((prev) => prev.filter((x) => x.product !== productId));
    if (item) {
      info(`Removed "${item.name}" from your bag.`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const subtotal = Number(
    cartItems.reduce((acc, item) => acc + item.discountPrice * item.qty, 0).toFixed(2)
  );

  const freeShippingThreshold = 50.0;
  const shippingPrice = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 9.95;

  let discountAmount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountType === 'percentage') {
      discountAmount = Number(((subtotal * coupon.discountRate) / 100).toFixed(2));
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discount, subtotal);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxPrice = Number((taxableAmount * 0.08).toFixed(2));
  const totalPrice = Number((taxableAmount + shippingPrice + taxPrice).toFixed(2));

  const applyCoupon = async (code) => {
    try {
      const { data } = await api.post('/coupons/validate', {
        code,
        orderAmount: subtotal
      });
      setCoupon(data);
      success(data.message || `Code ${code.toUpperCase()} applied!`);
      return data;
    } catch (err) {
      toastError(err.message || 'Invalid coupon code');
      throw err;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    info('Promotional coupon removed.');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        subtotal,
        freeShippingThreshold,
        shippingPrice,
        taxPrice,
        discountAmount,
        totalPrice,
        coupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
