import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../translations';
import {
  createCustomRange,
  DateRange,
  DateRangePreset,
  getAvailableMonthWeekPresets,
  getMonthWeekRange,
  getThisMonthRange,
  getThisYearRange,
  isSameCalendarDay,
  MonthWeekPreset,
} from '../utils/dateRanges';

type DateRangePickerModalProps = {
  visible: boolean;
  selectedRange: DateRange;
  transactionDates: string[];
  onClose: () => void;
  onApply: (range: DateRange) => void;
};

type CalendarDay = {
  key: string;
  date: Date;
  isCurrentMonth: boolean;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getMonthDays(viewDate: Date) {
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const mondayBasedDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - mondayBasedDay);

  return Array.from({ length: 42 }, (_, index): CalendarDay => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      key: date.toISOString(),
      date,
      isCurrentMonth: date.getMonth() === viewDate.getMonth(),
    };
  });
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat(translations.formatting.locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function isDateBetween(date: Date, startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) {
    return false;
  }

  return date > startDate && date < endDate;
}

function getQuickRange(preset: Exclude<DateRangePreset, 'custom'>) {
  if (preset === 'this_year') {
    return getThisYearRange();
  }

  if (preset === 'week_1') {
    return getMonthWeekRange(1);
  }

  if (preset === 'week_2') {
    return getMonthWeekRange(2);
  }

  if (preset === 'week_3') {
    return getMonthWeekRange(3);
  }

  if (preset === 'week_4') {
    return getMonthWeekRange(4);
  }

  return getThisMonthRange();
}

function getWeekLabel(preset: MonthWeekPreset) {
  return translations.dateRange.week(preset.replace('week_', ''));
}

