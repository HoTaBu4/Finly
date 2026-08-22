import { useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { translations } from '../../translations';
import { formatMonth } from '../../utils/formatters';
import { toTransactionType } from '../../utils/transactionFilters';
import { useResponsive } from '../../hooks/useResponsive';
import {
  CategoryItem,
  HistoryTransaction,
  HistoryTransactionFilter,
  TransactionType,
} from '../../types';
import { TransactionRow } from './HIstoryByPeriod';

type PeriodSection = {
  key: string;
  label: string;
  items: HistoryTransaction[];
  year?: number;
  month?: number;
};

type HistoryByPeriodProps = {
  transactions: HistoryTransaction[];
  categories: CategoryItem[];
  title?: string;
  transactionTypeFilter?: HistoryTransactionFilter;
  categoryIdFilter?: string | null;
  selectedCategory?: CategoryItem | null;
  onActionPress?: () => void;
  onTransactionEdit?: (transaction: HistoryTransaction) => void;
  onTransactionDelete?: (transaction: HistoryTransaction) => void;
};

function sortByDateDesc(items: HistoryTransaction[]) {
  return [...items].sort((first, second) => {
    const firstTime = new Date(first.date).getTime();
    const secondTime = new Date(second.date).getTime();
    return secondTime - firstTime;
  });
}

export function HistoryByPeriod({
  transactions,
  categories,
  title = translations.history.title,
  transactionTypeFilter = HistoryTransactionFilter.Expense,
  categoryIdFilter = null,
  selectedCategory = null,
  onActionPress,
  onTransactionEdit,
  onTransactionDelete,
}: HistoryByPeriodProps) {
  const { sp } = useResponsive();
  const historyTitle = selectedCategory
    ? translations.history.categoryTitle(selectedCategory.category)
    : title;
  const canEditLimit = selectedCategory?.type === TransactionType.Expense;
  const historyActionLabel =
    selectedCategory && canEditLimit
      ? selectedCategory.limit != null
        ? translations.history.editLimit
        : translations.history.addLimit
      : undefined;

  const normalizedCategoryIdFilter = categoryIdFilter?.trim() ?? null;
  const categoryNamesById = useMemo(
    () => new Map(categories.map((item) => [item.id, item.category])),
    [categories]
  );

  const sections = useMemo<PeriodSection[]>(() => {
    const filteredTransactionType = toTransactionType(transactionTypeFilter);

    const filteredTransactions = transactions.filter((transaction) => {
      const matchesType =
        filteredTransactionType === null ||
        transaction.type === filteredTransactionType;
      const matchesCategory =
        !normalizedCategoryIdFilter || transaction.categoryId === normalizedCategoryIdFilter;
      return matchesType && matchesCategory;
    });

    const monthlyGrouped = new Map<string, PeriodSection>();
    for (const transaction of filteredTransactions) {
      const date = new Date(transaction.date);
      if (Number.isNaN(date.getTime())) {
        continue;
      }

      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;

      const existing = monthlyGrouped.get(key);
      if (existing) {
        existing.items.push(transaction);
        continue;
      }

      monthlyGrouped.set(key, {
        key,
        label: formatMonth(year, month),
        year,
        month,
        items: [transaction],
      });
    }

    return [...monthlyGrouped.values()]
      .map((section) => ({
        ...section,
        items: sortByDateDesc(section.items),
      }))
      .sort((first, second) => {
        if ((first.year ?? 0) !== (second.year ?? 0)) {
          return (second.year ?? 0) - (first.year ?? 0);
        }
        return (second.month ?? 0) - (first.month ?? 0);
      });
  }, [normalizedCategoryIdFilter, transactionTypeFilter, transactions]);

  const hasAnyTransactions = sections.length > 0;
  const openRowKeyRef = useRef<string | null>(null);
  const closeOpenRowRef = useRef<(() => void) | null>(null);

  function closeOpenedRow() {
    closeOpenRowRef.current?.();
    openRowKeyRef.current = null;
    closeOpenRowRef.current = null;
  }

  function handleRowOpen(rowKey: string, closeRow: () => void) {
    if (openRowKeyRef.current && openRowKeyRef.current !== rowKey) {
      closeOpenRowRef.current?.();
    }

    openRowKeyRef.current = rowKey;
    closeOpenRowRef.current = closeRow;
  }

  function handleRowClose(rowKey: string) {
    if (openRowKeyRef.current !== rowKey) {
      return;
    }

    openRowKeyRef.current = null;
    closeOpenRowRef.current = null;
  }

  return (
    <View style={styles.container} onTouchStart={closeOpenedRow}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { fontSize: sp(20) }]}>{historyTitle}</Text>
        {historyActionLabel && onActionPress ? (
          <Pressable style={styles.limitButton} onPress={onActionPress}>
            <Text style={styles.limitButtonText}>{historyActionLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      {!hasAnyTransactions ? (
        <Text style={styles.emptyState}>{translations.history.empty}</Text>
      ) : (
        sections.map((section) => (
          <View key={section.key} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: sp(14) }]}>{section.label}</Text>
              {section.year ? (
                <Text style={[styles.sectionYear, { fontSize: sp(12) }]}>{section.year}</Text>
              ) : null}
            </View>

            {section.items.map((item) => {
              const rowKey = `${section.key}-${item.id}`;
              return (
                <TransactionRow
                  key={rowKey}
                  rowKey={rowKey}
                  item={item}
                  categoryLabel={categoryNamesById.get(item.categoryId) ?? translations.common.unknown}
                  onEdit={onTransactionEdit}
                  onDelete={onTransactionDelete}
                  onOpen={handleRowOpen}
                  onClose={handleRowClose}
                />
              );
            })}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 48,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  limitButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accentPrimary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.accentPrimarySoft,
  },
  limitButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentPrimary,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 12,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: -12,
  },
  sectionYear: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
