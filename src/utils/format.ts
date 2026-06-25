import type { Language } from '@/types';
import { resolveT } from '@/i18n/translations';

/**
 * 格式化年份。lang 缺省为 'zh'。
 */
export function formatYear(year: number, lang: Language = 'zh'): string {
  if (year < 0) {
    return resolveT(lang, 'format.bc', Math.abs(year));
  }
  return resolveT(lang, 'format.ad', year);
}

/**
 * 格式化年份区间。lang 缺省为 'zh'。
 */
export function formatYearRange(startYear: number, endYear?: number, lang: Language = 'zh'): string {
  const start = formatYear(startYear, lang);
  if (!endYear) return start;
  return `${start} — ${formatYear(endYear, lang)}`;
}

/**
 * 格式化伤亡人数。中英文使用不同的量级阈值。
 * - 中文：>=1 亿 用"亿"，>=1 万 用"万"，否则千分位
 * - 英文：>=1B 用 B，>=1M 用 M，>=1K 用 K，否则千分位
 */
export function formatCasualties(value: number, lang: Language = 'zh'): string {
  if (lang === 'en') {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString('en-US');
  }
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(1)} 亿`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(0)} 万`;
  return value.toLocaleString('zh-CN');
}
