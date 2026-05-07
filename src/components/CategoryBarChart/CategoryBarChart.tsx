import { ReactNode, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { CategoryBarChartItem } from './CategoryBarChartItem';
import { colors } from '../../theme/colors';

type ChartItem = {
  id: string;
  value: number;
  amount?: string;
  icon: ReactNode;
};

type CategoryBarChartProps = {
  items: ChartItem[];
};

const MAX_VISIBLE_WITHOUT_SCROLL = 4;
const CHART_HEIGHT = 170;
const BAR_MIN_WIDTH = 28;
const BAR_MAX_WIDTH = 72;
const BAR_GAP = 20;
const MIN_BAR_PERCENT = 16;
const SCROLL_VISIBLE_EQUIVALENT_ITEMS = 4.5;
const SCROLL_VISIBLE_GAP_COUNT = 4;
const CONTENT_EDGE_PADDING = BAR_GAP;
const MIDDLE_SIDE_PEEK_FRACTION = 0.25;

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatAmountFromValue(value: number) {
  const formatted = new Intl.NumberFormat('uk-UA', {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} $`;
}

export function CategoryBarChart({ items }: CategoryBarChartProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const needsScroll = items.length > MAX_VISIBLE_WITHOUT_SCROLL;

  const computedBarWidth =
    containerWidth > 0
      ? (containerWidth - CONTENT_EDGE_PADDING - SCROLL_VISIBLE_GAP_COUNT * BAR_GAP) /
        SCROLL_VISIBLE_EQUIVALENT_ITEMS
      : BAR_MIN_WIDTH;
  const barWidth = clampNumber(computedBarWidth, BAR_MIN_WIDTH, BAR_MAX_WIDTH);
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

    // Middle positions: always land on "two-sided peek" offsets
    // so users see that content exists on both sides.
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

  const renderBarItem = (item: ChartItem) => {
    const heightPercent = Math.max(
      MIN_BAR_PERCENT,
      Math.round((item.value / maxValue) * 100)
    );
    const amountLabel = item.amount ?? formatAmountFromValue(item.value);
    return <CategoryBarChartItem amountLabel={amountLabel} heightPercent={heightPercent} icon={item.icon} />;
  };

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
            <View key={item.id} style={styles.staticBarWrap}>
              {renderBarItem(item)}
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={[styles.scrollBarWrap, { width: barWidth }]}>{renderBarItem(item)}</View>
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
    justifyContent: 'space-between',
  },
  staticBarWrap: {
    flex: 1,
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
