import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type StatCardProps = {
  isBackground?: boolean;
  value: string;
  direction: 'up' | 'down';
  accent: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function StatCard({
  isBackground = false,
  value,
  direction,
  accent,
  containerStyle,
}: StatCardProps) {
  return (
    <View style={[styles.card, containerStyle, isBackground && styles.background]}>
      <View style={styles.row}>
        <Text style={[styles.arrow, { color: accent }]}>
          {direction === 'up' ? '↑': '↓'}
        </Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    minWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  arrow: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  background: {
    backgroundColor: colors.neutralHighlight
  },
});
