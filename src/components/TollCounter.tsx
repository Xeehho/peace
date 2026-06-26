import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useWars } from '@/hooks/useWars';
import { formatCasualties } from '@/utils/format';
import { useT } from '@/i18n/useT';

// 伤亡量级里程碑：到达该数值时显示对应的描述
interface Milestone {
  threshold: number;
  key: 'milestone1' | 'milestone2' | 'milestone3' | 'milestone4' | 'milestone5';
}

const MILESTONES: Milestone[] = [
  { threshold: 50_000, key: 'milestone1' },
  { threshold: 500_000, key: 'milestone2' },
  { threshold: 1_000_000, key: 'milestone3' },
  { threshold: 10_000_000, key: 'milestone4' },
  { threshold: 100_000_000, key: 'milestone5' },
];

/**
 * 伤亡计数器：首页沉浸式数字滚动组件。
 *
 * 进入视口后，一个大数字从 0 缓慢攀升到总伤亡数（约 12 秒），
 * 每跨越一个量级（5万/50万/100万/1000万/1亿）短暂停顿并闪现描述文案，
 * 让用户在等待中感受数字的重量。完成后显示最终反思语。
 */
export function TollCounter() {
  const { wars } = useWars();
  const { t, lang } = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-120px' });

  const totalCasualties = wars.reduce((sum, w) => sum + w.casualties, 0);

  const [currentValue, setCurrentValue] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'counting' | 'done'>('idle');
  const [passedMilestones, setPassedMilestones] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!inView || phase !== 'idle') return;
    setPhase('counting');

    const duration = 12000; // 12 秒缓慢攀升
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // 缓动：先慢后快再慢，让量级跨越有节奏感
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const value = Math.round(eased * totalCasualties);
      setCurrentValue(value);

      // 检查是否跨越里程碑
      for (const ms of MILESTONES) {
        if (value >= ms.threshold && !passedMilestones.has(ms.threshold)) {
          passedMilestones.add(ms.threshold);
          setPassedMilestones(new Set(passedMilestones));
          setActiveMilestone(ms.key);
          // 里程碑文案显示 1.8 秒后消失
          window.setTimeout(() => setActiveMilestone((cur) => (cur === ms.key ? null : cur)), 1800);
          break;
        }
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setCurrentValue(totalCasualties);
        setPhase('done');
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, totalCasualties, phase, passedMilestones]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-transparent px-6 py-24 md:py-32"
    >
      {/* 背景暖色光晕 */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(184,92,79,0.4) 0%, rgba(200,138,61,0.2) 40%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-archive-terracotta"
        >
          {t('toll.badge')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl font-medium text-archive-ink md:text-4xl"
        >
          {t('toll.title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-archive-muted"
        >
          {t('toll.subtitle')}
        </motion.p>

        {/* 大数字滚动区 */}
        <div className="relative mt-12 md:mt-16">
          <div
            className="font-mono text-6xl font-bold leading-none tracking-tight text-archive-ink md:text-8xl lg:text-9xl"
            style={{
              textShadow:
                phase === 'counting'
                  ? '0 0 40px rgba(184,92,79,0.25)'
                  : '0 0 60px rgba(200,138,61,0.2)',
              transition: 'text-shadow 0.5s ease',
            }}
          >
            {formatCasualties(currentValue, lang)}
          </div>

          {/* 里程碑描述闪现 */}
          <div className="relative mt-6 h-8">
            <AnimatePresence mode="wait">
              {activeMilestone ? (
                <motion.p
                  key={activeMilestone}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm font-medium text-archive-terracotta md:text-base"
                >
                  — {t(`toll.${activeMilestone}`)} —
                </motion.p>
              ) : phase === 'counting' ? (
                <motion.p
                  key="counting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-archive-muted"
                >
                  {t('toll.counting')}
                </motion.p>
              ) : phase === 'done' ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-sm text-archive-muted">{t('toll.final')}</p>
                  <p className="mt-2 font-serif text-lg font-medium text-archive-ink md:text-xl">
                    {t('toll.reflect')}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mx-auto mt-10 h-px w-48 overflow-hidden bg-archive-border/60 md:w-64">
          <motion.div
            className="h-full bg-gradient-to-r from-archive-terracotta to-archive-amber"
            initial={{ width: '0%' }}
            animate={{ width: phase === 'done' ? '100%' : `${(currentValue / totalCasualties) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </section>
  );
}
