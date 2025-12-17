import { create } from "zustand";

export const useStore = create((set) => ({
  clicks: 0,
  increment: (points) => set((state) => ({ clicks: state.clicks + points })),  
}));
