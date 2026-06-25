import { useRef, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight, Skull } from 'lucide-react';
import { useWars } from '@/hooks/useWars';
import { useCountries } from '@/hooks/useCountries';
import { useAppStore } from '@/stores/appStore';
import { formatYearRange, formatCasualties } from '@/utils/format';
import { generateWarImageUrl } from '@/utils/image';
import { CallToAction } from '@/components/CallToAction';
import type { War } from '@/types';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 360;
const CARD_GAP = 56;
const ANCHOR_GAP = 40; // 锚点距离卡片边缘的距离
const CONTAINER_HEIGHT = 720;
const CENTER_Y = CONTAINER_HEIGHT / 2; // 360
const CARD_OFFSET = 160; // 卡片中心相对中心线的偏移

export default function Timeline() {
  const { wars, loading } = useWars();
  const { countries } = useCountries();
  const { setSelectedWar } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const countryMap = new Map(countries.map((c) => [c.id, c]));

  const sortedWars = useMemo(
    () => [...wars].sort((a, b) => a.startYear - b.startYear),
    [wars]
  );

  const items = useMemo(() => {
    return sortedWars.map((war, idx) => {
      const primaryCountry = war.relatedCountryIds[0]
        ? countryMap.get(war.relatedCountryIds[0])
        : undefined;
      const imageUrl = generateWarImageUrl(
        war.name,
        war.location,
        war.startYear,
        war.belligerents,
        war.background
      );
      return {
        war,
        imageUrl,
        countryName: primaryCountry?.name,
        idx,
        isTop: idx % 2 === 0,
      };
    });
  }, [sortedWars, countryMap]);

  const totalWidth = items.length * (CARD_WIDTH + CARD_GAP) + CARD_GAP;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -560 : 560;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // 支持滚轮横向滚动，并在到达边缘时丝滑切换为页面纵向滚动
  // 依赖 loading：组件挂载时若处于 loading 状态，scrollRef 尚未绑定 DOM，
  // 需在 loading 结束后重新绑定监听器
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // 只处理垂直滚轮（水平滚轮交给浏览器默认行为）
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;

      const delta = e.deltaY;
      const atLeft = el.scrollLeft <= 0;
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      const scrollingLeft = delta < 0;
      const scrollingRight = delta > 0;

      // 在边缘且朝边缘外滚动时，交给页面纵向滚动
      if ((atLeft && scrollingLeft) || (atRight && scrollingRight)) {
        return;
      }

      // 否则拦截并转为横向滚动
      e.preventDefault();
      el.scrollLeft += delta;
    };

    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', onWheel, { capture: true });
  }, [loading]);

  // 精确计算每个锚点的坐标
  // 锚点位于卡片靠近中心线的一侧
  const anchors = useMemo(() => {
    return items.map(({ idx, isTop }) => {
      const x = CARD_GAP + idx * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
      // 卡片中心 Y
      const cardCenterY = isTop
        ? CENTER_Y - CARD_OFFSET
        : CENTER_Y + CARD_OFFSET;
      // 卡片靠近中心线一侧的边缘 Y
      const cardInnerEdgeY = isTop
        ? cardCenterY + CARD_HEIGHT / 2
        : cardCenterY - CARD_HEIGHT / 2;
      // 锚点 Y：在卡片边缘之外，朝中心线方向
      const y = isTop
        ? cardInnerEdgeY + ANCHOR_GAP
        : cardInnerEdgeY - ANCHOR_GAP;
      return { x, y, isTop };
    });
  }, [items]);

  const curvePath = useMemo(() => {
    if (anchors.length === 0) return '';
    const first = anchors[0];
    let d = `M ${first.x} ${first.y}`;
    for (let i = 1; i < anchors.length; i++) {
      const prev = anchors[i - 1];
      const curr = anchors[i];
      const midX = (prev.x + curr.x) / 2;
      d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [anchors]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-archive-cream pt-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-archive-border border-t-archive-amber" />
          <p className="text-sm text-archive-muted">正在加载历史档案...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-archive-cream pt-16">
      <section className="px-6 pb-10 pt-12 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
            Timeline
          </p>
          <h1 className="font-serif text-4xl font-medium text-archive-ink md:text-5xl">
            人类战争编年史
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
            曲线穿过每个时间锚点，把人类历史上重大的战争串联成一条可见的伤痕脉络。
          </p>
        </div>
      </section>

      <section className="relative pb-12">
        {/* 滚动控制按钮 */}
        <button
          onClick={() => scroll('left')}
          aria-label="向左滚动"
          className="absolute left-6 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-archive-border bg-white/95 shadow-soft backdrop-blur-md transition-all hover:scale-110 hover:border-archive-amber hover:text-archive-amber"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          aria-label="向右滚动"
          className="absolute right-6 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-archive-border bg-white/95 shadow-soft backdrop-blur-md transition-all hover:scale-110 hover:border-archive-amber hover:text-archive-amber"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* 时间线滚动容器 */}
        <div
          ref={scrollRef}
          className="timeline-scroll relative overflow-x-auto overflow-y-hidden pb-16"
        >
          <div
            className="relative"
            style={{ width: `${totalWidth}px`, height: `${CONTAINER_HEIGHT}px` }}
          >
            {/* 卡片层（z-10） */}
            {items.map(({ war, imageUrl, countryName, idx, isTop }) => {
              const x = CARD_GAP + idx * (CARD_WIDTH + CARD_GAP);
              const cardCenterY = isTop
                ? CENTER_Y - CARD_OFFSET
                : CENTER_Y + CARD_OFFSET;
              const cardTop = cardCenterY - CARD_HEIGHT / 2;

              return (
                <div
                  key={war.id}
                  className="absolute"
                  style={{
                    left: `${x}px`,
                    top: `${cardTop}px`,
                    width: `${CARD_WIDTH}px`,
                    height: `${CARD_HEIGHT}px`,
                  }}
                >
                  <TimelineCard
                    war={war}
                    imageUrl={imageUrl}
                    countryName={countryName}
                    index={idx}
                    onClick={() => setSelectedWar(war.id)}
                  />
                </div>
              );
            })}

            {/* 曲线 + 锚点层（z-30，在最上层，不被卡片遮挡） */}
            <svg
              className="pointer-events-none absolute left-0 top-0 z-30"
              width={totalWidth}
              height={CONTAINER_HEIGHT}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#E8E4DF" />
                  <stop offset="50%" stopColor="#C88A3D" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#E8E4DF" />
                </linearGradient>
              </defs>
              {/* 连接曲线 */}
              <path
                d={curvePath}
                fill="none"
                stroke="url(#curveGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* 锚点 */}
              {anchors.map((anchor, idx) => (
                <g key={idx}>
                  {/* 外环 */}
                  <circle
                    cx={anchor.x}
                    cy={anchor.y}
                    r="9"
                    fill="#FFFFFF"
                    stroke="#B85C4F"
                    strokeWidth="2"
                  />
                  {/* 内心 */}
                  <circle cx={anchor.x} cy={anchor.y} r="3.5" fill="#B85C4F" />
                </g>
              ))}
            </svg>

            {/* 年份标签层（z-20，在曲线上方） */}
            {items.map(({ war, idx, isTop }) => {
              const x = CARD_GAP + idx * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
              const cardCenterY = isTop
                ? CENTER_Y - CARD_OFFSET
                : CENTER_Y + CARD_OFFSET;
              const cardInnerEdgeY = isTop
                ? cardCenterY + CARD_HEIGHT / 2
                : cardCenterY - CARD_HEIGHT / 2;
              const labelY = isTop
                ? cardInnerEdgeY + ANCHOR_GAP + 18
                : cardInnerEdgeY - ANCHOR_GAP - 18;

              return (
                <div
                  key={`label-${war.id}`}
                  className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-archive-border bg-white px-2.5 py-0.5 shadow-soft"
                  style={{ left: `${x}px`, top: `${labelY}px` }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-archive-amber" />
                  <span className="whitespace-nowrap font-mono text-[10px] font-medium text-archive-ink">
                    {war.startYear > 0 ? `${war.startYear}` : `公元前 ${-war.startYear}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}

interface TimelineCardProps {
  war: War;
  imageUrl: string;
  countryName?: string;
  index: number;
  onClick: () => void;
}

function TimelineCard({ war, imageUrl, countryName, index, onClick }: TimelineCardProps) {
  const baseRotate = index % 2 === 0 ? -2 : 2;
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: index % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        rotate: 0,
        scale: 1.05,
        y: index % 2 === 0 ? 8 : -8,
        boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
        transition: { duration: 0.35, ease: 'easeOut' },
      }}
      className="group relative block h-full w-full overflow-hidden rounded-2xl border border-archive-border bg-white text-left shadow-soft"
      style={{
        transform: `rotate(${baseRotate}deg)`,
        transformOrigin: 'center',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
      }}
    >
      {/* 顶部细条装饰 */}
      <div className="h-1 w-full bg-gradient-to-r from-archive-terracotta via-archive-amber to-archive-terracotta" />

      {/* 战争相关人物/着装插画 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-archive-border">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-archive-border border-t-archive-amber" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={`${war.name} 历史士兵着装`}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        {/* 图片渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-archive-ink/50 via-transparent to-transparent opacity-80" />
        {/* 年份徽章 */}
        <div className="absolute left-3 top-3 rounded-md border border-white/20 bg-archive-ink/70 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-md">
          {formatYearRange(war.startYear, war.endYear)}
        </div>
        {/* 国家标签 */}
        {countryName && (
          <div className="absolute right-3 top-3 rounded-md border border-white/20 bg-archive-amber/85 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            {countryName}
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="relative p-4">
        <h3 className="font-serif text-lg leading-snug text-archive-ink transition-colors duration-300 group-hover:text-archive-amber">
          {war.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-archive-muted">
          {war.background}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-archive-border/60 pt-3 text-[10px] text-archive-muted">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{war.location}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 font-medium text-archive-terracotta">
            <Skull className="h-3 w-3" />
            {formatCasualties(war.casualties)}
          </span>
        </div>
      </div>

      {/* hover 时的边框高光 */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-archive-amber/0 transition-all duration-300 group-hover:border-archive-amber/50" />
    </motion.button>
  );
}
