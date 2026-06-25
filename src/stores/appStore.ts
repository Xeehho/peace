import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '@/types';

const STORAGE_KEY = 'war-archive-lang';

// 读取本地存储的语言偏好，默认中文
function getInitialLanguage(): 'zh' | 'en' {
  if (typeof window === 'undefined') return 'zh';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCountryId: null,
      selectedWarId: null,
      viewMode: 'global',
      timeRange: [-500, 2025],
      hoveredCountryId: null,
      language: getInitialLanguage(),
      setSelectedCountry: (id) =>
        set({
          selectedCountryId: id,
          viewMode: id ? 'country' : 'global',
        }),
      setSelectedWar: (id) => set({ selectedWarId: id }),
      setViewMode: (mode) =>
        set({
          viewMode: mode,
          selectedCountryId: mode === 'global' ? null : null,
        }),
      setTimeRange: (range) => set({ timeRange: range }),
      setHoveredCountry: (id) => set({ hoveredCountryId: id }),
      setLanguage: (lang) => {
        try {
          localStorage.setItem(STORAGE_KEY, lang);
        } catch {
          /* ignore */
        }
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
        }
        set({ language: lang });
      },
      resetToGlobal: () =>
        set({
          selectedCountryId: null,
          selectedWarId: null,
          viewMode: 'global',
        }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ language: state.language }) as AppState,
    }
  )
);
