import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBarChart } from '../components/CategoryBarChart/CategoryBarChart';
import { HistoryByPeriod } from '../components/HistoryByPeriod';
import { TopBalanceSection } from '../components/TopBalanceSection';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { CategoryChartItem, HistoryTransaction } from '../types';

function toIsoDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryChartItem | null>(null);

  //too: move this to aync request
  const chartItems: CategoryChartItem[] = [
    {
      id: 'food',
      category: 'Food',
      amount: 0,
      limit: 1500,
      icon: <Ionicons name="restaurant" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'transport',
      category: 'Transport',
      amount: 2010,
      limit: null,
      icon: <Ionicons name="car" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'shopping',
      category: 'Shopping',
      amount: 3400,
      limit: 4000,
      icon: <Ionicons name="bag-handle" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'health',
      category: 'Health',
      amount: 2400,
      limit: null,
      icon: <Ionicons name="medkit" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'bills',
      category: 'Bills',
      amount: 2600,
      limit: 3000,
      icon: <Ionicons name="receipt" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'other',
      category: 'Other',
      amount: 1100,
      limit: null,
      icon: <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />,
    },
  ];
  //too: move this to aync request
  const historyItems: HistoryTransaction[] = [
    {
      id: '1',
      amount: 620,
      type: 'expense',
      category: 'Freelance',
      date: toIsoDaysAgo(1),
    },
    {
      id: '2',
      amount: 900,
      type: 'expense',
      category: 'Transport',
      date: toIsoDaysAgo(1),
    },
    {
      id: '33',
      amount: 2500,
      type: 'income',
      category: 'Freelance',
      date: toIsoDaysAgo(3),
    },
    {
      id: '353',
      amount: 2500,
      type: 'expense',
      category: 'Freelance',
      date: toIsoDaysAgo(3),
    },
    {
      id: '3',
      amount: 2500,
      type: 'income',
      category: 'Freelance',
      date: toIsoDaysAgo(10),
    },
    {
      id: '4',
      amount: 1200,
      type: 'expense',
      category: 'Shopping',
      date: toIsoDaysAgo(12),
    },
    {
      id: '5',
      amount: 4000,
      type: 'income',
      category: 'Salary',
      date: toIsoDaysAgo(20),
    },
    {
      id: '6',
      amount: 750,
      type: 'expense',
      category: 'Cafe',
      date: toIsoDaysAgo(24),
    },
    {
      id: '7',
      amount: 1100,
      type: 'expense',
      category: 'Bills',
      date: toIsoDaysAgo(30),
    },
    {
      id: '8',
      amount: 1100,
      type: 'expense',
      category: 'Bills',
      date: toIsoDaysAgo(60),
    },
    {
      id: '9',
      amount: 1100,
      type: 'expense',
      category: 'Bills',
      date: toIsoDaysAgo(90),
    },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TopBalanceSection />
        <View style={styles.chartSection}>
          <CategoryBarChart
            items={chartItems}
            onSelectionChange={setSelectedCategory}
          />
        </View>
        <HistoryByPeriod
          transactions={historyItems}
          title="History"
          transactionTypeFilter="expense"
          categoryFilter={selectedCategory?.category ?? null}
          selectedCategory={selectedCategory}
          onActionPress={
            selectedCategory
              ? () => {
                  const actionLabel =
                    selectedCategory.limit != null ? 'Edit limit' : 'Add limit';
                  Alert.alert(
                    'Limits',
                    `${actionLabel} for ${selectedCategory.category}`
                  );
                }
              : undefined
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  content: {
    paddingHorizontal: 8,
    paddingBottom: spacing.lg,
  },
  chartSection: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  filterChipText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  inText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
