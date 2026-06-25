import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getEngravings } from '@/assets/engravings';

/**
 * 页面背景铜版画装饰组件。
 *
 * 设计目标：
 * - 低透明度（0.10–0.16）+ sepia 滤镜，融入 archive-cream 米色背景
 * - 错落分布、视口外淡入，避免抢戏
 * - pointer-events:none，不影响交互
 * - 通过 instance 索引从对应 variant 图池取互不重叠的切片，确保全项目无重复图片
 *
 * 用法：<PageBackground variant="warArchive" instance={0} /> 放在 relative 容器内第一个子元素位置。
 */

export type BackgroundVariant =
  | 'hero'
  | 'warArchive'
  | 'insights'
  | 'about'
  | 'quotes'
  | 'cta'
  | 'stats';

/** variant → 对应图池类型 */
const VARIANT_POOL: Record<
  BackgroundVariant,
  'war' | 'peace' | 'archive' | 'data'
> = {
  hero: 'archive',
  stats: 'data',
  warArchive: 'war',
  insights: 'data',
  about: 'archive',
  quotes: 'peace',
  cta: 'peace',
};

/** 每个 variant 单实例需要的图片张数 */
const VARIANT_COUNT: Record<BackgroundVariant, number> = {
  hero: 2,
  stats: 1,
  warArchive: 3,
  insights: 3,
  about: 3,
  quotes: 2,
  cta: 2,
};

interface Placement {
  src: string;
  top: string;
  left: string;
  width: string;
  rotate: number;
  opacity: number;
  flipX?: boolean;
}

/**
 * 每个 variant 预定义的图片布局位置。
 * 采用四角 + 中部错落分布，避免与正文卡片重叠。
 */
const VARIANT_PLACEMENTS: Record<BackgroundVariant, Omit<Placement, 'src'>[]> = {
  hero: [
    { top: '-4%', left: '58%', width: '38%', rotate: -2, opacity: 0.13 },
    { top: '40%', left: '-6%', width: '32%', rotate: 3, opacity: 0.1, flipX: true },
  ],
  stats: [
    { top: '15%', left: '70%', width: '26%', rotate: 4, opacity: 0.1 },
  ],
  warArchive: [
    { top: '-6%', left: '-4%', width: '30%', rotate: -3, opacity: 0.14, flipX: true },
    { top: '8%', left: '78%', width: '24%', rotate: 2, opacity: 0.12 },
    { top: '62%', left: '66%', width: '28%', rotate: -2, opacity: 0.1 },
  ],
  insights: [
    { top: '-8%', left: '72%', width: '26%', rotate: 3, opacity: 0.12 },
    { top: '45%', left: '-6%', width: '24%', rotate: -2, opacity: 0.1, flipX: true },
    { top: '78%', left: '80%', width: '22%', rotate: 4, opacity: 0.11 },
  ],
  about: [
    { top: '2%', left: '-5%', width: '28%', rotate: -3, opacity: 0.12, flipX: true },
    { top: '38%', left: '82%', width: '22%', rotate: 2, opacity: 0.11 },
    { top: '72%', left: '4%', width: '24%', rotate: 3, opacity: 0.1 },
  ],
  quotes: [
    { top: '0%', left: '-4%', width: '26%', rotate: -2, opacity: 0.16, flipX: true },
    { top: '10%', left: '78%', width: '24%', rotate: 3, opacity: 0.16 },
  ],
  cta: [
    { top: '-8%', left: '-6%', width: '28%', rotate: -3, opacity: 0.16, flipX: true },
    { top: '20%', left: '80%', width: '22%', rotate: 2, opacity: 0.16 },
  ],
};

interface PageBackgroundProps {
  variant: BackgroundVariant;
  /**
   * 同一 variant 在项目中的第几个实例（0-based）。
   * 不同实例从图池中取互不重叠的切片，确保图片不重复。
   * 例如首页 cta 是 instance=0，Insights 反思语 cta 是 instance=1，About 致谢 cta 是 instance=2。
   */
  instance?: number;
  /** light=米色背景用 multiply 混合；dark=深色背景用 screen 混合 */
  tone?: 'light' | 'dark';
  className?: string;
}

export function PageBackground({
  variant,
  instance = 0,
  tone = 'light',
  className = '',
}: PageBackgroundProps) {
  const poolType = VARIANT_POOL[variant];
  const count = VARIANT_COUNT[variant];
  const placements = VARIANT_PLACEMENTS[variant];

  // 深色背景下：用 screen 混合，让铜版画线条以暖色高光形式显现
  const isDark = tone === 'dark';

  const items = useMemo<Placement[]>(() => {
    const urls = getEngravings(poolType, instance, count);
    return urls.map((src, i) => {
      const base = placements[i % placements.length];
      return {
        src,
        ...base,
        opacity: isDark
          ? Math.min(base.opacity + 0.06, 0.22)
          : base.opacity,
      };
    });
  }, [poolType, instance, count, placements, isDark]);

  if (items.length === 0) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {items.map((item, idx) => (
        <motion.img
          key={`${variant}-${instance}-${idx}`}
          src={item.src}
          alt=""
          loading="lazy"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: item.opacity, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 1.4,
            delay: idx * 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute select-none"
          style={{
            top: item.top,
            left: item.left,
            width: item.width,
            transform: `rotate(${item.rotate}deg) scaleX(${item.flipX ? -1 : 1})`,
            filter: isDark
              ? 'sepia(0.9) saturate(1.4) contrast(1.05) brightness(1.1) invert(0.08)'
              : 'sepia(0.55) saturate(0.85) contrast(0.92) brightness(0.98)',
            mixBlendMode: isDark ? 'screen' : 'multiply',
          }}
        />
      ))}
    </div>
  );
}
