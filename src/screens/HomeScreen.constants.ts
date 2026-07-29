import { CategoryIconKey, CategoryItem, HistoryTransaction, TransactionType } from '../types';

function toIsoDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

const NOW = new Date().toISOString();

export const OTHER_EXPENSE_CATEGORY_ID = '__other_expense__';

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
  // {
  //   id: '3',
  //   category: 'Shopping',
  //   type: TransactionType.Expense,
  //   limit: 4000,
  //   icon: CategoryIconKey.BagHandle,
  //   updatedAt: NOW,
  // },
  // {
  //   id: '4',
  //   category: 'Health',
  //   type: TransactionType.Expense,
  //   limit: null,
  //   icon: CategoryIconKey.Medkit,
  //   updatedAt: NOW,
  // },
  // {
  //   id: '5',
  //   category: 'Bills',
  //   type: TransactionType.Expense,
  //   limit: 3000,
  //   icon: CategoryIconKey.Receipt,
  //   updatedAt: NOW,
  // },
  // {
  //   id: '6',
  //   category: 'Other',
  //   type: TransactionType.Expense,
  //   limit: null,
  //   icon: CategoryIconKey.EllipsisHorizontal,
  //   updatedAt: NOW,
  // },
  {
    id: '8',
    category: 'Salary',
    type: TransactionType.Income,
    limit: null,
    icon: CategoryIconKey.Receipt,
    updatedAt: NOW,
  },
  {
    id: '__other_expense__',
    category: 'Other',
    type: TransactionType.Expense,
    limit: null,
    icon: CategoryIconKey.EllipsisHorizontal,
    updatedAt: NOW,
    isSystem: true,
  },
];

export const HISTORY_ITEMS: HistoryTransaction[] = [
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
    id: '3',
    amount: 2500,
    type: TransactionType.Income,
    categoryId: '8',
    date: toIsoDaysAgo(10),
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
];
