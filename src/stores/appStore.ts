import { create } from 'zustand';
import type { AppState } from '@/types';

export const useAppStore = create<AppState>((set) => ({
  selectedCountryId: null,
  selectedWarId: null,
  viewMode: 'global',
  timeRange: [-500, 2025],
  hoveredCountryId: null,
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
  resetToGlobal: () =>
    set({
      selectedCountryId: null,
      selectedWarId: null,
      viewMode: 'global',
    }),
}));
