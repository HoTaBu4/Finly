type BuildBarVisualStateInput = {
  heightPercent: number;
  limitPercent: number | null;
  overLimitValue: number;
  overLimitLabel: string | null;
  isSelected: boolean;
};

type BuildBarVisualStateResult = {
  isOverLimit: boolean;
  useFullRedBar: boolean;
  overLimitPercent: number;
  baseBarHeightPercent: number;
  limitAnchorPercent: number;
  showTinyOverIndicator: boolean;
  tinyOverLabel: string;
  infoChipOverLabel: string | null;
};

const FULL_RED_OVER_LIMIT_PERCENT_THRESHOLD = 2.5;
const SMALL_BAR_FULL_RED_HEIGHT_THRESHOLD = 12;
const MIN_VISIBLE_OVER_LIMIT_PERCENT = 1.1;
const TINY_OVER_INDICATOR_PERCENT_THRESHOLD = 3;

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatAmountFromValue(value: number) {
  const formatted = new Intl.NumberFormat('uk-UA', {
    maximumFractionDigits: 0,
  }).format(value);

  return `${formatted} $`;
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
  const rawOverLimitPercent =
    isOverLimit && limitPercent !== null
      ? Math.max(0, heightPercent - limitPercent)
      : 0;

  const useFullRedBar =
    isOverLimit &&
    rawOverLimitPercent < FULL_RED_OVER_LIMIT_PERCENT_THRESHOLD &&
    heightPercent <= SMALL_BAR_FULL_RED_HEIGHT_THRESHOLD;

  const overLimitPercent =
    useFullRedBar || !isOverLimit
      ? 0
      : Math.max(rawOverLimitPercent, MIN_VISIBLE_OVER_LIMIT_PERCENT);

  const baseBarHeightPercent =
    useFullRedBar
      ? heightPercent
      : Math.max(0, heightPercent - overLimitPercent);

  const limitAnchorPercent = Math.max(heightPercent, limitPercent ?? 0);
  const showTinyOverIndicator =
    isOverLimit &&
    !useFullRedBar &&
    rawOverLimitPercent < TINY_OVER_INDICATOR_PERCENT_THRESHOLD &&
    !isSelected;

  const tinyOverLabel = `-${formatAmountFromValue(overLimitValue)}`;
  const infoChipOverLabel =
    isOverLimit && overLimitLabel
      ? `Over ${overLimitLabel.replace('+', '')}`
      : null;

  return {
    isOverLimit,
    useFullRedBar,
    overLimitPercent,
    baseBarHeightPercent,
    limitAnchorPercent,
    showTinyOverIndicator,
    tinyOverLabel,
    infoChipOverLabel,
  };
}
