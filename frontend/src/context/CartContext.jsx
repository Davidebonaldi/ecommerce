import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });

  const refresh = useCallback(async () => {
    if (!token) return setCart({ items: [], total: 0 });
    try {
      setCart(await api("/cart", { token }));
    } catch {
      setCart({ items: [], total: 0 });
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (productId, quantity = 1) =>
    setCart(await api("/cart", { method: "POST", body: { product_id: productId, quantity }, token }));

  const updateItem = async (itemId, quantity) =>
    setCart(await api(`/cart/${itemId}`, { method: "PUT", body: { quantity }, token }));

  const removeItem = async (itemId) =>
    setCart(await api(`/cart/${itemId}`, { method: "DELETE", token }));

  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, count, refresh, addToCart, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);