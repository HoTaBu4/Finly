import { ReactNode } from 'react';

export type TransactionType = 'income' | 'expense';
export type HistoryTransactionFilter = TransactionType | 'all';

export type HistoryTransaction = {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};

export type CategoryChartItem = {
  id: string;
  category: string;
  limit: number | null;
  amount: number;
  icon: ReactNode;
};
