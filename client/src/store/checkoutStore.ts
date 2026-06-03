import { create } from "zustand";
import type { CreateOrderInput, Order } from "../types/order.types";

export type CheckoutStep = 1 | 2 | 3 | 4;

type CheckoutState = {
  step: CheckoutStep;
  address: CreateOrderInput["address"];
  paymentMethod: CreateOrderInput["paymentMethod"];
  saveAddress: boolean;
  notes: string;
  redeemLoyaltyPoints: boolean;
  jazzCashMobile: string;
  placedOrder: Order | null;
  clientSecret: string | null;
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAddress: (address: CreateOrderInput["address"]) => void;
  setPaymentMethod: (method: CreateOrderInput["paymentMethod"]) => void;
  setSaveAddress: (value: boolean) => void;
  setNotes: (notes: string) => void;
  setRedeemLoyaltyPoints: (value: boolean) => void;
  setJazzCashMobile: (value: string) => void;
  setPlacedOrder: (order: Order | null, clientSecret?: string | null) => void;
  reset: () => void;
};

const defaultAddress: CreateOrderInput["address"] = {
  label: "Home",
  street: "",
  area: "",
  city: "Lahore",
  province: "Punjab",
  postalCode: "",
  phone: ""
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  step: 1,
  address: defaultAddress,
  paymentMethod: "COD",
  saveAddress: true,
  notes: "",
  redeemLoyaltyPoints: false,
  jazzCashMobile: "",
  placedOrder: null,
  clientSecret: null,
  setStep: (step) => set({ step }),
  nextStep: () => set({ step: Math.min(4, get().step + 1) as CheckoutStep }),
  prevStep: () => set({ step: Math.max(1, get().step - 1) as CheckoutStep }),
  setAddress: (address) => set({ address }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setSaveAddress: (saveAddress) => set({ saveAddress }),
  setNotes: (notes) => set({ notes }),
  setRedeemLoyaltyPoints: (redeemLoyaltyPoints) => set({ redeemLoyaltyPoints }),
  setJazzCashMobile: (jazzCashMobile) => set({ jazzCashMobile }),
  setPlacedOrder: (placedOrder, clientSecret = null) => set({ placedOrder, clientSecret }),
  reset: () =>
    set({
      step: 1,
      address: defaultAddress,
      paymentMethod: "COD",
      saveAddress: true,
      notes: "",
      redeemLoyaltyPoints: false,
      jazzCashMobile: "",
      placedOrder: null,
      clientSecret: null
    })
}));
