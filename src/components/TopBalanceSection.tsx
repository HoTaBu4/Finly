import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../translations';
import { HistoryTransactionFilter, TrackingMode } from '../types';
import { formatMoney } from '../utils/formatters';
import { StatCard } from './StatCard';

type TopBalanceSectionProps = {
  onSettingsPress?: () => void;
  onExpensePress?: () => void;
  onIncomePress?: () => void;
  onAllPress?: () => void;
  activeFilter?: HistoryTransactionFilter;
  trackingMode?: TrackingMode;
  balanceAmount?: number;
  expenseAmount?: number;
  incomeAmount?: number;
};

export function TopBalanceSection({
  onSettingsPress,
  onExpensePress,
  onIncomePress,
  onAllPress,
  activeFilter = HistoryTransactionFilter.Expense,
  trackingMode = TrackingMode.ExpensesOnly,
  balanceAmount = 0,
  expenseAmount = 0,
  incomeAmount = 0,
}: TopBalanceSectionProps) {
  const isBothMode = trackingMode === TrackingMode.Both;
  const isExpenseActive = activeFilter === HistoryTransactionFilter.Expense;
  const isIncomeActive = activeFilter === HistoryTransactionFilter.Income;
  const isAllActive = activeFilter === HistoryTransactionFilter.All;
  const balanceLabel =
    balanceAmount < 0
      ? `-${formatMoney(Math.abs(balanceAmount))}`
      : formatMoney(balanceAmount);
  const expenseLabel = expenseAmount === 0 ? formatMoney(0) : `-${formatMoney(expenseAmount)}`;
  const incomeLabel = formatMoney(incomeAmount);

  return (
    <View style={styles.panel}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{translations.topBalance.balance}</Text>
        <Pressable
          style={styles.settingsButton}
          onPress={onSettingsPress}
          accessibilityRole="button"
          accessibilityLabel={translations.topBalance.openSettings}
        >
          <Ionicons name="settings-outline" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.balanceRow}>
        <Text style={styles.balance}>{balanceLabel}</Text>
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
              accessibilityLabel={translations.topBalance.showExpenses}
              accessibilityState={{ selected: isExpenseActive }}
            >
              <StatCard
                isBackground
                value={expenseLabel}
                direction="down"
                accent={colors.orange}
                containerStyle={[styles.statCard, styles.expenseCard]}
              />
            </Pressable>

            <Pressable
              style={[styles.filterButton, isIncomeActive && styles.filterButtonActive]}
              onPress={onIncomePress}
              accessibilityRole="button"
              accessibilityLabel={translations.topBalance.showIncome}
              accessibilityState={{ selected: isIncomeActive }}
            >
              <StatCard
                value={incomeLabel}
                direction="up"
                accent={colors.green}
                containerStyle={styles.statCard}
              />
            </Pressable>

            <Pressable
              style={[styles.allButton, styles.filterButton, isAllActive && styles.filterButtonActive]}
              onPress={onAllPress}
              accessibilityRole="button"
              accessibilityLabel={translations.topBalance.showAllTransactions}
              accessibilityState={{ selected: isAllActive }}
            >
              <Text style={styles.allButtonText}>{translations.common.all}</Text>
            </Pressable>
          </>
        ) : (
          <StatCard
            isBackground
            value={expenseLabel}
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
    paddingBottom: 8,
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
    marginBottom: 4,
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
