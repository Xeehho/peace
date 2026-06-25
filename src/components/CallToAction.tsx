import { HeartHandshake, Heart } from 'lucide-react';

export function CallToAction() {
  return (
    <section
      id="cta"
      className="relative z-10 border-t border-archive-border/60 bg-archive-cream px-6 py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Heart className="mx-auto mb-6 h-8 w-8 text-archive-terracotta" />
        <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
          战争没有赢家，只有幸存者。
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-archive-muted md:text-base">
          历史教会我们，冲突的代价永远无法衡量。今天的选择，将决定明天的世界。愿每一份记忆都成为和平的基石。
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://www.un.org/zh/peace"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-archive-terracotta bg-archive-terracotta px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#a34e42]"
          >
            <HeartHandshake className="h-4 w-4" />
            支持联合国和平倡议
          </a>
          <span className="text-xs text-archive-muted">
            让历史照亮未来的和平之路
          </span>
        </div>
      </div>
    </section>
  );
}
