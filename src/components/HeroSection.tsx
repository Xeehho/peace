import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="pointer-events-none absolute left-6 top-24 z-10 max-w-md md:left-12 md:top-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-archive-sage">
          War & Peace Archive
        </p>
        <h1 className="font-serif text-4xl font-medium leading-tight text-archive-ink md:text-5xl">
          停止战争，
          <br />
          铭记历史。
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-archive-muted md:text-base">
          每一场战争背后，都是无数被改写的人生。我们记录历史，不是为了延续仇恨，而是为了选择和平。
        </p>
      </motion.div>
    </section>
  );
}
