import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBarChart } from '../components/CategoryBarChart/CategoryBarChart';
import { TopBalanceSection } from '../components/TopBalanceSection';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function HomeScreen() {
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
      value: 11800,
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

        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>History Notes</Text>
        </View>
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
  notesSection: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 48,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  noteItem: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginBottom: 8,
  },
});
