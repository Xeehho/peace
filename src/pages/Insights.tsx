import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, animate, useInView } from 'framer-motion';
import {
  Skull,
  Globe,
  Swords,
  CalendarDays,
  TrendingUp,
  BarChart3,
  Users,
  Award,
} from 'lucide-react';
import { useWars } from '@/hooks/useWars';
import { useCountries } from '@/hooks/useCountries';
import { formatCasualties } from '@/utils/format';
import { CallToAction } from '@/components/CallToAction';
import { useT, localized } from '@/i18n/useT';
import { PageBackground } from '@/components/PageBackground';

interface AnimatedCounterProps {
  value: number;
  format: (n: number) => string;
}

function AnimatedCounter({ value, format }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(format(0));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(format(Math.round(latest)));
      },
    });
    return () => controls.stop();
  }, [inView, value, format, count]);

  return <span ref={ref}>{display}</span>;
}

// 国家 id → ISO 3166-1 alpha-2 代码，用于 flagcdn 国旗图片
const COUNTRY_FLAG_CODE: Record<string, string> = {
  china: 'cn', usa: 'us', uk: 'gb', germany: 'de', france: 'fr',
  russia: 'ru', japan: 'jp', italy: 'it', egypt: 'eg', greece: 'gr',
  india: 'in', mongolia: 'mn', afghanistan: 'af', iraq: 'iq', iran: 'ir',
  ukraine: 'ua', israel: 'il', vietnam: 'vn', korea: 'kr', spain: 'es',
  turkey: 'tr', cuba: 'cu', rwanda: 'rw', serbia: 'rs', yemen: 'ye',
  canada: 'ca', australia: 'au',
};

function flagUrl(countryId: string, size = 80): string {
  const code = COUNTRY_FLAG_CODE[countryId];
  return code ? `https://flagcdn.com/w${size}/${code}.png` : '';
}

