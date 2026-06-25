import { motion } from 'framer-motion';
import { useT } from '@/i18n/useT';

export function HeroSection() {
  const { t } = useT();
  return (
    <section className="pointer-events-none absolute left-6 top-24 z-10 max-w-md md:left-12 md:top-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-archive-sage">
          {t('hero.badge')}
        </p>
        <h1 className="font-serif text-4xl font-medium leading-tight text-archive-ink md:text-5xl">
          {t('hero.title1')}
          <br />
          {t('hero.title2')}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-archive-muted md:text-base">
          {t('hero.subtitle')}
        </p>
      </motion.div>
    </section>
  );
}
