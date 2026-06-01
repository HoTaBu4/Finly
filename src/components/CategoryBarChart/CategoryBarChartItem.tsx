import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { CategoryIconKey } from '../../types';
import { CategoryBarLimitLayer } from './CategoryBarLimitLayer';
import { buildBarVisualState } from './categoryBarChartItem.utils';

type CategoryBarChartItemProps = {
  amountLabel: string;
  limitLabel: string | null;
  heightPercent: number;
  limitPercent: number | null;
  overLimitValue: number;
  overLimitLabel: string | null;
  barColor?: string;
  iconName: CategoryIconKey;
  isSelected?: boolean;
  isBlurred?: boolean;
  onPress?: () => void;
};

const META_BLOCK_HEIGHT = 52;
const BAR_TOP_HEADROOM = 34;
const BAR_BODY_RADIUS = 6;
const LIMIT_PALETTE = {
  guideBackground: 'rgba(123, 108, 255, 0.14)',
  guideBorder: 'rgba(123, 108, 255, 0.24)',
  guideStripe: 'rgba(123, 108, 255, 0.22)',
  overLimitBackground: 'rgba(228, 95, 95, 0.72)',
  overLimitSolid: '#de7474',
};

export function CategoryBarChartItem({
  amountLabel,
  limitLabel,
  heightPercent,
  limitPercent,
  overLimitValue,
  overLimitLabel,
  barColor = colors.accentPrimary,
  iconName,
  isSelected = false,
  isBlurred = false,
  onPress,
}: CategoryBarChartItemProps) {
  const selectionAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const blurAnim = useRef(new Animated.Value(isBlurred ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(selectionAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isSelected, selectionAnim]);

  useEffect(() => {
    Animated.timing(blurAnim, {
      toValue: isBlurred ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isBlurred, blurAnim]);

  const animatedScale = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });
  const animatedDimOpacity = blurAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.52],
  });
  const animatedChipOpacity = selectionAnim;
  const animatedChipTranslateY = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 0],
  });

  const {
    useFullRedBar,
    overLimitPercent,
    baseBarHeightPercent,
    limitAnchorPercent,
    showTinyOverIndicator,
    tinyOverLabel,
    infoChipOverLabel,
  } = buildBarVisualState({
    heightPercent,
    limitPercent,
    overLimitValue,
    overLimitLabel,
    isSelected,
  });
  const infoChipBottom = Math.min(limitAnchorPercent + 2, 92);
  const infoChipLabel =
    limitLabel
      ? `Limit ${limitLabel}`
      : null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressablePressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Animated.View
        style={[
          styles.column,
          {
            opacity: animatedDimOpacity,
            transform: [{ scale: animatedScale }],
          },
        ]}
      >
        <View style={styles.barArea}>
          {!useFullRedBar ? (
            <CategoryBarLimitLayer
              limitPercent={limitPercent}
              baseBarHeightPercent={baseBarHeightPercent}
              overLimitPercent={overLimitPercent}
              barRadius={BAR_BODY_RADIUS}
              palette={LIMIT_PALETTE}
            />
          ) : null}
          {infoChipLabel ? (
            <Animated.View
              style={[
                styles.infoChip,
                {
                  bottom: `${infoChipBottom}%`,
                  opacity: animatedChipOpacity,
                  transform: [{ translateY: animatedChipTranslateY }],
                },
              ]}
              pointerEvents="none"
            >
              <Text
                style={styles.infoChipText}
              >
                {infoChipLabel}
              </Text>
              {infoChipOverLabel ? (
                <Text style={[styles.infoChipText, styles.infoChipTextOver]}>
                  {infoChipOverLabel}
                </Text>
              ) : null}
            </Animated.View>
          ) : null}

          <View
            style={[
              styles.bar,
              {
                height: `${baseBarHeightPercent}%`,
                backgroundColor: useFullRedBar
                  ? LIMIT_PALETTE.overLimitSolid
                  : barColor,
                borderRadius: BAR_BODY_RADIUS,
              },
            ]}
          />
        </View>
        <View style={styles.metaRow}>
          <View style={styles.iconWrap}>
            <Ionicons
              name={iconName}
              size={20}
              color={colors.textPrimary}
            />
          </View>
          <Text
            style={styles.amountText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {amountLabel}
          </Text>
          {showTinyOverIndicator ? (
            <View style={styles.tinyOverRow}>
              <View style={styles.tinyOverDot} />
              <Text style={styles.tinyOverText}>{tinyOverLabel}</Text>
            </View>
          ) : null}
        </View>
        {isBlurred ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.blurMask, { opacity: blurAnim }]}
          />
        ) : null}
      </Animated.View>
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
  tinyOverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: -1,
  },
  tinyOverDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#de7474',
  },
  tinyOverText: {
    fontSize: 8,
    lineHeight: 10,
    color: '#d15a5a',
    fontWeight: '700',
  },
  bar: {
    position: 'relative',
    width: '100%',
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: colors.accentPrimary,
    zIndex: 3,
  },
  infoChip: {
    position: 'absolute',
    alignSelf: 'center',
    minWidth: 88,
    maxWidth: 108,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: colors.panelBorder,
    backgroundColor: colors.cardBackground,
    zIndex: 4,
    alignItems: 'center',
  },
  infoChipText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  infoChipTextOver: {
    color: '#d15a5a',
    marginTop: 1,
  },
  blurMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(242, 242, 249, 0.62)',
    borderRadius: 8,
  },
});
