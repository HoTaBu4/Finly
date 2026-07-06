import { colors } from '../../theme/colors';
import { CategoryChartItem, TransactionType } from '../../types';
import { formatMoney } from '../../utils/formatters';
import { CategoryBarChartItem } from './CategoryBarChartItem';
import { toScaledPercent } from './categoryBarChartItem.utils';

type CategoryBarChartColumnProps = {
  item: CategoryChartItem;
  maxValue: number;
  useSqrtScale: boolean;
  minNonZeroBarPercent: number;
  isSelected: boolean;
  isBlurred: boolean;
  onPress: () => void;
};

const BAR_COLOR_BY_TYPE: Record<CategoryChartItem['type'], string> = {
  [TransactionType.Income]: colors.green,
  [TransactionType.Expense]: colors.accentPrimary,
};

export function CategoryBarChartColumn({
  item,
  maxValue,
  useSqrtScale,
  minNonZeroBarPercent,
  isSelected,
  isBlurred,
  onPress,
}: CategoryBarChartColumnProps) {
  const effectiveLimit = item.type === TransactionType.Expense ? item.limit : null;
  const heightPercent = Math.round(
    toScaledPercent(item.amount, maxValue, useSqrtScale, minNonZeroBarPercent)
  );
  const limitPercent =
    effectiveLimit !== null
      ? toScaledPercent(effectiveLimit, maxValue, useSqrtScale)
      : null;
  const amountLabel = formatMoney(item.amount);
  const overLimitValue =
    effectiveLimit !== null
      ? Math.max(0, item.amount - effectiveLimit)
      : 0;
  const limitLabel =
    effectiveLimit !== null
      ? formatMoney(effectiveLimit)
      : null;
  const overLimitLabel =
    overLimitValue > 0
      ? `+${formatMoney(overLimitValue)}`
      : null;

  return (
    <CategoryBarChartItem
      amountLabel={amountLabel}
      limitLabel={limitLabel}
      heightPercent={heightPercent}
      limitPercent={limitPercent}
      overLimitValue={overLimitValue}
      overLimitLabel={overLimitLabel}
      barColor={BAR_COLOR_BY_TYPE[item.type]}
      iconName={item.icon}
      isSelected={isSelected}
      isBlurred={isBlurred}
      onPress={onPress}
    />
  );
}
