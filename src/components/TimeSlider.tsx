import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { formatYear } from '@/utils/format';
import { useT } from '@/i18n/useT';

const MIN_YEAR = -500;
const MAX_YEAR = 2025;

export function TimeSlider() {
  const { timeRange, setTimeRange } = useAppStore();
  const { t, lang } = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  // 根据地球区域（首个全屏区块）的可见性渐变隐藏
  useEffect(() => {
    const onScroll = () => {
      // 地球区域高度 = 100vh，向下滚动时透明度递减
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      // 在 0 ~ viewportH*0.8 之间从 1 渐变到 0
      const fadeRange = viewportH * 0.8;
      const op = Math.max(0, Math.min(1, 1 - scrollY / fadeRange));
      setOpacity(op);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const startPct = ((timeRange[0] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
  const endPct = ((timeRange[1] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // 起始滑块越过结束滑块时，将结束滑块也向前推进
    if (value >= timeRange[1]) {
      setTimeRange([value, Math.min(value + 10, MAX_YEAR)]);
    } else {
      setTimeRange([value, timeRange[1]]);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // 结束滑块越过起始滑块时，将起始滑块也向后推
    if (value <= timeRange[0]) {
      setTimeRange([Math.max(value - 10, MIN_YEAR), value]);
    } else {
      setTimeRange([timeRange[0], value]);
    }
  };

  if (opacity <= 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-1/2 z-30 w-full max-w-2xl -translate-x-1/2 rounded-full border border-archive-border bg-white/90 px-6 py-4 shadow-soft backdrop-blur-md transition-opacity duration-200"
      style={{ opacity, pointerEvents: opacity < 0.1 ? 'none' : 'auto' }}
    >
      <div className="mb-3 flex items-center justify-between text-xs text-archive-muted">
        <span className="font-mono">{formatYear(timeRange[0], lang)}</span>
        <span className="font-serif text-sm text-archive-amber">{t('timeSlider.label')}</span>
        <span className="font-mono">{formatYear(timeRange[1], lang)}</span>
      </div>
      <div className="relative h-1.5">
        <div className="absolute inset-0 rounded-full bg-archive-border" />
        <div
          className="absolute h-full rounded-full bg-archive-terracotta/50"
          style={{
            left: `${startPct}%`,
            right: `${100 - endPct}%`,
          }}
        />
        {/* 起始滑块：只让 thumb 可交互；起始滑块始终置顶，确保从前往后拖拽时能抓到 */}
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={10}
          value={timeRange[0]}
          onChange={handleStartChange}
          className="slider-thumb pointer-events-none absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
          style={{ zIndex: 3 }}
        />
        {/* 结束滑块：同样只让 thumb 可交互 */}
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={10}
          value={timeRange[1]}
          onChange={handleEndChange}
          className="slider-thumb pointer-events-none absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
          style={{ zIndex: 2 }}
        />
      </div>
    </div>
  );
}
