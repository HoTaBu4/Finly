import { SetStateAction } from 'react';
import { create } from 'zustand';
import { HISTORY_ITEMS, INITIAL_CATEGORIES } from '../screens/HomeScreen.constants';
import { CategoryItem, HistoryTransaction } from '../types';

type FinanceDataState = {
  categories: CategoryItem[];
  setCategories: (value: SetStateAction<CategoryItem[]>) => void;
  historyItems: HistoryTransaction[];
  setHistoryItems: (value: SetStateAction<HistoryTransaction[]>) => void;
};

function resolveStateValue<T>(current: T, value: SetStateAction<T>) {
  if (typeof value === 'function') {
    return (value as (previous: T) => T)(current);
  }

  return value;
}

export const useFinanceData = create<FinanceDataState>((set) => ({
  categories: INITIAL_CATEGORIES,
  setCategories: (value) =>
    set((state) => ({
      categories: resolveStateValue(state.categories, value),
    })),
  historyItems: HISTORY_ITEMS,
  setHistoryItems: (value) =>
    set((state) => ({
      historyItems: resolveStateValue(state.historyItems, value),
    })),
}));
