export interface Country {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lon: number;
  description: string;
  descriptionEn?: string;
  totalWars: number;
  estimatedCasualties: number;
}

export interface Figure {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
}

export interface AttireItem {
  countryId: string;
  imageUrl: string;
  caption?: string;
  captionEn?: string;
}

export interface War {
  id: string;
  name: string;
  nameEn?: string;
  startYear: number;
  endYear?: number;
  location: string;
  locationEn?: string;
  belligerents: string[];
  belligerentsEn?: string[];
  casualties: number;
  background: string;
  backgroundEn?: string;
  relatedCountryIds: string[];
  figures?: Figure[];
  attires?: AttireItem[];
}

export interface Quote {
  id: string;
  quote: string;
  quoteEn?: string;
  author: string;
  authorEn?: string;
  role: string;
  roleEn?: string;
  year: number;
  context: string;
  contextEn?: string;
}

export type ViewMode = 'global' | 'country';
export type Language = 'zh' | 'en';

export interface AppState {
  selectedCountryId: string | null;
  selectedWarId: string | null;
  viewMode: ViewMode;
  timeRange: [number, number];
  hoveredCountryId: string | null;
  language: Language;
  setSelectedCountry: (id: string | null) => void;
  setSelectedWar: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setTimeRange: (range: [number, number]) => void;
  setHoveredCountry: (id: string | null) => void;
  setLanguage: (lang: Language) => void;
  resetToGlobal: () => void;
}
