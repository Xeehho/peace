import { HeartHandshake, Heart } from 'lucide-react';
import { useT } from '@/i18n/useT';

export function CallToAction() {
  const { t } = useT();
  return (
    <section
      id="cta"
      className="relative z-10 border-t border-archive-border/60 bg-archive-cream px-6 py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Heart className="mx-auto mb-6 h-8 w-8 text-archive-terracotta" />
        <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
          {t('cta.title')}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-archive-muted md:text-base">
          {t('cta.subtitle')}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://www.un.org/zh/peace"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-archive-terracotta bg-archive-terracotta px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#a34e42]"
          >
            <HeartHandshake className="h-4 w-4" />
            {t('cta.button')}
          </a>
          <span className="text-xs text-archive-muted">
            {t('cta.footnote')}
          </span>
        </div>
      </div>
    </section>
  );
}
