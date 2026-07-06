import { formatMoney } from '../../utils/formatters';
import { translations } from '../../translations';

type BuildBarVisualStateInput = {
  heightPercent: number;
  limitPercent: number | null;
  overLimitValue: number;
  overLimitLabel: string | null;
  isSelected: boolean;
};

type BuildBarVisualStateResult = {
  isOverLimit: boolean;
  limitVisualPercent: number | null;
  overLimitPercent: number;
  baseBarHeightPercent: number;
  limitAnchorPercent: number;
  showTinyOverIndicator: boolean;
  tinyOverLabel: string;
  infoChipOverLabel: string | null;
};

const MIN_VISIBLE_LIMIT_PERCENT = 1.2;
const MIN_VISIBLE_LIMIT_GAP_PERCENT = 1.4;
const MIN_VISIBLE_BASE_WHEN_OVER_LIMIT_PERCENT = 2.6;
const TINY_OVER_INDICATOR_PERCENT_THRESHOLD = 3;

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function toScaledPercent(
  value: number,
  maxValue: number,
  useSqrtScale: boolean,
  minPercentForPositive = 0
) {
  if (value <= 0 || maxValue <= 0) {
    return 0;
  }

  const normalized = useSqrtScale
    ? Math.sqrt(value / maxValue)
    : value / maxValue;
  const rawPercent = normalized * 100;

  if (minPercentForPositive > 0) {
    return clampNumber(Math.max(rawPercent, minPercentForPositive), 0, 100);
  }

  return clampNumber(rawPercent, 0, 100);
}

export function buildBarVisualState({
  heightPercent,
  limitPercent,
  overLimitValue,
  overLimitLabel,
  isSelected,
}: BuildBarVisualStateInput): BuildBarVisualStateResult {
  const hasLimit = limitPercent !== null && limitPercent > 0;
  const isOverLimit = hasLimit && overLimitValue > 0;
  let limitVisualPercent =
    hasLimit ? Math.max(limitPercent ?? 0, MIN_VISIBLE_LIMIT_PERCENT) : null;
  if (
    hasLimit &&
    !isOverLimit &&
    limitVisualPercent !== null &&
    limitVisualPercent > heightPercent &&
    limitVisualPercent - heightPercent < MIN_VISIBLE_LIMIT_GAP_PERCENT
  ) {
    limitVisualPercent = Math.min(100, heightPercent + MIN_VISIBLE_LIMIT_GAP_PERCENT);
  }
  const rawOverLimitPercent =
    isOverLimit && limitPercent !== null
      ? Math.max(0, heightPercent - limitPercent)
      : 0;
  const overLimitPercent = isOverLimit ? rawOverLimitPercent : 0;
  const baseBarHeightPercent = isOverLimit
    ? Math.max(limitVisualPercent ?? 0, MIN_VISIBLE_BASE_WHEN_OVER_LIMIT_PERCENT)
    : heightPercent;
  const limitAnchorPercent = Math.max(heightPercent, limitVisualPercent ?? 0);
  const showTinyOverIndicator =
    isOverLimit &&
    rawOverLimitPercent < TINY_OVER_INDICATOR_PERCENT_THRESHOLD &&
    !isSelected;

  const tinyOverLabel = `-${formatMoney(overLimitValue)}`;
  const infoChipOverLabel =
    isOverLimit && overLimitLabel
      ? translations.categoryChart.overLimit(overLimitLabel.replace('+', ''))
      : null;

  return {
    isOverLimit,
    limitVisualPercent,
    overLimitPercent,
    baseBarHeightPercent,
    limitAnchorPercent,
    showTinyOverIndicator,
    tinyOverLabel,
    infoChipOverLabel,
  };
}
