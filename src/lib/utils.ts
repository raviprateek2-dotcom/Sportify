import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  currency: 'USD' | 'GBP' | 'EUR' | 'JPY' = 'USD'
): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  const currencyMap: Record<string, { locale: string; currency: string }> = {
    USD: { locale: 'en-US', currency: 'USD' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    JPY: { locale: 'ja-JP', currency: 'JPY' },
  };

  const config = currencyMap[currency] || currencyMap.USD;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(numericPrice);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}
