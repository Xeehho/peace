import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote as QuoteIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';
import { formatYear } from '@/utils/format';

const AUTOPLAY_INTERVAL = 8000;

export function QuotesCarousel() {
  const { quotes, loading } = useQuotes();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((newIndex: number, dir: number) => {
    setDirection(dir);
    setIndex(newIndex);
  }, []);

  const next = useCallback(() => {
    if (quotes.length === 0) return;
    goTo((index + 1) % quotes.length, 1);
  }, [index, quotes.length, goTo]);

  const prev = useCallback(() => {
    if (quotes.length === 0) return;
    goTo((index - 1 + quotes.length) % quotes.length, -1);
  }, [index, quotes.length, goTo]);

  useEffect(() => {
    if (quotes.length === 0) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next, quotes.length]);

  if (loading || quotes.length === 0) return null;

  const current = quotes[index];

  return (
    <section className="relative overflow-hidden bg-archive-ink px-6 py-24">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-archive-amber blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-archive-terracotta blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-amber/80">
            Voices for Peace
          </p>
          <h2 className="font-serif text-3xl font-medium text-archive-cream md:text-4xl">
            和平之声
          </h2>
        </div>

        <div className="relative min-h-[280px]">
          <QuoteIcon className="mx-auto mb-8 h-10 w-10 text-archive-amber/40" />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <blockquote className="font-serif text-2xl leading-relaxed text-archive-cream md:text-3xl">
                "{current.quote}"
              </blockquote>
              <div className="mt-8 flex flex-col items-center gap-1">
                <p className="font-medium text-archive-amber">{current.author}</p>
                <p className="text-sm text-archive-muted">
                  {current.role} · {formatYear(current.year)}
                </p>
              </div>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-archive-muted/80">
                {current.context}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 控制器 */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="上一条"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-archive-muted/30 text-archive-muted transition-all hover:border-archive-amber hover:text-archive-amber"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* 指示点 */}
          <div className="flex items-center gap-2">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                aria-label={`第 ${i + 1} 条`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-8 bg-archive-amber'
                    : 'w-2 bg-archive-muted/30 hover:bg-archive-muted/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="下一条"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-archive-muted/30 text-archive-muted transition-all hover:border-archive-amber hover:text-archive-amber"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
