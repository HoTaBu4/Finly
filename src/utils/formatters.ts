import { translations } from '../translations';

type FormatMoneyOptions = {
  locale?: string;
  maximumFractionDigits?: number;
  suffix?: string;
};

type FormatDateOptions = {
  locale?: string;
  fallback?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
};

export function formatMoney(
  value: number,
  {
    locale = translations.formatting.locale,
    maximumFractionDigits = 0,
    suffix = ' $',
  }: FormatMoneyOptions = {}
) {
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);

  return `${formatted}${suffix}`;
}

export function formatDate(
  value: string | Date,
  {
    locale = translations.formatting.locale,
    fallback = '',
    formatOptions = {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    },
  }: FormatDateOptions = {}
) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

export function formatMonth(
  year: number,
  month: number,
  locale = translations.formatting.locale
) {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
  }).format(new Date(year, month, 1));
}
