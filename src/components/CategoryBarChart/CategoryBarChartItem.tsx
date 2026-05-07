import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type CategoryBarChartItemProps = {
  amountLabel: string;
  heightPercent: number;
  icon: ReactNode;
};

const META_BLOCK_HEIGHT = 42;

export function CategoryBarChartItem({
  amountLabel,
  heightPercent,
  icon,
}: CategoryBarChartItemProps) {
  return (
    <View style={styles.column}>
      <View style={styles.barArea}>
        <View style={[styles.bar, { height: `${heightPercent}%` }]} />
      </View>
      <View style={styles.metaRow}>
        <View style={styles.iconWrap}>{icon}</View>
        <Text
          style={styles.amountText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {amountLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  metaRow: {
    width: '100%',
    minWidth: 40,
    height: META_BLOCK_HEIGHT,
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    justifyContent: 'flex-start',
  },
  barArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 9,
    lineHeight: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    backgroundColor: colors.accentPrimary,
  },
});
