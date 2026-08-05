import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv';

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
        try {
          const { checkPremiumStatus } = await import('../services/revenueCat');
          const isPremium = await checkPremiumStatus();
          set({ isPremium });
        } catch {
          // RevenueCat not configured yet — keep current state
        }
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
