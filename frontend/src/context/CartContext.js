import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const { data } = await api.get('/cart');
      setCart(data || { items: [] });
    } catch (err) { setCart({ items: [] }); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, size, color) => {
    if (!user) return { success: false, message: 'Please login to add items to cart' };
    setLoading(true);
    try {
      const { data } = await api.post('/cart/add', { productId, quantity, size, color });
      setCart(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    } finally { setLoading(false); }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      const { data } = await api.put('/cart/update', { itemId, quantity });
      setCart(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/cart/remove/${itemId}`);
      setCart(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const clearCart = async () => {
    try { await api.delete('/cart/clear'); setCart({ items: [] }); }
    catch (err) { console.error(err); }
  };

  const cartCount = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((acc, i) => acc + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeItem, clearCart, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
