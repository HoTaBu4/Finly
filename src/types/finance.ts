export type TransactionType = 'income' | 'expense';
export type HistoryTransactionFilter = TransactionType | 'all';

export type HistoryTransaction = {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
};


export enum CategoryIconKey {
  Food = 'food',
  Groceries = 'groceries',
  Cafe = 'cafe',
  Restaurant = 'restaurant',
  Transport = 'transport',
  Taxi = 'taxi',
  Fuel = 'fuel',
  Gas = 'gas',
  Shopping = 'shopping',
  Clothes = 'clothes',
  Market = 'market',
  Health = 'health',
  Medicine = 'medicine',
  Pharmacy = 'pharmacy',
  Doctor = 'doctor',
  Bills = 'bills',
  Utilities = 'utilities',
  Rent = 'rent',
  Internet = 'internet',
  Salary = 'salary',
  Freelance = 'freelance',
  Income = 'income',
  Other = 'other',
}


export type CategoryItem = {
  id: string;
  category: string;
  type: TransactionType;
  limit: number | null;
  icon: CategoryIconKey;
};

export type CategoryChartItem = CategoryItem & {
  amount: number;
};
