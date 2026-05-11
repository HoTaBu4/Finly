import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export type TransactionType = 'income' | 'expense';
export type HistoryTransactionFilter = TransactionType | 'all';

export type HistoryTransaction = {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};

type PeriodSection = {
  key: string;
  label: string;
  items: HistoryTransaction[];
  year?: number;
  month?: number;
};

type HistoryByPeriodProps = {
  transactions: HistoryTransaction[];
  title?: string;
  transactionTypeFilter?: HistoryTransactionFilter;
};

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
  title = 'Expense History',
  transactionTypeFilter = 'expense',
}: HistoryByPeriodProps) {
  const sections = useMemo<PeriodSection[]>(() => {
    const filteredTransactions = transactions.filter((transaction) => {
      if (transactionTypeFilter === 'all') {
        return true;
      }

      return transaction.type === transactionTypeFilter;
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
  }, [transactionTypeFilter, transactions]);

  const hasAnyTransactions = sections.some((section) => section.items.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

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
              <View key={`${section.key}-${item.id}`} style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.categoryText}>{item.category}</Text>
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
