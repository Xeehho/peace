import { useRef } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Skull, Swords, Globe2, Hourglass } from 'lucide-react';
import { useWars } from '@/hooks/useWars';
import { useCountries } from '@/hooks/useCountries';
import { formatCasualties } from '@/utils/format';
import { useT } from '@/i18n/useT';
import type { Language } from '@/types';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  formatFn?: (v: number) => string;
  delay: number;
  lang: Language;
}

function AnimatedCounter({ value, formatFn, lang }: { value: number; formatFn?: (v: number) => string; lang: Language }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(formatFn ? formatFn(Math.round(latest)) : Math.round(latest).toLocaleString(lang === 'en' ? 'en-US' : 'zh-CN'));
      },
    });
    return controls.stop;
  }, [inView, value, motionValue, formatFn, lang]);

  return <span ref={ref}>{display}</span>;
}

function StatItem({ icon, value, label, formatFn, delay, lang }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-archive-border bg-white p-8 text-center shadow-soft transition-all hover:border-archive-amber/40 hover:shadow-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-archive-amber/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-archive-cream text-archive-terracotta transition-colors group-hover:bg-archive-terracotta group-hover:text-white">
        {icon}
      </div>
      <div className="font-mono text-4xl font-bold text-archive-ink md:text-5xl">
        <AnimatedCounter value={value} formatFn={formatFn} lang={lang} />
      </div>
      <p className="mt-2 text-sm text-archive-muted">{label}</p>
    </motion.div>
  );
}

export function StatsSection() {
  const { wars } = useWars();
  const { countries } = useCountries();
  const { t, lang } = useT();

  const totalCasualties = wars.reduce((sum, w) => sum + w.casualties, 0);
  const yearSpan = wars.length > 0
    ? Math.max(...wars.map((w) => w.endYear ?? w.startYear)) - Math.min(...wars.map((w) => w.startYear))
    : 0;

  return (
    <section className="relative overflow-hidden bg-transparent px-6 py-20">
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
            {t('stats.badge')}
          </p>
          <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
            {t('stats.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-archive-muted">
            {t('stats.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          <StatItem
            icon={<Swords className="h-6 w-6" />}
            value={wars.length}
            label={t('stats.recordedWars')}
            delay={0}
            lang={lang}
          />
          <StatItem
            icon={<Skull className="h-6 w-6" />}
            value={totalCasualties}
            label={t('stats.totalCasualties')}
            formatFn={(v) => formatCasualties(v, lang)}
            delay={0.1}
            lang={lang}
          />
          <StatItem
            icon={<Globe2 className="h-6 w-6" />}
            value={countries.length}
            label={t('stats.involvedCountries')}
            delay={0.2}
            lang={lang}
          />
          <StatItem
            icon={<Hourglass className="h-6 w-6" />}
            value={yearSpan}
            label={t('stats.yearSpan')}
            delay={0.3}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
}
