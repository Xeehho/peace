import { motion } from 'framer-motion';
import {
  BookOpen,
  Eye,
  HeartHandshake,
  Quote,
  Database,
  BarChart3,
  RefreshCw,
  Globe,
  Code2,
  Heart,
} from 'lucide-react';
import { CallToAction } from '@/components/CallToAction';
import { SiteBackground } from '@/components/SiteBackground';
import { useT } from '@/i18n/useT';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function About() {
  const { t } = useT();

  const missions = [
    {
      icon: BookOpen,
      title: t('about.missions.0.title'),
      description: t('about.missions.0.description'),
      accent: '#B85C4F',
    },
    {
      icon: Eye,
      title: t('about.missions.1.title'),
      description: t('about.missions.1.description'),
      accent: '#C88A3D',
    },
    {
      icon: HeartHandshake,
      title: t('about.missions.2.title'),
      description: t('about.missions.2.description'),
      accent: '#7A8B7A',
    },
  ];

  const methodology = [
    {
      icon: Database,
      title: t('about.methodology.0.title'),
      description: t('about.methodology.0.description'),
    },
    {
      icon: BarChart3,
      title: t('about.methodology.1.title'),
      description: t('about.methodology.1.description'),
    },
    {
      icon: RefreshCw,
      title: t('about.methodology.2.title'),
      description: t('about.methodology.2.description'),
    },
  ];

  const dataSources = [
    { title: t('about.sources.0.title'), description: t('about.sources.0.description') },
    { title: t('about.sources.1.title'), description: t('about.sources.1.description') },
    { title: t('about.sources.2.title'), description: t('about.sources.2.description') },
    { title: t('about.sources.3.title'), description: t('about.sources.3.description') },
    { title: t('about.sources.4.title'), description: t('about.sources.4.description') },
  ];

  const techStack = [
    { label: t('about.techStack.0.label'), desc: t('about.techStack.0.desc') },
    { label: t('about.techStack.1.label'), desc: t('about.techStack.1.desc') },
    { label: t('about.techStack.2.label'), desc: t('about.techStack.2.desc') },
    { label: t('about.techStack.3.label'), desc: t('about.techStack.3.desc') },
    { label: t('about.techStack.4.label'), desc: t('about.techStack.4.desc') },
  ];

  return (
    <main className="relative isolate min-h-screen pt-16">
      <SiteBackground theme="about" />
      {/* 1. 英雄区 */}
      <section className="px-6 pb-12 pt-12 md:pt-20">
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              {t('about.heroBadge')}
            </p>
            <h1 className="font-serif text-4xl font-medium text-archive-ink md:text-6xl">
              {t('about.heroTitle')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
              {t('about.heroSubtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="mx-auto mb-6 h-px w-16 bg-archive-border" />
            <p className="font-serif text-lg font-medium leading-relaxed text-archive-ink md:text-xl">
              {t('about.quote1')}
              <br />
              {t('about.quote2')}
              <br />
              {t('about.quote3')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. 我们的使命 */}
      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              {t('about.missionBadge')}
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              {t('about.missionTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {missions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-archive-border bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                    style={{ backgroundColor: item.accent }}
                  />
                  <div className="relative">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${item.accent}1A` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: item.accent }} />
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-medium text-archive-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-archive-muted">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 为什么记录战争？ */}
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="mb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              {t('about.whyBadge')}
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              {t('about.whyTitle')}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 text-sm leading-loose text-archive-muted md:text-base"
          >
            <p>
              {t('about.whyTexts.0')}
            </p>
            <p>
              {t('about.whyTexts.1')}
            </p>
            <p>
              {t('about.whyTexts.2')}
            </p>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 rounded-2xl border border-archive-border bg-archive-cream p-8 shadow-soft"
          >
            <Quote className="h-7 w-7 text-archive-terracotta" />
            <blockquote className="mt-4 font-serif text-xl font-medium leading-relaxed text-archive-ink md:text-2xl">
              {t('about.santayanaQuote')}
            </blockquote>
            <figcaption className="mt-4 text-xs font-medium uppercase tracking-wider text-archive-muted">
              {t('about.santayanaAuthor')}
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* 4. 方法论 */}
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              {t('about.methodologyBadge')}
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              {t('about.methodologyTitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
              {t('about.methodologySubtitle')}
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
            {methodology.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative rounded-2xl border border-archive-border bg-white p-7 shadow-soft"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-archive-terracotta/10">
                      <Icon className="h-5 w-5 text-archive-terracotta" />
                    </div>
                    <span className="font-mono text-xs font-medium text-archive-muted">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-archive-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-archive-muted">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. 数据来源 */}
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              {t('about.sourcesBadge')}
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              {t('about.sourcesTitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
              {t('about.sourcesSubtitle')}
            </p>
          </motion.div>

          <div className="space-y-3">
            {dataSources.map((source, idx) => (
              <motion.div
                key={source.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-4 rounded-xl border border-archive-border bg-archive-cream p-5 transition-colors hover:border-archive-amber/50"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-archive-border bg-white font-mono text-xs font-medium text-archive-terracotta">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-serif text-base font-medium text-archive-ink">
                    {source.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-archive-muted">
                    {source.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 技术栈 */}
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              {t('about.techBadge')}
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              {t('about.techTitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
              {t('about.techSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {techStack.map((tech, idx) => (
              <motion.div
                key={tech.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-4 rounded-xl border border-archive-border bg-white p-5 shadow-soft"
              >
                <Code2 className="mt-0.5 h-5 w-5 shrink-0 text-archive-amber" />
                <div>
                  <h3 className="font-serif text-sm font-medium text-archive-ink">
                    {tech.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-archive-muted">
                    {tech.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 致谢 */}
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Globe className="mx-auto mb-6 h-8 w-8 text-archive-sage" />
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              {t('about.ackBadge')}
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              {t('about.ackTitle')}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-loose text-archive-muted md:text-base">
              {t('about.ackText')}
            </p>
            <div className="mx-auto mt-8 flex items-center justify-center gap-2 text-xs text-archive-muted">
              <Heart className="h-3.5 w-3.5 text-archive-terracotta" />
              <span>{t('about.ackFootnote')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. 底部 CallToAction */}
      <CallToAction />
    </main>
  );
}
