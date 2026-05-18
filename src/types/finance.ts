export type TransactionType = 'income' | 'expense';
export type HistoryTransactionFilter = TransactionType | 'all';

export type HistoryTransaction = {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
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

export type CategoryItem = {
  id: string;
  category: string;
  type: TransactionType;
  limit: number | null;
  icon: CategoryChartIcon;
};

export type CategoryChartItem = CategoryItem & {
  amount: number;
};
