export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatSize(size: number): string {
  return new Intl.NumberFormat('en-US').format(size);
}

export function formatPriceOrFallback(price?: number | null, fallback = 'Not available'): string {
  return typeof price === 'number' ? formatPrice(price) : fallback;
}

export function formatPercent(value?: number | null, fallback = 'Not available'): string {
  return typeof value === 'number' ? `${value}%` : fallback;
}
