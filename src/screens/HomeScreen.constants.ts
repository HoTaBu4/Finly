import { CategoryIconKey, CategoryItem, HistoryTransaction, TransactionType } from '../types';

function toIsoDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

const NOW = new Date().toISOString();

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: '1',
    category: 'Food',
    type: TransactionType.Expense,
    limit: 1500,
    icon: CategoryIconKey.Restaurant,
    updatedAt: NOW,
  },
  {
    id: '2',
    category: 'Transport',
    type: TransactionType.Expense,
    limit: null,
    icon: CategoryIconKey.Car,
    updatedAt: NOW,
  },
  {
    id: '3',
    category: 'Shopping',
    type: TransactionType.Expense,
    limit: 4000,
    icon: CategoryIconKey.BagHandle,
    updatedAt: NOW,
  },
  {
    id: '4',
    category: 'Health',
    type: TransactionType.Expense,
    limit: null,
    icon: CategoryIconKey.Medkit,
    updatedAt: NOW,
  },
  {
    id: '5',
    category: 'Bills',
    type: TransactionType.Expense,
    limit: 3000,
    icon: CategoryIconKey.Receipt,
    updatedAt: NOW,
  },
  {
    id: '6',
    category: 'Other',
    type: TransactionType.Expense,
    limit: null,
    icon: CategoryIconKey.EllipsisHorizontal,
    updatedAt: NOW,
  },
  {
    id: '8',
    category: 'Salary',
    type: TransactionType.Income,
    limit: null,
    icon: CategoryIconKey.Receipt,
    updatedAt: NOW,
  },
];

export const HISTORY_ITEMS: HistoryTransaction[] = [
  {
    id: '1',
    amount: 620,
    type: TransactionType.Expense,
    categoryId: '6',
    date: toIsoDaysAgo(1),
    updatedAt: NOW,
  },
  {
    id: '2',
    amount: 900,
    type: TransactionType.Expense,
    categoryId: '2',
    date: toIsoDaysAgo(1),
    updatedAt: NOW,
  },
  {
    id: '33',
    amount: 2500,
    type: TransactionType.Income,
    categoryId: '8',
    date: toIsoDaysAgo(3),
    updatedAt: NOW,
  },
  {
    id: '353',
    amount: 2500,
    type: TransactionType.Expense,
    categoryId: '6',
    date: toIsoDaysAgo(3),
    updatedAt: NOW,
  },
  {
    id: '3',
    amount: 2500,
    type: TransactionType.Income,
    categoryId: '8',
    date: toIsoDaysAgo(10),
    updatedAt: NOW,
  },
  {
    id: '4',
    amount: 1200,
    type: TransactionType.Expense,
    categoryId: '3',
    date: toIsoDaysAgo(12),
    updatedAt: NOW,
  },
  {
    id: '5',
    amount: 4000,
    type: TransactionType.Income,
    categoryId: '8',
    date: toIsoDaysAgo(20),
    updatedAt: NOW,
  },
  {
    id: '6',
    amount: 750,
    type: TransactionType.Expense,
    categoryId: '6',
    date: toIsoDaysAgo(24),
    updatedAt: NOW,
  },
  {
    id: '7',
    amount: 1100,
    type: TransactionType.Expense,
    categoryId: '5',
    date: toIsoDaysAgo(30),
    updatedAt: NOW,
  },
  {
    id: '8',
    amount: 1100,
    type: TransactionType.Expense,
    categoryId: '5',
    date: toIsoDaysAgo(60),
    updatedAt: NOW,
  },
  {
    id: '9',
    amount: 1100,
    type: TransactionType.Expense,
    categoryId: '5',
    date: toIsoDaysAgo(90),
    updatedAt: NOW,
  },
];
