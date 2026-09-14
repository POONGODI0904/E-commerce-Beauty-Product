import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { success, info } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const local = localStorage.getItem('elora_wishlist');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // Sync wishlist from user profile when logged in
  useEffect(() => {
    if (user && user.wishlist) {
      setWishlist(user.wishlist);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('elora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === (productId._id || productId));
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;
    const exists = isInWishlist(productId);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
      info(`Removed "${product.name || 'item'}" from your wishlist.`);
    } else {
      setWishlist((prev) => [...prev, product]);
      success(`Saved "${product.name || 'item'}" to your wishlist!`);
    }

    if (user) {
      try {
        const { data } = await api.post('/auth/wishlist/toggle', { productId });
        setWishlist(data);
      } catch (err) {
        console.warn('Wishlist backend sync issue:', err.message);
      }
    }
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        moveToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
