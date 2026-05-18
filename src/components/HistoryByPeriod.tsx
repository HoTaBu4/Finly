import { useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { colors } from '../theme/colors';
import {
  CategoryItem,
  HistoryTransaction,
  HistoryTransactionFilter,
} from '../types';

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

type TransactionRowProps = {
  rowKey: string;
  item: HistoryTransaction;
  categoryLabel: string;
  onEdit?: (transaction: HistoryTransaction) => void;
  onDelete?: (transaction: HistoryTransaction) => void;
  onOpen?: (rowKey: string, closeRow: () => void) => void;
  onClose?: (rowKey: string) => void;
};

function TransactionRow({
  rowKey,
  item,
  categoryLabel,
  onEdit,
  onDelete,
  onOpen,
  onClose,
}: TransactionRowProps) {
  const swipeableRef = useRef<Swipeable | null>(null);
  const hasActions = Boolean(onEdit || onDelete);

  function closeSwipe() {
    swipeableRef.current?.close();
  }

  function handleEditPress() {
    closeSwipe();
    onEdit?.(item);
  }

  function handleDeletePress() {
    closeSwipe();
    onDelete?.(item);
  }

  const rowContent = (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.categoryText}>{categoryLabel}</Text>
        <Text style={styles.dateText}>{formatTransactionDate(item.date)}</Text>
      </View>
      <Text
        style={[
          styles.amountText,
          item.type === 'income' ? styles.incomeText : styles.expenseText,
        ]}
      >
        {item.type === 'income' ? '+' : '-'}
        {formatMoney(Math.abs(item.amount))}
      </Text>
    </View>
  );

  if (!hasActions) {
    return rowContent;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={styles.rowSwipeContainer}
      renderRightActions={() => (
        <View style={styles.rowActions}>
          {onEdit ? (
            <Pressable style={styles.editAction} onPress={handleEditPress}>
              <Text style={[styles.actionText, styles.editActionText]}>Edit</Text>
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable style={styles.deleteAction} onPress={handleDeletePress}>
              <Text style={[styles.actionText, styles.deleteActionText]}>Delete</Text>
            </Pressable>
          ) : null}
        </View>
      )}
      overshootRight={false}
      friction={2}
      rightThreshold={28}
      onSwipeableWillOpen={() => onOpen?.(rowKey, closeSwipe)}
      onSwipeableWillClose={() => onClose?.(rowKey)}
    >
      {rowContent}
    </Swipeable>
  );
}

function formatMoney(value: number) {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} $`;
}

function sortByDateDesc(items: HistoryTransaction[]) {
  return [...items].sort((first, second) => {
    const firstTime = new Date(first.date).getTime();
    const secondTime = new Date(second.date).getTime();
    return secondTime - firstTime;
  });
}

function formatTransactionDate(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatMonthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(new Date(year, month, 1));
}

export function HistoryByPeriod({
  transactions,
  categories,
  title = 'History',
  transactionTypeFilter = 'expense',
  categoryIdFilter = null,
  selectedCategory = null,
  onActionPress,
  onTransactionEdit,
  onTransactionDelete,
}: HistoryByPeriodProps) {
  const historyTitle = selectedCategory
    ? `History: ${selectedCategory.category}`
    : title;
  const historyActionLabel = selectedCategory
    ? selectedCategory.limit != null
      ? 'Edit limit'
      : 'Add limit'
    : undefined;

  const normalizedCategoryIdFilter = categoryIdFilter?.trim() ?? null;
  const categoryNamesById = useMemo(
    () => new Map(categories.map((item) => [item.id, item.category])),
    [categories]
  );

  const sections = useMemo<PeriodSection[]>(() => {
    const filteredTransactions = transactions.filter((transaction) => {
      const matchesType =
        transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter;
      if (!matchesType) {
        return false;
      }

      if (!normalizedCategoryIdFilter) {
        return true;
      }

      return transaction.categoryId === normalizedCategoryIdFilter;
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
        label: formatMonthLabel(year, month),
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

  const hasAnyTransactions = sections.some((section) => section.items.length > 0);
  const openRowKeyRef = useRef<string | null>(null);
  const closeOpenRowRef = useRef<(() => void) | null>(null);

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
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{historyTitle}</Text>
        {historyActionLabel && onActionPress ? (
          <Pressable style={styles.limitButton} onPress={onActionPress}>
            <Text style={styles.limitButtonText}>{historyActionLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      {!hasAnyTransactions ? (
        <Text style={styles.emptyState}>No transactions found</Text>
      ) : (
        sections.map((section) => (
          <View key={section.key} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.label}</Text>
              {section.year ? (
                <Text style={styles.sectionYear}>{section.year}</Text>
              ) : null}
            </View>

            {section.items.map((item) => (
              // Keep row key stable across sections so only one swipe stays open.
              <TransactionRow
                key={`${section.key}-${item.id}`}
                rowKey={`${section.key}-${item.id}`}
                item={item}
                categoryLabel={categoryNamesById.get(item.categoryId) ?? 'Unknown'}
                onEdit={onTransactionEdit}
                onDelete={onTransactionDelete}
                onOpen={handleRowOpen}
                onClose={handleRowClose}
              />
            ))}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: 10,
    backgroundColor: colors.appBackground,
  },
  rowSwipeContainer: {
    overflow: 'hidden',
    backgroundColor: colors.appBackground,
  },
  rowActions: {
    flexDirection: 'row',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingLeft: 8,
    backgroundColor: colors.appBackground,
  },
  editAction: {
    width: 56,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPrimarySoft,
  },
  deleteAction: {
    width: 62,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  editActionText: {
    color: colors.accentPrimary,
  },
  deleteActionText: {
    color: colors.orange,
  },
  rowLeft: {
    gap: 2,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  expenseText: {
    color: colors.orange,
  },
  incomeText: {
    color: colors.green,
  },
});
