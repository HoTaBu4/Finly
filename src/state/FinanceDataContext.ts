import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { HISTORY_ITEMS, INITIAL_CATEGORIES } from '../screens/HomeScreen.constants';
import { CategoryItem, HistoryTransaction } from '../types';
import { mmkvStorage } from './mmkv';

type FinanceDataState = {
  categories: CategoryItem[];
  addCategory: (category: CategoryItem) => void;
  updateCategory: (updated: CategoryItem) => void;
  deleteCategory: (id: string) => void;

  historyItems: HistoryTransaction[];
  addTransaction: (transaction: HistoryTransaction) => void;
  updateTransaction: (updated: HistoryTransaction) => void;
  deleteTransaction: (id: string) => void;
};

export const useFinanceData = create<FinanceDataState>()(
  persist(
    (set) => ({
      categories: INITIAL_CATEGORIES,

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      updateCategory: (updated) =>
        set((state) => ({
          categories: state.categories.map((item) =>
            item.id === updated.id ? updated : item
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((item) => item.id !== id),
        })),

      historyItems: HISTORY_ITEMS,

      addTransaction: (transaction) =>
        set((state) => ({
          historyItems: [transaction, ...state.historyItems],
        })),

      updateTransaction: (updated) =>
        set((state) => ({
          historyItems: state.historyItems.map((item) =>
            item.id === updated.id ? updated : item
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          historyItems: state.historyItems.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'finance-data',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        categories: state.categories,
        historyItems: state.historyItems,
      }),
    }
  )
);
