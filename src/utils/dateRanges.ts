export type MonthWeekPreset = 'week_1' | 'week_2' | 'week_3' | 'week_4';

export type DateRangePreset = 'this_month' | 'this_year' | MonthWeekPreset | 'custom';

export type DateRange = {
  preset: DateRangePreset;
  startDate: Date;
  endDate: Date;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}

export function getThisMonthRange(anchorDate = new Date()): DateRange {
  return {
    preset: 'this_month',
    startDate: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1),
    endDate: new Date(
      anchorDate.getFullYear(),
      anchorDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ),
  };
}

export function getThisYearRange(anchorDate = new Date()): DateRange {
  return {
    preset: 'this_year',
    startDate: new Date(anchorDate.getFullYear(), 0, 1),
    endDate: new Date(anchorDate.getFullYear(), 11, 31, 23, 59, 59, 999),
  };
}

export function getMonthWeekRange(weekNumber: 1 | 2 | 3 | 4, anchorDate = new Date()): DateRange {
  const startDay = (weekNumber - 1) * 7 + 1;
  const endDay = weekNumber === 4 ? 0 : weekNumber * 7;
  const startDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), startDay);
  const endDate =
    weekNumber === 4
      ? new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0, 23, 59, 59, 999)
      : new Date(anchorDate.getFullYear(), anchorDate.getMonth(), endDay, 23, 59, 59, 999);

  return {
    preset: `week_${weekNumber}`,
    startDate,
    endDate,
  };
}

export function getAvailableMonthWeekPresets(anchorDate = new Date()): MonthWeekPreset[] {
  const today = startOfDay(anchorDate);

  return ([1, 2, 3, 4] as const)
    .map((weekNumber) => getMonthWeekRange(weekNumber, anchorDate))
    .filter((range) => range.startDate <= today)
    .map((range) => range.preset as MonthWeekPreset);
}

export function createCustomRange(startDate: Date, endDate: Date): DateRange {
  return {
    preset: 'custom',
    startDate: startOfDay(startDate),
    endDate: endOfDay(endDate),
  };
}

export function isDateInRange(value: string, range: DateRange) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date >= range.startDate && date <= range.endDate;
}

export function isSameCalendarDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function formatDateRangeLabel(range: DateRange, locale = 'en-US') {
  if (range.preset === 'this_month') {
    return 'This month';
  }

  if (range.preset === 'this_year') {
    return 'This year';
  }

  if (range.preset === 'week_1') {
    return 'Week 1';
  }

  if (range.preset === 'week_2') {
    return 'Week 2';
  }

  if (range.preset === 'week_3') {
    return 'Week 3';
  }

  if (range.preset === 'week_4') {
    return 'Week 4';
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  });

  return `${formatter.format(range.startDate)} – ${formatter.format(range.endDate)}`;
}
