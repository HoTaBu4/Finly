import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { CategoryBarChartColumn } from './CategoryBarChartColumn';
import { colors } from '../../theme/colors';
import { CategoryChartItem, TransactionType } from '../../types';

type CategoryBarChartProps = {
  items: CategoryChartItem[];
  selectedItemId?: string | null;
  onSelectionChange?: (selectedCategory: CategoryChartItem | null) => void;
};

const MAX_VISIBLE_WITHOUT_SCROLL = 5;
const CHART_HEIGHT = 300;
const BAR_MIN_WIDTH = 28;
const BAR_MAX_WIDTH = 72;
const STATIC_BAR_MAX_WIDTH = 140;
const BAR_GAP = 20;
const MIN_NON_ZERO_BAR_PERCENT = 4;
const SCALE_SPREAD_RATIO_THRESHOLD = 8;
const SCROLL_VISIBLE_EQUIVALENT_ITEMS = 4.5;
const SCROLL_VISIBLE_GAP_COUNT = 4;
const CONTENT_EDGE_PADDING = BAR_GAP;
const MIDDLE_SIDE_PEEK_FRACTION = 0.25;

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function CategoryBarChart({
  items,
  selectedItemId = null,
  onSelectionChange,
}: CategoryBarChartProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const maxValue = Math.max(
    ...items.map((item) => item.amount),
    ...items.map((item) => (item.type === TransactionType.Expense ? item.limit ?? 0 : 0)),
    1
  );
  const positiveValues = items
    .flatMap((item) =>
      item.type === TransactionType.Expense
        ? [item.amount, item.limit ?? 0]
        : [item.amount]
    )
    .filter((value) => value > 0);
  const smallestPositiveValue =
    positiveValues.length > 0
      ? Math.min(...positiveValues)
      : maxValue;
  const useSqrtScale =
    smallestPositiveValue > 0 &&
    maxValue / smallestPositiveValue >= SCALE_SPREAD_RATIO_THRESHOLD;
  const needsScroll = items.length > MAX_VISIBLE_WITHOUT_SCROLL;

  const computedBarWidth =
    containerWidth > 0
      ? (containerWidth - CONTENT_EDGE_PADDING - SCROLL_VISIBLE_GAP_COUNT * BAR_GAP) /
        SCROLL_VISIBLE_EQUIVALENT_ITEMS
      : BAR_MIN_WIDTH;
  const barWidth = clampNumber(computedBarWidth, BAR_MIN_WIDTH, BAR_MAX_WIDTH);
  const staticComputedBarWidth =
    containerWidth > 0
      ? (containerWidth - CONTENT_EDGE_PADDING * 2 - Math.max(items.length - 1, 0) * BAR_GAP) /
        Math.max(items.length, 1)
      : BAR_MAX_WIDTH;
  const staticBarWidth = clampNumber(staticComputedBarWidth, BAR_MIN_WIDTH, STATIC_BAR_MAX_WIDTH);
  const itemSpan = barWidth + BAR_GAP;
  const contentWidth =
    items.length * barWidth +
    Math.max(items.length - 1, 0) * BAR_GAP +
    CONTENT_EDGE_PADDING * 2;
  const maxOffset = Math.max(0, contentWidth - containerWidth);
  const middlePeekOffset =
    CONTENT_EDGE_PADDING + barWidth * (1 - MIDDLE_SIDE_PEEK_FRACTION);
  const snapOffsets = useMemo(() => {
    if (!needsScroll || itemSpan <= 0) {
      return undefined;
    }

    const offsets: number[] = [0];

    for (
      let offset = middlePeekOffset;
      offset < maxOffset - middlePeekOffset;
      offset += itemSpan
    ) {
      offsets.push(offset);
    }

    if (maxOffset > 0) {
      offsets.push(maxOffset);
    }

    return offsets;
  }, [barWidth, itemSpan, maxOffset, middlePeekOffset, needsScroll]);

  function createSelectHandler(item: CategoryChartItem) {
    return () => {
      if (selectedItemId === item.id) {
        onSelectionChange?.(null);
        return;
      }

      onSelectionChange?.(item);
    };
  }

  function renderColumn(item: CategoryChartItem) {
    return (
      <CategoryBarChartColumn
        item={item}
        maxValue={maxValue}
        useSqrtScale={useSqrtScale}
        minNonZeroBarPercent={MIN_NON_ZERO_BAR_PERCENT}
        isSelected={selectedItemId === item.id}
        isBlurred={selectedItemId !== null && selectedItemId !== item.id}
        onPress={createSelectHandler(item)}
      />
    );
  }

  return (
    <View
      style={[styles.chartBox, { height: CHART_HEIGHT }]}
      onLayout={({ nativeEvent }) => {
        const nextWidth = Math.round(nativeEvent.layout.width);
        setContainerWidth((prevWidth) => (prevWidth === nextWidth ? prevWidth : nextWidth));
      }}
    >
      <View style={styles.gridLineTop} />
      <View style={styles.gridLineBottom} />

      {!needsScroll ? (
        <View style={styles.staticRow}>
          {items.map((item) => (
            <View key={item.id} style={[styles.staticBarWrap, { width: staticBarWidth }]}>
              {renderColumn(item)}
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={items}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={[styles.scrollBarWrap, { width: barWidth }]}>
              {renderColumn(item)}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ width: BAR_GAP }} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToOffsets={snapOffsets}
          snapToAlignment="start"
          disableIntervalMomentum
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chartBox: {
    position: 'relative',
    justifyContent: 'flex-end',
  },
  gridLineTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '26%',
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  gridLineBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '62%',
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  staticRow: {
    flexDirection: 'row',
    height: '100%',
    gap: BAR_GAP,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  staticBarWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  scrollContent: {
    height: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: CONTENT_EDGE_PADDING,
  },
  scrollBarWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
});
