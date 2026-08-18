import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  sku: string;
  nameHu: string;
  priceHuf: number;
  imageUrl?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalHuf: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) =>
        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }),
      clear: () => set({ items: [] }),
      totalHuf: () => get().items.reduce((sum, i) => sum + i.priceHuf * i.quantity, 0),
    }),
    { name: "cherries-cart" }
  )
);
