export interface Country {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lon: number;
  description: string;
  totalWars: number;
  estimatedCasualties: number;
}

export interface Figure {
  name: string;
  description: string;
}

export interface AttireItem {
  countryId: string;
  imageUrl: string;
  caption?: string;
}

export interface War {
  id: string;
  name: string;
  startYear: number;
  endYear?: number;
  location: string;
  belligerents: string[];
  casualties: number;
  background: string;
  relatedCountryIds: string[];
  figures?: Figure[];
  attires?: AttireItem[];
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  role: string;
  year: number;
  context: string;
}

export type ViewMode = 'global' | 'country';

export interface AppState {
  selectedCountryId: string | null;
  selectedWarId: string | null;
  viewMode: ViewMode;
  timeRange: [number, number];
  hoveredCountryId: string | null;
  setSelectedCountry: (id: string | null) => void;
  setSelectedWar: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setTimeRange: (range: [number, number]) => void;
  setHoveredCountry: (id: string | null) => void;
  resetToGlobal: () => void;
}
