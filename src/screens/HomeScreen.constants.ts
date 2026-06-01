import { CategoryIconKey, CategoryItem, HistoryTransaction, TransactionType } from '../types';

function toIsoDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: '1',
    category: 'Food',
    type: TransactionType.Expense,
    limit: 1500,
    icon: CategoryIconKey.Restaurant,
  },
  {
    id: '2',
    category: 'Transport',
    type: TransactionType.Expense,
    limit: null,
    icon: CategoryIconKey.Car,
  },
  {
    id: '3',
    category: 'Shopping',
    type: TransactionType.Expense,
    limit: 4000,
    icon: CategoryIconKey.BagHandle,
  },
  {
    id: '4',
    category: 'Health',
    type: TransactionType.Expense,
    limit: null,
    icon: CategoryIconKey.Medkit,
  },
  {
    id: '5',
    category: 'Bills',
    type: TransactionType.Expense,
    limit: 3000,
    icon: CategoryIconKey.Receipt,
  },
  {
    id: '6',
    category: 'Other',
    type: TransactionType.Expense,
    limit: null,
    icon: CategoryIconKey.EllipsisHorizontal,
  },
  {
    id: '7',
    category: 'Salary',
    type: TransactionType.Income,
    limit: null,
    icon: CategoryIconKey.Receipt,
  },
];

export const HISTORY_ITEMS: HistoryTransaction[] = [
  {
    id: '1',
    amount: 620,
    type: TransactionType.Expense,
    categoryId: '6',
    date: toIsoDaysAgo(1),
  },
  {
    id: '2',
    amount: 900,
    type: TransactionType.Expense,
    categoryId: '2',
    date: toIsoDaysAgo(1),
  },
  {
    id: '33',
    amount: 2500,
    type: TransactionType.Income,
    categoryId: '7',
    date: toIsoDaysAgo(3),
  },
  {
    id: '353',
    amount: 2500,
    type: TransactionType.Expense,
    categoryId: '6',
    date: toIsoDaysAgo(3),
  },
  {
    id: '3',
    amount: 2500,
    type: TransactionType.Income,
    categoryId: '7',
    date: toIsoDaysAgo(10),
  },
  {
    id: '4',
    amount: 1200,
    type: TransactionType.Expense,
    categoryId: '3',
    date: toIsoDaysAgo(12),
  },
  {
    id: '5',
    amount: 4000,
    type: TransactionType.Income,
    categoryId: '7',
    date: toIsoDaysAgo(20),
  },
  {
    id: '6',
    amount: 750,
    type: TransactionType.Expense,
    categoryId: '6',
    date: toIsoDaysAgo(24),
  },
  {
    id: '7',
    amount: 1100,
    type: TransactionType.Expense,
    categoryId: '5',
    date: toIsoDaysAgo(30),
  },
  {
    id: '8',
    amount: 1100,
    type: TransactionType.Expense,
    categoryId: '5',
    date: toIsoDaysAgo(60),
  },
  {
    id: '9',
    amount: 1100,
    type: TransactionType.Expense,
    categoryId: '5',
    date: toIsoDaysAgo(90),
  },
];