export default function Insights() {
  const { wars, loading } = useWars();
  const { countries } = useCountries();
  const { t, lang } = useT();

  // 时代划分：古代 / 中世纪 / 近代 / 现代（label/subtitle 走 i18n，颜色保持不变）
  const ERAS = useMemo(
    () => [
      {
        key: 'ancient',
        label: t('insights.eras.ancient.label'),
        subtitle: t('insights.eras.ancient.subtitle'),
        min: -Infinity,
        max: 476,
        from: '#7A8B7A',
        to: '#A6B2A6',
      },
      {
        key: 'medieval',
        label: t('insights.eras.medieval.label'),
        subtitle: t('insights.eras.medieval.subtitle'),
        min: 476,
        max: 1453,
        from: '#C88A3D',
        to: '#E0AB5C',
      },
      {
        key: 'early-modern',
        label: t('insights.eras.earlyModern.label'),
        subtitle: t('insights.eras.earlyModern.subtitle'),
        min: 1453,
        max: 1900,
        from: '#B85C4F',
        to: '#D17A6E',
      },
      {
        key: 'contemporary',
        label: t('insights.eras.contemporary.label'),
        subtitle: t('insights.eras.contemporary.subtitle'),
        min: 1900,
        max: Infinity,
        from: '#3A3A3A',
        to: '#6B6B6B',
      },
    ],
    [t]
  );

  const formatPlain = useCallback(
    (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'zh-CN'),
    [lang]
  );
  const formatCasualty = useCallback(
    (n: number) => formatCasualties(n, lang),
    [lang]
  );

  // 核心统计
  const stats = useMemo(() => {
    const totalWars = wars.length;
    const totalCasualties = wars.reduce((sum, w) => sum + w.casualties, 0);
    const countrySet = new Set<string>();
    wars.forEach((w) => w.relatedCountryIds.forEach((id) => countrySet.add(id)));
    const involvedCountries = countrySet.size;
    const years = wars.flatMap((w) => [w.startYear, w.endYear ?? w.startYear]);
    const minYear = years.length ? Math.min(...years) : 0;
    const maxYear = years.length ? Math.max(...years) : 0;
    const yearSpan = maxYear - minYear;
    return { totalWars, totalCasualties, involvedCountries, yearSpan, minYear, maxYear };
  }, [wars]);

  // 时代伤亡统计
  const eraStats = useMemo(() => {
    return ERAS.map((era) => {
      const eraWars = wars.filter((w) => w.startYear >= era.min && w.startYear < era.max);
      const casualties = eraWars.reduce((sum, w) => sum + w.casualties, 0);
      return { ...era, count: eraWars.length, casualties };
    });
  }, [wars, ERAS]);

  // 伤亡 TOP 10
  const topWars = useMemo(() => {
    return [...wars].sort((a, b) => b.casualties - a.casualties).slice(0, 10);
  }, [wars]);

  // 国家参与热度
  const countryParticipation = useMemo(() => {
    const map = new Map<string, number>();
    wars.forEach((w) => {
      w.relatedCountryIds.forEach((id) => {
        map.set(id, (map.get(id) ?? 0) + 1);
      });
    });
    const countryMap = new Map(countries.map((c) => [c.id, c]));
    return Array.from(map.entries())
      .map(([id, count]) => ({ country: countryMap.get(id), count }))
      .filter(
        (item): item is { country: NonNullable<typeof item.country>; count: number } =>
          Boolean(item.country)
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [wars, countries]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-archive-cream pt-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-archive-border border-t-archive-amber" />
          <p className="text-sm text-archive-muted">{t('insights.loading')}</p>
        </div>
      </div>
    );
  }

  const maxEraCasualties = Math.max(...eraStats.map((e) => e.casualties), 1);
  const maxTopCasualties = Math.max(...topWars.map((w) => w.casualties), 1);
  const maxParticipation = Math.max(...countryParticipation.map((c) => c.count), 1);

  const statCards = [
    {
      icon: Swords,
      label: t('insights.statTotalWars'),
      value: stats.totalWars,
      format: formatPlain,
      accent: '#B85C4F',
    },
    {
      icon: Skull,
      label: t('insights.statTotalCasualties'),
      value: stats.totalCasualties,
      format: formatCasualty,
      accent: '#C88A3D',
    },
    {
      icon: Globe,
      label: t('insights.statInvolvedCountries'),
      value: stats.involvedCountries,
      format: formatPlain,
      accent: '#7A8B7A',
    },
    {
      icon: CalendarDays,
      label: t('insights.statYearSpan'),
      value: stats.yearSpan,
      format: formatPlain,
      accent: '#1F1F1F',
    },
  ];

  return (
    <main className="min-h-screen bg-archive-cream pt-16">
      {/* 页面标题区 */}
      <section className="relative overflow-hidden px-6 pb-10 pt-12 md:pt-16">
        <PageBackground variant="hero" instance={0} />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
            {t('insights.badge')}
          </p>
          <h1 className="font-serif text-4xl font-medium text-archive-ink md:text-5xl">
            {t('insights.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
            {t('insights.subtitle')}
          </p>
        </div>
      </section>

      {/* 核心统计数字 */}
      <section className="relative overflow-hidden px-6 pb-16">
        <PageBackground variant="stats" instance={1} />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-2xl border border-archive-border bg-white p-6 shadow-soft"
                >
                  <div
                    className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10"
                    style={{ backgroundColor: card.accent }}
                  />
                  <div className="relative">
                    <Icon className="h-5 w-5" style={{ color: card.accent }} />
                    <div className="mt-4 font-serif text-4xl font-semibold text-archive-ink md:text-5xl">
                      <AnimatedCounter value={card.value} format={card.format} />
                    </div>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wider text-archive-muted">
                      {card.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 伤亡人数时代趋势图 */}
      <section className="relative overflow-hidden px-6 pb-16">
        <PageBackground variant="insights" instance={0} />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-archive-terracotta" />
            <h2 className="font-serif text-2xl font-medium text-archive-ink md:text-3xl">
              {t('insights.eraTrendTitle')}
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-archive-muted">
            {t('insights.eraTrendSubtitle')}
          </p>
          <div className="rounded-2xl border border-archive-border bg-white p-6 shadow-soft md:p-8">
            <div className="flex items-end justify-around gap-4">
              {eraStats.map((era, idx) => {
                const heightPct = (era.casualties / maxEraCasualties) * 85;
                return (
                  <div
                    key={era.key}
                    className="group flex flex-1 flex-col items-center"
                  >
                    <div className="relative flex h-64 w-full items-end justify-center md:h-72">
                      {/* 网格线 */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="border-t border-dashed border-archive-border/50"
                          />
                        ))}
                      </div>
                      {/* 悬浮提示 */}
                      <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-archive-border bg-archive-ink px-2.5 py-1 text-[11px] text-white opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100">
                        {t('insights.eraTooltip', formatCasualties(era.casualties, lang), era.count)}
                      </div>
                      {/* 柱子 */}
                      <motion.div
                        initial={{ height: '0%' }}
                        whileInView={{ height: `${heightPct}%` }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{
                          duration: 0.9,
                          delay: idx * 0.15,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative w-full max-w-[72px] rounded-t-lg transition-transform duration-300 group-hover:scale-[1.03]"
                        style={{
                          background: `linear-gradient(180deg, ${era.to} 0%, ${era.from} 100%)`,
                        }}
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="font-serif text-sm font-medium text-archive-ink">
                        {era.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-archive-muted">{era.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 伤亡最惨重的战争 TOP 10 */}
      <section className="relative overflow-hidden px-6 pb-16">
        <PageBackground variant="warArchive" instance={1} />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-archive-terracotta" />
            <h2 className="font-serif text-2xl font-medium text-archive-ink md:text-3xl">
              {t('insights.topWarsTitle')}
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-archive-muted">
            {t('insights.topWarsSubtitle')}
          </p>
          <div className="space-y-3 rounded-2xl border border-archive-border bg-white p-6 shadow-soft md:p-8">
            {topWars.map((war, idx) => {
              const widthPct = (war.casualties / maxTopCasualties) * 100;
              return (
                <div key={war.id} className="group flex items-center gap-3">
                  <span className="w-5 shrink-0 text-right font-mono text-xs font-medium text-archive-muted">
                    {idx + 1}
                  </span>
                  <span
                    className="w-28 shrink-0 truncate text-xs font-medium text-archive-ink md:w-44 md:text-sm"
                    title={localized(war, 'name', lang)}
                  >
                    {localized(war, 'name', lang)}
                  </span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-archive-border/40">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: `${widthPct}%` }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{
                        duration: 0.9,
                        delay: idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex h-full items-center justify-end rounded-md px-2"
                      style={{
                        background: 'linear-gradient(90deg, #B85C4F 0%, #C88A3D 100%)',
                      }}
                    >
                      <span className="whitespace-nowrap font-mono text-[10px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {formatCasualties(war.casualties, lang)}
                      </span>
                    </motion.div>
                  </div>
                  <span className="w-16 shrink-0 text-right font-mono text-xs font-medium text-archive-terracotta">
                    {formatCasualties(war.casualties, lang)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 国家参与战争热度 */}
      <section className="relative overflow-hidden px-6 pb-16">
        <PageBackground variant="insights" instance={1} />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <Users className="h-4 w-4 text-archive-terracotta" />
            <h2 className="font-serif text-2xl font-medium text-archive-ink md:text-3xl">
              {t('insights.participationTitle')}
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-archive-muted">
            {t('insights.participationSubtitle')}
          </p>
          <div className="rounded-2xl border border-archive-border bg-white p-6 shadow-soft md:p-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {countryParticipation.map((item, idx) => {
                const sizeRatio = item.count / maxParticipation;
                const flagSize = 18 + sizeRatio * 22;
                const flag = flagUrl(item.country.id, 80);
                return (
                  <motion.div
                    key={item.country.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center gap-3 rounded-xl border border-archive-border/60 bg-archive-cream/40 p-3 transition-colors hover:border-archive-amber/50"
                  >
                    <div className="flex w-12 shrink-0 items-center justify-center">
                      {flag ? (
                        <img
                          src={flag}
                          alt={localized(item.country, 'name', lang)}
                          loading="lazy"
                          className="rounded-sm object-cover shadow-sm"
                          style={{
                            width: `${flagSize}px`,
                            height: `${flagSize * 0.7}px`,
                            boxShadow: `0 0 ${6 + sizeRatio * 10}px rgba(200, 138, 61, ${0.2 + sizeRatio * 0.35})`,
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-full"
                          style={{
                            width: `${flagSize}px`,
                            height: `${flagSize}px`,
                            background:
                              'radial-gradient(circle at 30% 30%, #C88A3D, #B85C4F)',
                            boxShadow: '0 0 12px rgba(184, 92, 79, 0.3)',
                          }}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-archive-ink">
                        {localized(item.country, 'name', lang)}
                      </p>
                      <p className="text-[10px] text-archive-muted">
                        {localized(item.country, 'name', lang === 'en' ? 'zh' : 'en')}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-semibold text-archive-terracotta">
                      {item.count}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 反思语 */}
      <section className="relative overflow-hidden px-6 pb-20">
        <PageBackground variant="cta" instance={1} />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mb-6 h-px w-16 bg-archive-border" />
            <Award className="mx-auto mb-6 h-8 w-8 text-archive-sage" />
            <p className="font-serif text-xl font-medium leading-relaxed text-archive-ink md:text-2xl">
              {t('insights.reflection1a')}
              <br />
              {t('insights.reflection1b')}
            </p>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-archive-muted">
              {t('insights.reflection2')}
            </p>
          </motion.div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
