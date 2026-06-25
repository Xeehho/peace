import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Skull, Users, UserCircle2, Shirt, ArrowLeft, TrendingDown, Clock, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useCountries } from '@/hooks/useCountries';
import { useWars } from '@/hooks/useWars';
import { formatCasualties, formatYearRange, formatYear } from '@/utils/format';
import { generateAttireImageUrl } from '@/utils/image';
import { AttireFigureCard } from './AttireFigureCard';
import { useT, localized, localizedArray } from '@/i18n/useT';

export function WarModal() {
  const { selectedWarId, setSelectedWar, selectedCountryId } = useAppStore();
  const { wars } = useWars();
  const { countries } = useCountries();
  const { t, lang } = useT();

  const war = wars.find((w) => w.id === selectedWarId);
  const countryMap = new Map(countries.map((c) => [c.id, c]));

  // Determine if this drawer was opened from a country panel
  const fromCountryPanel = selectedCountryId !== null;

  const handleClose = () => {
    setSelectedWar(null);
  };

  const handleBack = () => {
    setSelectedWar(null);
  };

  // 计算战争持续年数
  const duration = war ? (war.endYear ?? war.startYear) - war.startYear : 0;

  // 计算伤亡占比（相对于所有战争）
  const totalCasualties = wars.reduce((sum, w) => sum + w.casualties, 0);
  const casualtyPercentage = war && totalCasualties > 0 ? (war.casualties / totalCasualties) * 100 : 0;

  return (
    <AnimatePresence>
      {war && (
        <>
          {/* Backdrop only when not overlapping country panel */}
          {!fromCountryPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-40 bg-archive-ink/20 backdrop-blur-sm"
            />
          )}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            className="fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-full max-w-lg overflow-y-auto border-l border-archive-border bg-white shadow-soft"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-archive-border bg-white/95 px-6 py-4 backdrop-blur-md">
              {fromCountryPanel ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-sm text-archive-muted transition-colors hover:text-archive-ink"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('warModal.backToCountry')}
                </button>
              ) : (
                <span className="text-xs font-medium uppercase tracking-widest text-archive-sage">
                  {t('warModal.warDetail')}
                </span>
              )}
              <button
                onClick={handleClose}
                className="rounded-full p-1.5 text-archive-muted transition-colors hover:bg-archive-border/50 hover:text-archive-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <h2 className="font-serif text-2xl text-archive-ink">{localized(war, 'name', lang)}</h2>
              <p className="mt-1 font-mono text-sm text-archive-amber">
                {formatYearRange(war.startYear, war.endYear, lang)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded border border-archive-border bg-archive-cream/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-archive-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t('warModal.location')}</span>
                  </div>
                  <p className="mt-1 text-sm text-archive-ink">{localized(war, 'location', lang)}</p>
                </div>
                <div className="rounded border border-archive-border bg-archive-cream/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-archive-muted">
                    <Skull className="h-3.5 w-3.5" />
                    <span>{t('warModal.casualties')}</span>
                  </div>
                  <p className="mt-1 font-mono text-lg text-archive-terracotta">
                    {formatCasualties(war.casualties, lang)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded border border-archive-border bg-archive-cream/60 p-4">
                <div className="flex items-center gap-2 text-xs text-archive-muted">
                  <Users className="h-3.5 w-3.5" />
                  <span>{t('warModal.belligerents')}</span>
                </div>
                <p className="mt-1 text-sm text-archive-ink">
                  {localizedArray(war, 'belligerents', lang).join(' vs ')}
                </p>
              </div>

              {/* 战争影响分析 */}
              <div className="mt-6">
                <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-archive-ink">
                  <TrendingDown className="h-4 w-4 text-archive-terracotta" />
                  {t('warModal.impact')}
                </h3>
                <div className="space-y-3">
                  {/* 持续时间 */}
                  <div className="flex items-center gap-3 rounded-lg border border-archive-border/60 bg-white p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-archive-cream text-archive-amber">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-archive-muted">{t('warModal.duration')}</p>
                      <p className="text-sm font-medium text-archive-ink">
                        {duration === 0 ? t('warModal.durationSameYear') : t('warModal.durationYears', duration)}
                      </p>
                    </div>
                  </div>

                  {/* 伤亡占比可视化 */}
                  <div className="rounded-lg border border-archive-border/60 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs text-archive-muted">{t('warModal.casualtyRatio')}</p>
                      <p className="font-mono text-sm font-medium text-archive-terracotta">
                        {casualtyPercentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-archive-cream">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(casualtyPercentage, 100)}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-archive-amber to-archive-terracotta"
                      />
                    </div>
                  </div>

                  {/* 涉及国家数 */}
                  <div className="flex items-center gap-3 rounded-lg border border-archive-border/60 bg-white p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-archive-cream text-archive-sage">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-archive-muted">{t('warModal.involvedCountries')}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {war.relatedCountryIds.map((cid) => {
                          const c = countryMap.get(cid);
                          return c ? (
                            <span key={cid} className="rounded-full bg-archive-cream px-2 py-0.5 text-[10px] font-medium text-archive-ink">
                              {localized(c, 'name', lang)}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 font-serif text-lg text-archive-ink">{t('warModal.background')}</h3>
                <p className="leading-relaxed text-archive-muted">
                  {localized(war, 'background', lang)}
                </p>
              </div>

              {/* 反思提示 */}
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-archive-amber/30 bg-archive-amber/5 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-archive-amber" />
                <p className="text-xs leading-relaxed text-archive-muted">
                  {formatCasualties(war.casualties, lang)} {t('warModal.reflection')}
                </p>
              </div>

              {war.figures && war.figures.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-archive-ink">
                    <UserCircle2 className="h-4 w-4 text-archive-amber" />
                    {t('warModal.figures')}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {war.figures.map((figure, idx) => (
                      <div
                        key={idx}
                        className="rounded border border-archive-border bg-archive-cream/60 p-3"
                      >
                        <p className="font-medium text-archive-ink">{localized(figure, 'name', lang)}</p>
                        <p className="mt-1 text-xs leading-relaxed text-archive-muted">
                          {localized(figure, 'description', lang)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {war.attires && war.attires.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-archive-ink">
                    <Shirt className="h-4 w-4 text-archive-amber" />
                    {t('warModal.attires')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {war.attires.map((attire, idx) => {
                      const country = countryMap.get(attire.countryId);
                      return (
                        <AttireFigureCard
                          key={idx}
                          country={country}
                          imageUrl={generateAttireImageUrl(
                            country?.name ?? attire.countryId,
                            attire.caption ?? ''
                          )}
                          caption={localized(attire, 'caption', lang)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
