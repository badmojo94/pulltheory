import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("tpt_cart") || "[]");
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("tpt_cart", JSON.stringify(items));
  }, [items]);

  const add = useCallback((p, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex) return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...prev, { id: p.id, name: p.name, price: p.price, image: p.image, language: p.language, is_preorder: p.is_preorder, quantity: qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const setQty = useCallback((id, qty) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))), []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const hasPreorder = items.some((i) => i.is_preorder);

  const value = useMemo(
    () => ({ items, open, setOpen, add, remove, setQty, clear, count, subtotal, hasPreorder }),
    [items, open, add, remove, setQty, clear, count, subtotal, hasPreorder]
  );

  return (
    <CartCtx.Provider value={value}>
      {children}
    </CartCtx.Provider>
  );
};
