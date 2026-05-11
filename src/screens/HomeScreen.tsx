import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBarChart } from '../components/CategoryBarChart/CategoryBarChart';
import { HistoryByPeriod, HistoryTransaction } from '../components/HistoryByPeriod';
import { TopBalanceSection } from '../components/TopBalanceSection';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

function toIsoDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export function HomeScreen() {
  //too: move this to aync request
  const chartItems = [
    {
      id: 'food',
      value: 999,
      icon: <Ionicons name="restaurant" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'transport',
      value: 2010,
      icon: <Ionicons name="car" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'shopping',
      value: 3400,
      icon: <Ionicons name="bag-handle" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'health',
      value: 2400,
      icon: <Ionicons name="medkit" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'bills',
      value: 2600,
      icon: <Ionicons name="receipt" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'other',
      value: 1100,
      icon: <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'otheddr',
      value: 1800,
      icon: <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'othasdasdaвer',
      value: 1800,
      icon: <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'othasdaвer',
      value: 1800,
      icon: <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'othasasddaвer',
      value: 1800,
      icon: <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />,
    },
    {
      id: 'othasaasdsddaвer',
      value: 1800,
      icon: <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />,
    },
  ];
  //too: move this to aync request
  const historyItems: HistoryTransaction[] = [
    {
      id: '1',
      amount: 620,
      type: 'expense',
      category: 'Food',
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
          <CategoryBarChart items={chartItems} />
        </View>
        <HistoryByPeriod
          transactions={historyItems}
          title="History"
          transactionTypeFilter="expense"
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