export function DateRangePickerModal({
  visible,
  selectedRange,
  transactionDates,
  onClose,
  onApply,
}: DateRangePickerModalProps) {
  const [draftRange, setDraftRange] = useState<DateRange>(selectedRange);
  const [viewDate, setViewDate] = useState(selectedRange.startDate);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(selectedRange.startDate);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(selectedRange.endDate);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDraftRange(selectedRange);
    setViewDate(selectedRange.startDate);
    setCustomStartDate(selectedRange.startDate);
    setCustomEndDate(selectedRange.endDate);
  }, [selectedRange, visible]);

  const calendarDays = useMemo(() => getMonthDays(viewDate), [viewDate]);
  const availableWeekPresets = useMemo(
    () =>
      getAvailableMonthWeekPresets().filter((preset) => {
        const weekNumber = Number(preset.replace('week_', '')) as 1 | 2 | 3 | 4;
        const weekRange = getMonthWeekRange(weekNumber);

        return transactionDates.some((date) => {
          const transactionDate = new Date(date);
          return transactionDate >= weekRange.startDate && transactionDate <= weekRange.endDate;
        });
      }),
    [transactionDates]
  );
  const hasAvailableWeeks = availableWeekPresets.length > 0;
  const canApply = draftRange.preset !== 'custom' || Boolean(customStartDate && customEndDate);

  function selectQuickRange(preset: Exclude<DateRangePreset, 'custom'>) {
    const nextRange = getQuickRange(preset);
    setDraftRange(nextRange);
    setCustomStartDate(nextRange.startDate);
    setCustomEndDate(nextRange.endDate);
    setViewDate(nextRange.startDate);
  }

  function selectCustomDate(date: Date) {
    if (!customStartDate || customEndDate || date < customStartDate) {
      setCustomStartDate(date);
      setCustomEndDate(null);
      setDraftRange(createCustomRange(date, date));
      return;
    }

    setCustomEndDate(date);
    setDraftRange(createCustomRange(customStartDate, date));
  }

  function moveMonth(direction: -1 | 1) {
    setViewDate((current) => {
      const nextDate = new Date(current);
      nextDate.setMonth(nextDate.getMonth() + direction);
      return nextDate;
    });
  }

  function applyRange() {
    if (!canApply) {
      return;
    }

    if (draftRange.preset === 'custom' && customStartDate && customEndDate) {
      onApply(createCustomRange(customStartDate, customEndDate));
      return;
    }

    onApply(draftRange);
  }

  function renderQuickChip(
    label: string,
    preset: Exclude<DateRangePreset, 'custom'>,
    isCompact = false
  ) {
    const isActive = draftRange.preset === preset;

    return (
      <Pressable
        key={preset}
        style={[
          styles.quickChip,
          isCompact && styles.quickChipCompact,
          isActive && styles.quickChipActive,
        ]}
        onPress={() => selectQuickRange(preset)}
      >
        <Text
          style={[
            styles.quickChipText,
            isCompact && styles.quickChipTextCompact,
            isActive && styles.quickChipTextActive,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>{translations.dateRange.choosePeriod}</Text>
              <Text style={styles.modalSubtitle}>{translations.dateRange.quickOrCustom}</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.quickRow}>
            {renderQuickChip(translations.dateRange.thisMonth, 'this_month')}
            {renderQuickChip(translations.dateRange.thisYear, 'this_year')}
          </View>

          {hasAvailableWeeks ? (
            <View style={styles.weeksSection}>
              <View style={styles.weeksHeader}>
                <Text style={styles.weeksTitle}>{translations.dateRange.weeksOfThisMonth}</Text>
              </View>
              <View style={styles.weekChipsRow}>
                {availableWeekPresets.map((preset) =>
                  renderQuickChip(getWeekLabel(preset), preset, true)
                )}
              </View>
            </View>
          ) : null}

          <View style={styles.customHeader}>
            <Text style={styles.customTitle}>{translations.dateRange.customRange}</Text>
            <Text style={styles.customHint}>{translations.dateRange.customHint}</Text>
          </View>

          <View style={styles.monthRow}>
            <Pressable style={styles.monthButton} onPress={() => moveMonth(-1)}>
              <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            </Pressable>
            <Text style={styles.monthTitle}>{formatMonthTitle(viewDate)}</Text>
            <Pressable style={styles.monthButton} onPress={() => moveMonth(1)}>
              <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.weekdayGrid}>
            {WEEKDAYS.map((weekday, index) => (
              <Text key={`${weekday}-${index}`} style={styles.weekdayText}>
                {weekday}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendarDays.map((day) => {
              const isStart =
                customStartDate != null && isSameCalendarDay(day.date, customStartDate);
              const isEnd =
                customEndDate != null && isSameCalendarDay(day.date, customEndDate);
              const isInRange = isDateBetween(day.date, customStartDate, customEndDate);
              const isSelected = isStart || isEnd;

              return (
                <Pressable
                  key={day.key}
                  style={[
                    styles.dayCell,
                    isInRange && styles.dayCellInRange,
                    isSelected && styles.dayCellSelected,
                  ]}
                  onPress={() => selectCustomDate(day.date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !day.isCurrentMonth && styles.dayTextMuted,
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {day.date.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.modalActions}>
            <Pressable style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelText}>{translations.dateRange.cancel}</Text>
            </Pressable>
            <Pressable
              style={[styles.modalSaveButton, !canApply && styles.modalSaveButtonDisabled]}
              onPress={applyRange}
            >
              <Text style={styles.modalSaveText}>{translations.dateRange.apply}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.panelBorder,
    padding: 18,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  weeksSection: {
    gap: 6,
  },
  weeksHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  weeksTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  weekChipsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  quickChip: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.cardBackground,
  },
  quickChipCompact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickChipActive: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.accentPrimarySoft,
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  quickChipTextCompact: {
    fontSize: 12,
  },
  quickChipTextActive: {
    color: colors.accentPrimary,
  },
  customHeader: {
    gap: 2,
  },
  customTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  customHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.accentPrimarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  weekdayGrid: {
    flexDirection: 'row',
  },
  weekdayText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellInRange: {
    backgroundColor: colors.accentPrimarySoft,
  },
  dayCellSelected: {
    backgroundColor: colors.accentPrimary,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dayTextMuted: {
    color: colors.borderInput,
  },
  dayTextSelected: {
    color: colors.cardBackground,
  },
  modalActions: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  modalCancelButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalSaveButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveButtonDisabled: {
    opacity: 0.45,
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.cardBackground,
  },
});
