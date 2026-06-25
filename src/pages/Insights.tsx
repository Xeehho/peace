import { useEffect, useMemo, useRef, useState } from 'react';
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

// 时代划分：古代 / 中世纪 / 近代 / 现代
const ERAS = [
  {
    key: 'ancient',
    label: '古代',
    subtitle: '公元前 — 476',
    min: -Infinity,
    max: 476,
    from: '#7A8B7A',
    to: '#A6B2A6',
  },
  {
    key: 'medieval',
    label: '中世纪',
    subtitle: '476 — 1453',
    min: 476,
    max: 1453,
    from: '#C88A3D',
    to: '#E0AB5C',
  },
  {
    key: 'early-modern',
    label: '近代',
    subtitle: '1453 — 1900',
    min: 1453,
    max: 1900,
    from: '#B85C4F',
    to: '#D17A6E',
  },
  {
    key: 'contemporary',
    label: '现代',
    subtitle: '1900 — 至今',
    min: 1900,
    max: Infinity,
    from: '#3A3A3A',
    to: '#6B6B6B',
  },
];

const formatPlain = (n: number) => n.toLocaleString('zh-CN');
const formatCasualty = (n: number) => formatCasualties(n);

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

export default function Insights() {
  const { wars, loading } = useWars();
  const { countries } = useCountries();

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
  }, [wars]);

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
          <p className="text-sm text-archive-muted">正在加载数据洞察...</p>
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
      label: '记录战争总数',
      value: stats.totalWars,
      format: formatPlain,
      accent: '#B85C4F',
    },
    {
      icon: Skull,
      label: '累计伤亡人数',
      value: stats.totalCasualties,
      format: formatCasualty,
      accent: '#C88A3D',
    },
    {
      icon: Globe,
      label: '涉及国家数',
      value: stats.involvedCountries,
      format: formatPlain,
      accent: '#7A8B7A',
    },
    {
      icon: CalendarDays,
      label: '跨越年数',
      value: stats.yearSpan,
      format: formatPlain,
      accent: '#1F1F1F',
    },
  ];

  return (
    <main className="min-h-screen bg-archive-cream pt-16">
      {/* 页面标题区 */}
      <section className="px-6 pb-10 pt-12 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
            Insights
          </p>
          <h1 className="font-serif text-4xl font-medium text-archive-ink md:text-5xl">
            数据洞察
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
            每一个数字背后，都是一段无法挽回的生命记忆。透过数据的棱镜，我们重新审视人类冲突的规模与代价。
          </p>
        </div>
      </section>

      {/* 核心统计数字 */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
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
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-archive-terracotta" />
            <h2 className="font-serif text-2xl font-medium text-archive-ink md:text-3xl">
              伤亡人数时代趋势
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-archive-muted">
            按时代分组统计累计伤亡，观察人类冲突规模随文明演进的变迁。
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
                        {formatCasualties(era.casualties)} · {era.count} 场
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
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-archive-terracotta" />
            <h2 className="font-serif text-2xl font-medium text-archive-ink md:text-3xl">
              伤亡最惨重的战争 TOP 10
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-archive-muted">
            按伤亡人数排序，十场代价最为沉重的战争，每一场都改写了历史的走向。
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
                    title={war.name}
                  >
                    {war.name}
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
                        {formatCasualties(war.casualties)}
                      </span>
                    </motion.div>
                  </div>
                  <span className="w-16 shrink-0 text-right font-mono text-xs font-medium text-archive-terracotta">
                    {formatCasualties(war.casualties)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 国家参与战争热度 */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <Users className="h-4 w-4 text-archive-terracotta" />
            <h2 className="font-serif text-2xl font-medium text-archive-ink md:text-3xl">
              国家参与战争热度
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-archive-muted">
            按参与战争数量排序的前 15 个国家，圆点大小代表参与程度。
          </p>
          <div className="rounded-2xl border border-archive-border bg-white p-6 shadow-soft md:p-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {countryParticipation.map((item, idx) => {
                const sizeRatio = item.count / maxParticipation;
                const dotSize = 12 + sizeRatio * 28;
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
                      <div
                        className="rounded-full"
                        style={{
                          width: `${dotSize}px`,
                          height: `${dotSize}px`,
                          background:
                            'radial-gradient(circle at 30% 30%, #C88A3D, #B85C4F)',
                          boxShadow: '0 0 12px rgba(184, 92, 79, 0.3)',
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-archive-ink">
                        {item.country.name}
                      </p>
                      <p className="text-[10px] text-archive-muted">
                        {item.country.nameEn}
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
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mb-6 h-px w-16 bg-archive-border" />
            <Award className="mx-auto mb-6 h-8 w-8 text-archive-sage" />
            <p className="font-serif text-xl font-medium leading-relaxed text-archive-ink md:text-2xl">
              当我们把战争的代价折算成数字，
              <br />
              看到的不是冷峻的统计，而是无数个未及告别的人生。
            </p>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-archive-muted">
              每一次冲突都在历史的岩层上留下裂痕。愿这些数字不仅记录过去，更能提醒未来——
              和平从来不是理所当然，它是每一代人都必须守护的承诺。
            </p>
          </motion.div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
