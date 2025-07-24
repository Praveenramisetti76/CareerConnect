import { create } from 'zustand'

export const useAppStore = create((set) => ({
  isLoading: false,

  setLoading: (loading) => set({ isLoading: loading }),
}))