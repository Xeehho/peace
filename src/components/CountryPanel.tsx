import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, Skull, Swords } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useCountries } from '@/hooks/useCountries';
import { useWars } from '@/hooks/useWars';
import { formatCasualties, formatYearRange } from '@/utils/format';
import { useT, localized } from '@/i18n/useT';

export function CountryPanel() {
  const { selectedCountryId, selectedWarId, setSelectedWar } = useAppStore();
  const { countries } = useCountries();
  const { wars } = useWars();
  const { t, lang } = useT();

  const country = countries.find((c) => c.id === selectedCountryId);
  const countryWars = wars.filter(
    (w) => country && w.relatedCountryIds.includes(country.id)
  );

  // Hide country panel when war drawer is open (war drawer slides over it)
  const visible = country && !selectedWarId;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 180 }}
          className="fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-full max-w-md border-l border-archive-border bg-archive-glass shadow-soft backdrop-blur-xl"
        >
          <div className="flex h-full flex-col p-6">
            <div className="mb-6 border-b border-archive-border pb-6">
              <h2 className="font-serif text-3xl text-archive-ink">{localized(country, 'name', lang)}</h2>
              <p className="mt-1 text-sm uppercase tracking-widest text-archive-amber">
                {country.nameEn}
              </p>
              <p className="mt-4 leading-relaxed text-archive-muted">
                {localized(country, 'description', lang)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded border border-archive-border bg-white/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-archive-muted">
                    <Swords className="h-3.5 w-3.5" />
                    <span>{t('countryPanel.involvedWars')}</span>
                  </div>
                  <p className="mt-1 font-mono text-2xl text-archive-amber">
                    {country.totalWars}
                  </p>
                </div>
                <div className="rounded border border-archive-border bg-white/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-archive-muted">
                    <Skull className="h-3.5 w-3.5" />
                    <span>{t('countryPanel.totalCasualties')}</span>
                  </div>
                  <p className="mt-1 font-mono text-2xl text-archive-terracotta">
                    {formatCasualties(country.estimatedCasualties, lang)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <h3 className="mb-4 flex items-center gap-2 font-serif text-lg text-archive-ink">
                <ScrollText className="h-4 w-4 text-archive-amber" />
                {t('countryPanel.warRecords')}
              </h3>
              <div className="space-y-3">
                {countryWars.length === 0 && (
                  <p className="text-sm text-archive-muted">{t('countryPanel.noRecords')}</p>
                )}
                {countryWars.map((war) => (
                  <button
                    key={war.id}
                    onClick={() => setSelectedWar(war.id)}
                    className="w-full rounded border border-archive-border bg-white/60 p-4 text-left transition-all hover:border-archive-amber/60 hover:bg-white/90"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-serif text-archive-ink">{localized(war, 'name', lang)}</h4>
                      <span className="shrink-0 font-mono text-xs text-archive-muted">
                        {formatYearRange(war.startYear, war.endYear, lang)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-archive-muted">
                      {localized(war, 'background', lang)}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-archive-muted">
                      <span>{t('countryPanel.casualties')} {formatCasualties(war.casualties, lang)}</span>
                      <span>{localized(war, 'location', lang)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
