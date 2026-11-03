import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  size: string;
  color: string;
  price: number;
  image: string;
  quantity: number;
  weightGrams?: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotalWeightGrams: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.variantId === newItem.variantId
          );

          const quantityToAdd = newItem.quantity || 1;

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantityToAdd;
            return { items: updatedItems, isOpen: true };
          }

          return {
            items: [...state.items, { ...newItem, quantity: quantityToAdd }],
            isOpen: true,
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.variantId !== variantId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.variantId === variantId ? { ...i, quantity } : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalWeightGrams: () => {
        return get().items.reduce(
          (total, item) => total + (item.weightGrams || 0) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'sportify-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
