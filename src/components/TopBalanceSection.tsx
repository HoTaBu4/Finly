import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { StatCard } from './StatCard';

export function TopBalanceSection() {
  return (
    <View style={styles.panel}>
      <Text style={styles.label}>Balance</Text>

      <View style={styles.balanceRow}>
        <Text style={styles.balance}>140 000 $</Text>
        <View style={styles.plusButton}>
          <Text style={styles.plusText}>+</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          isBackground={true}
          value="-100 $"
          direction="down"
          accent={colors.orange}
          containerStyle={[styles.statCard, styles.incomeCard]}
          />
        <StatCard
          value="240 $"
          direction="up"
          accent={colors.green}
          containerStyle={styles.statCard}
        />
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
  label: {
    color: colors.textPrimary,
    fontSize: 18,
    marginBottom: 6,
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balance: {
    color: colors.textPrimary,
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  plusButton: {
    marginLeft: 12,
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
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  statCard: {
    minWidth: 0,
  },
  incomeCard: {
    backgroundColor: colors.neutralHighlight,
  },
});
