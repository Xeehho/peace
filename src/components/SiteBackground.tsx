import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ALL_ENGRAVINGS, getPageEngravings } from '@/assets/engravings';

/**
 * 页面级统一背景层。
 *
 * 设计理念：
 * - 固定的纸张噪点纹理（SVG turbulence），贯穿整个视口，形成统一的"老纸"基底
 * - 6-8 幅跨 section 的大幅铜版画，页面级 absolute 定位，跨越 section 边界
 * - 极低透明度（0.06-0.09），仅作氛围暗示，不抢视觉焦点
 * - 图片位置故意跨越 section 分界，消除"拼接感"
 */

export type PageTheme = 'home' | 'timeline' | 'insights' | 'about';

/** 每幅铜版画的位置配置 */
interface EngravingPlacement {
  /** 在 ALL_ENGRAVINGS 池中的索引（保证全项目不重复） */
  srcIndex: number;
  /** 垂直位置（百分比，相对于页面容器高度） */
  top: string;
  /** 水平位置 */
  left: string;
  /** 宽度 */
  width: string;
  /** 旋转角度 */
  rotate: number;
  /** 透明度 */
  opacity: number;
  /** 水平翻转 */
  flipX?: boolean;
}

/**
 * 各页面的铜版画位置配置。
 * 图片故意分布在 section 边界附近（约 15%/35%/55%/75%），跨越多个 section 消除切割感。
 */
const PAGE_PLACEMENTS: Record<PageTheme, EngravingPlacement[]> = {
  home: [
    // 顶部偏右（跨越 Hero → Stats 边界）：1689 世界地图
    { srcIndex: 0, top: '6%', left: '60%', width: '34%', rotate: -2, opacity: 0.07 },
    // 中左（跨越 Stats → WarHighlights）：鞑靼地图
    { srcIndex: 1, top: '20%', left: '-5%', width: '28%', rotate: 3, opacity: 0.06, flipX: true },
    // WarHighlights 偏右：链锁书架
    { srcIndex: 3, top: '36%', left: '74%', width: '22%', rotate: -1, opacity: 0.065 },
    // 跨越 WarHighlights → Quotes 左下：渡河战役
    { srcIndex: 4, top: '50%', left: '4%', width: '26%', rotate: 2, opacity: 0.06 },
    // 跨越 Quotes → CTA 右中：Tibaldi 和平寓言
    { srcIndex: 7, top: '68%', left: '72%', width: '20%', rotate: -3, opacity: 0.065, flipX: true },
    // 底部偏左：阿莱西亚战役
    { srcIndex: 9, top: '84%', left: '-3%', width: '28%', rotate: 2, opacity: 0.06 },
    // 底部偏右：神曲书页
    { srcIndex: 11, top: '88%', left: '76%', width: '20%', rotate: -2, opacity: 0.06 },
  ],
  timeline: [
    { srcIndex: 0, top: '8%', left: '-4%', width: '30%', rotate: -2, opacity: 0.07, flipX: true },
    { srcIndex: 2, top: '28%', left: '74%', width: '24%', rotate: 2, opacity: 0.065 },
    { srcIndex: 5, top: '50%', left: '-3%', width: '26%', rotate: 3, opacity: 0.06 },
    { srcIndex: 8, top: '70%', left: '70%', width: '24%', rotate: -2, opacity: 0.07 },
    { srcIndex: 11, top: '88%', left: '8%', width: '22%', rotate: 1, opacity: 0.06 },
  ],
  insights: [
    { srcIndex: 0, top: '4%', left: '66%', width: '26%', rotate: 3, opacity: 0.07 },
    { srcIndex: 2, top: '18%', left: '-5%', width: '24%', rotate: -2, opacity: 0.06, flipX: true },
    { srcIndex: 5, top: '34%', left: '76%', width: '22%', rotate: 2, opacity: 0.065 },
    { srcIndex: 7, top: '50%', left: '-4%', width: '28%', rotate: -1, opacity: 0.06 },
    { srcIndex: 10, top: '64%', left: '72%', width: '22%', rotate: 3, opacity: 0.06 },
    { srcIndex: 12, top: '78%', left: '4%', width: '26%', rotate: -2, opacity: 0.065, flipX: true },
    { srcIndex: 14, top: '90%', left: '74%', width: '20%', rotate: 2, opacity: 0.06 },
  ],
  about: [
    { srcIndex: 0, top: '4%', left: '-4%', width: '28%', rotate: -2, opacity: 0.07, flipX: true },
    { srcIndex: 2, top: '18%', left: '74%', width: '22%', rotate: 2, opacity: 0.065 },
    { srcIndex: 4, top: '34%', left: '-3%', width: '26%', rotate: -3, opacity: 0.06 },
    { srcIndex: 6, top: '50%', left: '70%', width: '22%', rotate: 1, opacity: 0.07 },
    { srcIndex: 9, top: '66%', left: '2%', width: '28%', rotate: 2, opacity: 0.065, flipX: true },
    { srcIndex: 11, top: '80%', left: '76%', width: '18%', rotate: -2, opacity: 0.06 },
    { srcIndex: 13, top: '90%', left: '6%', width: '24%', rotate: 3, opacity: 0.06 },
  ],
};

interface SiteBackgroundProps {
  theme: PageTheme;
}

/**
 * SVG 纸张噪点纹理——用 feTurbulence 生成模拟老纸的微妙颗粒感。
 * 通过 fixed 定位覆盖整个视口，形成所有区域共享的统一基底。
 */
function PaperGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-[-40px] z-[-1]"
      aria-hidden="true"
      style={{ opacity: 0.28 }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="paperNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)" />
      </svg>
    </div>
  );
}

/**
 * 极淡的暖色调渐变叠层——模拟纸张边缘微微泛黄的效果，
 * 同时让铜版画在四角渐隐，避免图片边缘突兀。
 */
function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1]"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 60%, rgba(200,138,61,0.035) 100%)',
      }}
    />
  );
}

export function SiteBackground({ theme }: SiteBackgroundProps) {
  const placements = PAGE_PLACEMENTS[theme];
  const pool = getPageEngravings(theme);

  const items = useMemo(() => {
    return placements.map((p) => ({
      ...p,
      src: pool[p.srcIndex % pool.length] ?? ALL_ENGRAVINGS[p.srcIndex % ALL_ENGRAVINGS.length],
    }));
  }, [theme, placements, pool]);

  return (
    <>
      {/* 固定纸张纹理和渐晕——永远在视口上，营造统一基底 */}
      <PaperGrain />
      <Vignette />

      {/* 页面级铜版画装饰——在页面容器内 absolute 定位，可跨越 section 边界 */}
      <div
        className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden"
        aria-hidden="true"
      >
        {items.map((item, idx) => (
          <motion.img
            key={`${theme}-bg-${idx}`}
            src={item.src}
            alt=""
            loading="lazy"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: item.opacity, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              duration: 2,
              delay: idx * 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute select-none"
            style={{
              top: item.top,
              left: item.left,
              width: item.width,
              transform: `rotate(${item.rotate}deg) scaleX(${item.flipX ? -1 : 1})`,
              filter: 'sepia(0.6) saturate(0.75) contrast(0.88) brightness(0.97)',
              mixBlendMode: 'multiply',
            }}
          />
        ))}
      </div>
    </>
  );
}
