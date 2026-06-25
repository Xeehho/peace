import { useAppStore } from '@/stores/appStore';
import { formatYear } from '@/utils/format';

const MIN_YEAR = -500;
const MAX_YEAR = 2025;

export function TimeSlider() {
  const { timeRange, setTimeRange } = useAppStore();

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < timeRange[1]) {
      setTimeRange([value, timeRange[1]]);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > timeRange[0]) {
      setTimeRange([timeRange[0], value]);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-30 w-full max-w-2xl -translate-x-1/2 rounded-full border border-archive-border bg-white/90 px-6 py-4 shadow-soft backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between text-xs text-archive-muted">
        <span className="font-mono">{formatYear(timeRange[0])}</span>
        <span className="font-serif text-sm text-archive-amber">时间筛选</span>
        <span className="font-mono">{formatYear(timeRange[1])}</span>
      </div>
      <div className="relative h-1.5">
        <div className="absolute inset-0 rounded-full bg-archive-border" />
        <div
          className="absolute h-full rounded-full bg-archive-terracotta/50"
          style={{
            left: `${((timeRange[0] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
            right: `${100 - ((timeRange[1] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={10}
          value={timeRange[0]}
          onChange={handleStartChange}
          className="slider-thumb absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
        />
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={10}
          value={timeRange[1]}
          onChange={handleEndChange}
          className="slider-thumb absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
