import { create } from "zustand";

type CartDrawerState = {
  isOpen: boolean;
  badgePulse: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  pulseBadge: () => void;
};

export const useCartDrawerStore = create<CartDrawerState>((set) => ({
  isOpen: false,
  badgePulse: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  pulseBadge: () => {
    set({ badgePulse: true });
    window.setTimeout(() => set({ badgePulse: false }), 600);
  }
}));
