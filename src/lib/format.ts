import type { CurrencyCode } from '@shared/domain';

/** Locale used to format each currency (INR uses lakh/crore grouping). */
const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'en-IE',
  GBP: 'en-GB',
  AED: 'en-AE',
  SGD: 'en-SG',
};

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: CurrencyCode, compact: boolean): Intl.NumberFormat {
  const key = `${currency}:${String(compact)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
      style: 'currency',
      currency,
      maximumFractionDigits: compact ? 1 : 0,
      notation: compact ? 'compact' : 'standard',
    });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Formats an amount in whole currency units, e.g. `₹18,00,000`.
 * Pass `compact` for short labels such as chart axes (`₹18L`).
 */
export function formatCurrency(amount: number, currency: CurrencyCode, compact = false): string {
  return getFormatter(currency, compact).format(amount);
}

/** Returns the symbol for a currency, e.g. `₹`. */
export function currencySymbol(currency: CurrencyCode): string {
  const part = getFormatter(currency, false)
    .formatToParts(0)
    .find((p) => p.type === 'currency');
  return part?.value ?? currency;
}

/** Formats a 0–1 ratio as a whole percentage, e.g. `0.426` → `43%`. */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

/** Returns `singular` or `plural` (default `singular + "s"`) for `count`. */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString('en-IN')} ${count === 1 ? singular : plural}`;
}
