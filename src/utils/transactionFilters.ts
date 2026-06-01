import { HistoryTransactionFilter, TransactionType } from '../types';

export function toTransactionType(
  filter: HistoryTransactionFilter
): TransactionType | null {
  return filter === HistoryTransactionFilter.All
    ? null
    : filter === HistoryTransactionFilter.Expense
      ? TransactionType.Expense
      : TransactionType.Income;
}
