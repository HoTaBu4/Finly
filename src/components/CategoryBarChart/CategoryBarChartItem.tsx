import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type CategoryBarChartItemProps = {
  amountLabel: string;
  heightPercent: number;
  icon: ReactNode;
  isSelected?: boolean;
  isBlurred?: boolean;
  onPress?: () => void;
};

const META_BLOCK_HEIGHT = 42;
const BAR_TOP_HEADROOM = 12;

export function CategoryBarChartItem({
  amountLabel,
  heightPercent,
  icon,
  isSelected = false,
  isBlurred = false,
  onPress,
}: CategoryBarChartItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressablePressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.column}>
        <View style={styles.barArea}>
          <View
            style={[
              styles.bar,
              { height: `${heightPercent}%` },
              isSelected && styles.barSelected,
            ]}
          />
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
        {isBlurred ? <View pointerEvents="none" style={styles.blurMask} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    height: '100%',
  },
  pressablePressed: {
    opacity: 0.85,
  },
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
    paddingTop: BAR_TOP_HEADROOM,
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
  barSelected: {
    transform: [{ scale: 1.03 }],
  },
  blurMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(242, 242, 249, 0.45)',
    borderRadius: 8,
  },
});
