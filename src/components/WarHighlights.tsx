import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Skull, ArrowRight, Calendar } from 'lucide-react';
import { useWars } from '@/hooks/useWars';
import { useCountries } from '@/hooks/useCountries';
import { formatCasualties, formatYearRange } from '@/utils/format';
import { useAppStore } from '@/stores/appStore';
import { useT, localized } from '@/i18n/useT';

export function WarHighlights() {
  const { wars } = useWars();
  const { countries } = useCountries();
  const { setSelectedWar } = useAppStore();
  const { t, lang } = useT();
  const countryMap = new Map(countries.map((c) => [c.id, c]));

  // 选取伤亡最惨重的 6 场战争
  const topWars = useMemo(
    () => [...wars].sort((a, b) => b.casualties - a.casualties).slice(0, 6),
    [wars]
  );

  return (
    <section className="relative bg-transparent px-6 py-20">
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              {t('highlights.badge')}
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              {t('highlights.title')}
            </h2>
          </div>
          <Link
            to="/timeline"
            className="hidden items-center gap-1.5 text-sm text-archive-terracotta transition-colors hover:text-archive-ink md:flex"
          >
            {t('highlights.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topWars.map((war, idx) => {
            const primaryCountry = countryMap.get(war.relatedCountryIds[0]);
            return (
              <motion.button
                key={war.id}
                onClick={() => setSelectedWar(war.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-archive-border bg-white p-6 text-left shadow-soft transition-all hover:border-archive-amber/40 hover:shadow-lg"
              >
                {/* 顶部装饰条 */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-archive-terracotta to-archive-amber opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-archive-cream px-2.5 py-1 font-mono text-[10px] font-medium text-archive-muted">
                    <Calendar className="h-3 w-3" />
                    {formatYearRange(war.startYear, war.endYear, lang)}
                  </span>
                  {primaryCountry && (
                    <span className="rounded-full bg-archive-amber/10 px-2.5 py-1 text-[10px] font-medium text-archive-amber">
                      {localized(primaryCountry, 'name', lang)}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl text-archive-ink transition-colors group-hover:text-archive-terracotta">
                  {localized(war, 'name', lang)}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-archive-muted">
                  {localized(war, 'background', lang)}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-archive-border/60 pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-archive-muted">
                    <Skull className="h-3.5 w-3.5 text-archive-terracotta" />
                    {t('highlights.casualties')} {formatCasualties(war.casualties, lang)}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-archive-terracotta opacity-0 transition-opacity group-hover:opacity-100">
                    {t('highlights.viewDetail')}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            to="/timeline"
            className="inline-flex items-center gap-1.5 text-sm text-archive-terracotta"
          >
            {t('highlights.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
