import { CategoryIconKey, CategoryItem, HistoryTransaction } from '../types';

function toIsoDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: '1',
    category: 'Food',
    type: 'expense',
    limit: 1500,
    icon: CategoryIconKey.Restaurant,
  },
  {
    id: '2',
    category: 'Transport',
    type: 'expense',
    limit: null,
    icon: CategoryIconKey.Car,
  },
  {
    id: '3',
    category: 'Shopping',
    type: 'expense',
    limit: 4000,
    icon: CategoryIconKey.BagHandle,
  },
  {
    id: '4',
    category: 'Health',
    type: 'expense',
    limit: null,
    icon: CategoryIconKey.Medkit,
  },
  {
    id: '5',
    category: 'Bills',
    type: 'expense',
    limit: 3000,
    icon: CategoryIconKey.Receipt,
  },
  {
    id: '6',
    category: 'Other',
    type: 'expense',
    limit: null,
    icon: CategoryIconKey.EllipsisHorizontal,
  },
  {
    id: '7',
    category: 'Salary',
    type: 'income',
    limit: null,
    icon: CategoryIconKey.Receipt,
  },
];

export const HISTORY_ITEMS: HistoryTransaction[] = [
  {
    id: '1',
    amount: 620,
    type: 'expense',
    categoryId: '6',
    date: toIsoDaysAgo(1),
  },
  {
    id: '2',
    amount: 900,
    type: 'expense',
    categoryId: '2',
    date: toIsoDaysAgo(1),
  },
  {
    id: '33',
    amount: 2500,
    type: 'income',
    categoryId: '7',
    date: toIsoDaysAgo(3),
  },
  {
    id: '353',
    amount: 2500,
    type: 'expense',
    categoryId: '6',
    date: toIsoDaysAgo(3),
  },
  {
    id: '3',
    amount: 2500,
    type: 'income',
    categoryId: '7',
    date: toIsoDaysAgo(10),
  },
  {
    id: '4',
    amount: 1200,
    type: 'expense',
    categoryId: '3',
    date: toIsoDaysAgo(12),
  },
  {
    id: '5',
    amount: 4000,
    type: 'income',
    categoryId: '7',
    date: toIsoDaysAgo(20),
  },
  {
    id: '6',
    amount: 750,
    type: 'expense',
    categoryId: '6',
    date: toIsoDaysAgo(24),
  },
  {
    id: '7',
    amount: 1100,
    type: 'expense',
    categoryId: '5',
    date: toIsoDaysAgo(30),
  },
  {
    id: '8',
    amount: 1100,
    type: 'expense',
    categoryId: '5',
    date: toIsoDaysAgo(60),
  },
  {
    id: '9',
    amount: 1100,
    type: 'expense',
    categoryId: '5',
    date: toIsoDaysAgo(90),
  },
];
