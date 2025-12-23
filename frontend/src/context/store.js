import { create } from "zustand";

export const useStore = create((set) => ({
  clicks: 0,
  increment: (points) => set((state) => ({ clicks: state.clicks + points })),
  setClicks: (value) => set({ clicks: value }),
  resetClicks: () => set({ clicks: 0 }),
}));

// Export getState for accessing store outside of React components
export const getStoreState = () => useStore.getState();
