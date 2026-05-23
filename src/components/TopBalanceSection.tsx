import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { HistoryTransactionFilter, TrackingMode } from '../types';
import { StatCard } from './StatCard';

type TopBalanceSectionProps = {
  onSettingsPress?: () => void;
  onExpensePress?: () => void;
  onIncomePress?: () => void;
  onAllPress?: () => void;
  activeFilter?: HistoryTransactionFilter;
  trackingMode?: TrackingMode;
};

export function TopBalanceSection({
  onSettingsPress,
  onExpensePress,
  onIncomePress,
  onAllPress,
  activeFilter = HistoryTransactionFilter.Expense,
  trackingMode = TrackingMode.ExpensesOnly,
}: TopBalanceSectionProps) {
  const isBothMode = trackingMode === TrackingMode.Both;
  const isExpenseActive = activeFilter === HistoryTransactionFilter.Expense;
  const isIncomeActive = activeFilter === HistoryTransactionFilter.Income;
  const isAllActive = activeFilter === HistoryTransactionFilter.All;

  return (
    <View style={styles.panel}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Balance</Text>
        <Pressable
          style={styles.settingsButton}
          onPress={onSettingsPress}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Ionicons name="settings-outline" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.balanceRow}>
        <Text style={styles.balance}>140 000 $</Text>
        <View style={styles.balanceActions}>
          <View style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        {isBothMode ? (
          <>
            <Pressable
              style={[styles.filterButton, isExpenseActive && styles.filterButtonActive]}
              onPress={onExpensePress}
              accessibilityRole="button"
              accessibilityLabel="Show expenses"
              accessibilityState={{ selected: isExpenseActive }}
            >
              <StatCard
                isBackground
                value="-100 $"
                direction="down"
                accent={colors.orange}
                containerStyle={[styles.statCard, styles.expenseCard]}
              />
            </Pressable>

            <Pressable
              style={[styles.filterButton, isIncomeActive && styles.filterButtonActive]}
              onPress={onIncomePress}
              accessibilityRole="button"
              accessibilityLabel="Show income"
              accessibilityState={{ selected: isIncomeActive }}
            >
              <StatCard
                value="240 $"
                direction="up"
                accent={colors.green}
                containerStyle={styles.statCard}
              />
            </Pressable>

            <Pressable
              style={[styles.allButton, styles.filterButton, isAllActive && styles.filterButtonActive]}
              onPress={onAllPress}
              accessibilityRole="button"
              accessibilityLabel="Show all transactions"
              accessibilityState={{ selected: isAllActive }}
            >
              <Text style={styles.allButtonText}>All</Text>
            </Pressable>
          </>
        ) : (
          <StatCard
            isBackground
            value="-100 $"
            direction="down"
            accent={colors.orange}
            containerStyle={[styles.statCard, styles.expenseCard]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceActions: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    color: colors.textPrimary,
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  plusButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accentPrimarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: colors.accentPrimary,
    fontSize: 24,
    fontWeight: '400',
    marginTop: -1,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  statCard: {
    minWidth: 0,
  },
  expenseCard: {
    backgroundColor: colors.neutralHighlight,
  },
  allButton: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(123, 108, 255, 0.03)',
    minWidth: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterButton: {
    borderRadius: 12,
  },
  filterButtonActive: {
    borderWidth: 1,
    borderColor: colors.accentPrimary,
  },
});
