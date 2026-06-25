import { useAppStore } from '@/stores/appStore';
import { resolveT } from './translations';
import type { Language } from '@/types';

/**
 * 国际化 hook：返回 t 函数与当前语言。
 * 用法：
 *   const { t, lang } = useT();
 *   t('nav.home')                       // 简单文案
 *   t('insights.eraTooltip', c, n)      // 函数型文案，第二个参数起为函数入参
 */
export function useT() {
  const language = useAppStore((s) => s.language);
  const t = (path: string, ...args: unknown[]) => resolveT(language, path, ...args);
  return { t, lang: language };
}

/**
 * 从数据对象上取本地化字段：英文模式优先取 `${key}En`，缺失时回退到中文。
 * 例如 localized(war, 'name', lang) => war.nameEn ?? war.name
 */
export function localized<T>(
  obj: T,
  key: keyof T & string,
  lang: Language
): string {
  const rec = obj as unknown as Record<string, unknown>;
  if (lang === 'en') {
    const enKey = `${key}En`;
    const v = rec[enKey];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  const base = rec[key];
  return typeof base === 'string' ? base : '';
}

/**
 * 取本地化数组（用于 belligerents 等数组字段）。
 */
export function localizedArray<T>(
  obj: T,
  key: keyof T & string,
  lang: Language
): string[] {
  const rec = obj as unknown as Record<string, unknown>;
  if (lang === 'en') {
    const enKey = `${key}En`;
    const v = rec[enKey];
    if (Array.isArray(v) && v.length > 0) return v as string[];
  }
  const base = rec[key];
  return Array.isArray(base) ? (base as string[]) : [];
}
