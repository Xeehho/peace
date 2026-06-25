import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWars } from '@/hooks/useWars';
import { useCountries } from '@/hooks/useCountries';
import { useAppStore } from '@/stores/appStore';
import { formatYearRange, formatCasualties } from '@/utils/format';
import { generateAttireImageUrl } from '@/utils/image';
import { CallToAction } from '@/components/CallToAction';
import { AttireFigureCard } from '@/components/AttireFigureCard';

const CHINA_ID = 'china';
const ERA_WINDOW = 30; // years

function findContemporaryWars(wars: ReturnType<typeof useWars>['wars'], targetWar: typeof wars[0]) {
  const targetYear = targetWar.startYear;
  return wars.filter(
    (w) =>
      w.id !== targetWar.id &&
      !w.relatedCountryIds.includes(CHINA_ID) &&
      Math.abs(w.startYear - targetYear) <= ERA_WINDOW
  );
}

export default function Timeline() {
  const { wars, loading } = useWars();
  const { countries } = useCountries();
  const { setSelectedWar } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const countryMap = new Map(countries.map((c) => [c.id, c]));

  const chinaWars = wars
    .filter((w) => w.relatedCountryIds.includes(CHINA_ID))
    .sort((a, b) => a.startYear - b.startYear);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-archive-cream pt-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-archive-border border-t-archive-amber" />
          <p className="text-sm text-archive-muted">正在加载历史档案...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-archive-cream pt-16">
      <section className="px-6 pb-4 pt-12 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-archive-sage">
            Timeline
          </p>
          <h1 className="font-serif text-4xl font-medium text-archive-ink md:text-5xl">
            中国战争与世界
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-archive-muted md:text-base">
            当中国经历战火时，世界其他地区也发生着各自的冲突。横向拖动时间轴，看见同一时空下不同文明的命运交织。
          </p>
        </div>
      </section>

      <section className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-archive-border bg-white/90 shadow-soft backdrop-blur-md transition-colors hover:border-archive-amber hover:text-archive-amber"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-archive-border bg-white/90 shadow-soft backdrop-blur-md transition-colors hover:border-archive-amber hover:text-archive-amber"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex cursor-grab gap-8 overflow-x-auto px-8 pb-6 pt-4 active:cursor-grabbing md:px-16"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {chinaWars.map((chinaWar, idx) => {
            const contemporary = findContemporaryWars(wars, chinaWar);
            return (
              <motion.div
                key={chinaWar.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="flex-shrink-0 w-[360px] md:w-[420px]"
              >
                <div className="relative h-full rounded-2xl border border-archive-border bg-white p-6 shadow-soft">
                  <div className="absolute -top-3 left-6 rounded-full border border-archive-terracotta bg-archive-terracotta px-3 py-1 text-xs font-medium text-white">
                    {formatYearRange(chinaWar.startYear, chinaWar.endYear)}
                  </div>

                  <h2 className="mt-3 font-serif text-2xl text-archive-ink">
                    {chinaWar.name}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-archive-muted">
                    {chinaWar.background}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-archive-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {chinaWar.location}
                    </span>
                    <span className="rounded-full bg-archive-terracotta/10 px-2 py-0.5 text-archive-terracotta">
                      伤亡 {formatCasualties(chinaWar.casualties)}
                    </span>
                  </div>

                  {chinaWar.attires && chinaWar.attires.length > 0 && (
                    <div className="mt-5">
                      <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-archive-muted">
                        同时期着装
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {chinaWar.attires.slice(0, 2).map((attire, aIdx) => (
                          <AttireFigureCard
                            key={aIdx}
                            country={countryMap.get(attire.countryId)}
                            imageUrl={generateAttireImageUrl(
                              countryMap.get(attire.countryId)?.name ?? attire.countryId,
                              attire.caption ?? ''
                            )}
                            caption={attire.caption}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedWar(chinaWar.id)}
                    className="mt-5 w-full rounded-full border border-archive-amber py-2 text-sm text-archive-amber transition-colors hover:bg-archive-amber hover:text-white"
                  >
                    查看详情
                  </button>

                  {contemporary.length > 0 && (
                    <div className="mt-6 border-t border-archive-border pt-5">
                      <h3 className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-archive-muted">
                        <Clock className="h-3.5 w-3.5" />
                        同期世界战争
                      </h3>
                      <div className="space-y-3">
                        {contemporary.slice(0, 3).map((war) => (
                          <button
                            key={war.id}
                            onClick={() => setSelectedWar(war.id)}
                            className="w-full rounded border border-archive-border bg-archive-cream/60 p-3 text-left transition-colors hover:border-archive-amber/60"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-medium text-archive-ink">
                                {war.name}
                              </span>
                              <span className="shrink-0 font-mono text-xs text-archive-muted">
                                {war.startYear}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-archive-muted">
                              {war.background}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
