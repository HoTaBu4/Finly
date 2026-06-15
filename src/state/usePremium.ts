import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv';
import { checkPremiumStatus } from '../services/revenueCat';

type PremiumState = {
  isPremium: boolean;
  setPremium: (value: boolean) => void;
  syncPremiumStatus: () => Promise<void>;
};

export const usePremium = create<PremiumState>()(
  persist(
    (set) => ({
      isPremium: false,

      setPremium: (value) => set({ isPremium: value }),

      syncPremiumStatus: async () => {
        const isPremium = await checkPremiumStatus();
        set({ isPremium });
      },
    }),
    {
      name: 'premium-status',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ isPremium: state.isPremium }),
    }
  )
);

export const FREE_LIMITS = {
  maxExpenseCategories: 2,
  maxIncomeCategories: 1,
};
