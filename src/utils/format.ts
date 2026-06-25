export function formatYear(year: number): string {
  if (year < 0) {
    return `公元前 ${Math.abs(year)} 年`;
  }
  return `${year} 年`;
}

export function formatYearRange(startYear: number, endYear?: number): string {
  const start = formatYear(startYear);
  if (!endYear) return start;
  return `${start} — ${formatYear(endYear)}`;
}

export function formatCasualties(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)} 亿`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)} 万`;
  }
  return value.toLocaleString('zh-CN');
}
