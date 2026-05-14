import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { CategoryBarChart } from '../components/CategoryBarChart/CategoryBarChart';
import { HistoryByPeriod } from '../components/HistoryByPeriod';
import { LimitModal } from '../components/modals/LimitModal';
import { StickyAddBar } from '../components/StickyAddBar';
import { TopBalanceSection } from '../components/TopBalanceSection';
import { colors } from '../theme/colors';
import { CategoryChartIcon, CategoryChartItem, HistoryTransaction } from '../types';

function toIsoDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

const INITIAL_CHART_ITEMS: CategoryChartItem[] = [
  {
    id: 'food',
    category: 'Food',
    amount: 0,
    limit: 1500,
    icon: CategoryChartIcon.Restaurant,
  },
  {
    id: 'transport',
    category: 'Transport',
    amount: 2010,
    limit: null,
    icon: CategoryChartIcon.Car,
  },
  {
    id: 'shopping',
    category: 'Shopping',
    amount: 3400,
    limit: 4000,
    icon: CategoryChartIcon.BagHandle,
  },
  {
    id: 'health',
    category: 'Health',
    amount: 2400,
    limit: null,
    icon: CategoryChartIcon.Medkit,
  },
  {
    id: 'bills',
    category: 'Bills',
    amount: 2600,
    limit: 3000,
    icon: CategoryChartIcon.Receipt,
  },
  {
    id: 'other',
    category: 'Other',
    amount: 1100,
    limit: null,
    icon: CategoryChartIcon.EllipsisHorizontal,
  },
];

const HISTORY_ITEMS: HistoryTransaction[] = [
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

export function HomeScreen() {
  const [chartItems, setChartItems] = useState<CategoryChartItem[]>(INITIAL_CHART_ITEMS);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLimitModalOpen, setLimitModalOpen] = useState(false);

  const selectedCategory =
    chartItems.find((item) => item.id === selectedCategoryId) ?? null;

  function handleSelectionChange(category: CategoryChartItem | null) {
    setSelectedCategoryId(category?.id ?? null);
  }

  function setLimitModalVisibility(isOpen: boolean) {
    setLimitModalOpen(isOpen);
  }

  function saveLimit(limit: number | null) {
    if (!selectedCategory) {
      return;
    }

    setChartItems((previous) =>
      previous.map((item) =>
        item.id === selectedCategory.id
          ? { ...item, limit }
          : item
      )
    );
    setLimitModalVisibility(false);
  }

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
            onSelectionChange={handleSelectionChange}
          />
        </View>
        <HistoryByPeriod
          transactions={HISTORY_ITEMS}
          title="History"
          transactionTypeFilter="expense"
          categoryFilter={selectedCategory?.category ?? null}
          selectedCategory={selectedCategory}
          onActionPress={() => setLimitModalVisibility(true)}
        />
      </ScrollView>
      <LimitModal
        visible={isLimitModalOpen}
        categoryName={selectedCategory?.category}
        currentLimit={selectedCategory?.limit ?? null}
        onClose={() => setLimitModalVisibility(false)}
        onSave={saveLimit}
      />
      <StickyAddBar
        onAddPress={() => Alert.alert('Add item', 'Open add item form')}
        onMicPress={() => Alert.alert('Voice input', 'Start voice capture')}
      />
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
    paddingBottom: 120,
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
