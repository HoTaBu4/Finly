export type TransactionType = 'income' | 'expense';
export type HistoryTransactionFilter = TransactionType | 'all';

export type HistoryTransaction = {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};

export enum CategoryChartIcon {
  Restaurant = 'restaurant',
  Car = 'car',
  BagHandle = 'bag-handle',
  Medkit = 'medkit',
  Receipt = 'receipt',
  EllipsisHorizontal = 'ellipsis-horizontal',
}

export type CategoryChartItem = {
  id: string;
  category: string;
  limit: number | null;
  amount: number;
  icon: CategoryChartIcon;
};
