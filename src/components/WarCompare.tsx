import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Skull, Clock, Globe, Calendar, Swords, MapPin, ChevronDown, Users, FileText, AlertTriangle } from 'lucide-react';
import { formatCasualties, formatYearRange } from '@/utils/format';
import { useT, localized, localizedArray } from '@/i18n/useT';
import type { War, Country } from '@/types';

interface WarCompareProps {
  warA: War | null;
  warB: War | null;
  countries: Country[];
  onClose: () => void;
}

// 时代判定
function getEra(startYear: number): 'ancient' | 'medieval' | 'earlyModern' | 'contemporary' {
  if (startYear < 476) return 'ancient';
  if (startYear < 1453) return 'medieval';
  if (startYear < 1900) return 'earlyModern';
  return 'contemporary';
}

const ERA_KEYS = {
  ancient: 'compare.ancientEra',
  medieval: 'compare.medievalEra',
  earlyModern: 'compare.earlyModernEra',
  contemporary: 'compare.contemporaryEra',
} as const;

/**
 * 战争对比视图：并排展示两场战争的核心指标。
 *
 * 布局策略：对比弹窗分为三层——头部（固定）、中部内容区（可滚动）、
 * 底部切换按钮栏（固定贴底）。这样无论详情面板是否展开，
 * 底部按钮始终保持在弹窗底部，不会被内容推走。
 *
 * 详情面板采用左右分栏卡片式布局，带图标徽章和分隔线，
 * 展示地点、交战方、背景故事、反思提示。
 */
export function WarCompare({ warA, warB, countries, onClose }: WarCompareProps) {
  const { t, lang } = useT();
  // 左右两侧详情面板的展开状态，可独立切换
  const [expandedA, setExpandedA] = useState(false);
  const [expandedB, setExpandedB] = useState(false);

  // 中部滚动容器 + 详情面板容器引用，用于展开后自动滚动到该区域
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const detailSectionRef = useRef<HTMLDivElement>(null);

  // 展开状态变化时，等待动画启动后自动滚动到详情区域顶部
  useEffect(() => {
    if (!expandedA && !expandedB) return;
    const container = scrollContainerRef.current;
    const target = detailSectionRef.current;
    if (!container || !target) return;
    // 延迟等高度动画开始铺开，再滚动到目标位置（相对于中部滚动容器）
    const timer = window.setTimeout(() => {
      const offsetTop = target.offsetTop - container.offsetTop;
      container.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [expandedA, expandedB]);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isOpen = Boolean(warA && warB);

  // 计算对比维度
  const getMetrics = (war: War | null) => {
    if (!war) return null;
    const duration = (war.endYear ?? war.startYear) - war.startYear;
    const involvedCountries = war.relatedCountryIds.length;
    const era = getEra(war.startYear);
    return {
      duration: Math.max(duration, 0),
      casualties: war.casualties,
      countries: involvedCountries,
      era,
      eraLabel: t(ERA_KEYS[era]),
    };
  };

  const metricsA = getMetrics(warA);
  const metricsB = getMetrics(warB);

  // 国家名称列表
  const countryMap = new Map(countries.map((c) => [c.id, c]));
  const getCountryNames = (war: War | null) => {
    if (!war) return [];
    return war.relatedCountryIds
      .map((id) => countryMap.get(id))
      .filter((c): c is Country => Boolean(c))
      .map((c) => localized(c, 'name', lang));
  };

  // 条形图最大值（用于两场战争相对比例）
  const maxCasualties = Math.max(metricsA?.casualties ?? 0, metricsB?.casualties ?? 0, 1);
  const maxDuration = Math.max(metricsA?.duration ?? 0, metricsB?.duration ?? 0, 1);
  const maxCountries = Math.max(metricsA?.countries ?? 0, metricsB?.countries ?? 0, 1);

  return createPortal(
    <AnimatePresence>
      {isOpen && warA && warB && metricsA && metricsB && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
        >
          {/* 遮罩 */}
          <div
            className="absolute inset-0 bg-archive-ink/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 对比卡片：用 flex flex-col 把弹窗分成 头部/中部滚动区/底部固定栏 三层 */}
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-archive-border bg-white shadow-2xl"
          >
            {/* ===== 头部（固定不滚动） ===== */}
            <div className="flex shrink-0 items-center justify-between border-b border-archive-border bg-white/95 px-6 py-4 backdrop-blur-md">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
                  {t('compare.badge')}
                </p>
                <h2 className="mt-1 font-serif text-xl font-medium text-archive-ink md:text-2xl">
                  {t('compare.title')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-archive-border text-archive-muted transition-colors hover:border-archive-terracotta hover:text-archive-terracotta"
                aria-label="close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ===== 中部内容区（可滚动） ===== */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
              {/* 两场战争标题 + VS */}
              <div className="mb-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="text-right">
                  <p className="mb-1 text-xs text-archive-muted">{formatYearRange(warA.startYear, warA.endYear, lang)}</p>
                  <h3 className="font-serif text-lg font-medium text-archive-ink md:text-xl">
                    {localized(warA, 'name', lang)}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-archive-cream font-serif text-sm font-bold text-archive-terracotta">
                  {t('compare.vs')}
                </div>
                <div className="text-left">
                  <p className="mb-1 text-xs text-archive-muted">{formatYearRange(warB.startYear, warB.endYear, lang)}</p>
                  <h3 className="font-serif text-lg font-medium text-archive-ink md:text-xl">
                    {localized(warB, 'name', lang)}
                  </h3>
                </div>
              </div>

              {/* 对比维度 */}
              <div className="space-y-6">
                <CompareRow
                  icon={<Skull className="h-4 w-4" />}
                  label={t('compare.casualties')}
                  valueA={formatCasualties(metricsA.casualties, lang)}
                  valueB={formatCasualties(metricsB.casualties, lang)}
                  ratioA={metricsA.casualties / maxCasualties}
                  ratioB={metricsB.casualties / maxCasualties}
                  colorA="#B85C4F"
                  colorB="#C88A3D"
                />

                <CompareRow
                  icon={<Clock className="h-4 w-4" />}
                  label={t('compare.duration')}
                  valueA={metricsA.duration === 0 ? t('warModal.durationSameYear') : `${metricsA.duration} ${lang === 'en' ? (metricsA.duration === 1 ? 'yr' : 'yrs') : '年'}`}
                  valueB={metricsB.duration === 0 ? t('warModal.durationSameYear') : `${metricsB.duration} ${lang === 'en' ? (metricsB.duration === 1 ? 'yr' : 'yrs') : '年'}`}
                  ratioA={metricsA.duration / maxDuration}
                  ratioB={metricsB.duration / maxDuration}
                  colorA="#7A8B7A"
                  colorB="#7A8B7A"
                />

                <CompareRow
                  icon={<Globe className="h-4 w-4" />}
                  label={t('compare.countries')}
                  valueA={String(metricsA.countries)}
                  valueB={String(metricsB.countries)}
                  ratioA={metricsA.countries / maxCountries}
                  ratioB={metricsB.countries / maxCountries}
                  colorA="#3A3A3A"
                  colorB="#3A3A3A"
                />

                {/* 所属时代 */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border border-archive-border/50 bg-archive-cream/30 p-4">
                  <div className="text-right">
                    <div className="mb-1 flex items-center justify-end gap-1.5 text-xs text-archive-muted">
                      <Calendar className="h-3 w-3" />
                      {t('compare.era')}
                    </div>
                    <span className="font-serif text-sm font-medium text-archive-ink">{metricsA.eraLabel}</span>
                  </div>
                  <div className="h-8 w-px bg-archive-border" />
                  <div className="text-left">
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-archive-muted">
                      <Calendar className="h-3 w-3" />
                      {t('compare.era')}
                    </div>
                    <span className="font-serif text-sm font-medium text-archive-ink">{metricsB.eraLabel}</span>
                  </div>
                </div>

                {/* 涉及国家列表 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-archive-border/50 p-4">
                    <p className="mb-2 flex items-center gap-1.5 text-xs text-archive-muted">
                      <Globe className="h-3 w-3" />
                      {t('compare.countries')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {getCountryNames(warA).map((name, i) => (
                        <span key={i} className="rounded-md bg-archive-cream px-2 py-0.5 text-[11px] text-archive-ink">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-archive-border/50 p-4">
                    <p className="mb-2 flex items-center gap-1.5 text-xs text-archive-muted">
                      <Globe className="h-3 w-3" />
                      {t('compare.countries')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {getCountryNames(warB).map((name, i) => (
                        <span key={i} className="rounded-md bg-archive-cream px-2 py-0.5 text-[11px] text-archive-ink">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== 左右两侧详情面板（可展开/收起） ===== */}
              {/* 两栏并排，每栏独立展开，高度自适应内容；未展开时栏位保留占位避免布局跳动 */}
              <div ref={detailSectionRef} className="mt-6 grid grid-cols-2 gap-4">
                <WarDetailPanel war={warA} expanded={expandedA} accentColor="#B85C4F" side="left" />
                <WarDetailPanel war={warB} expanded={expandedB} accentColor="#C88A3D" side="right" />
              </div>
            </div>

            {/* ===== 底部切换按钮栏（固定贴底，不随内容滚动） ===== */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-archive-border bg-white px-6 py-4">
              <button
                onClick={() => setExpandedA((v) => !v)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all ${
                  expandedA
                    ? 'border-archive-terracotta bg-archive-terracotta/10 text-archive-terracotta shadow-sm'
                    : 'border-archive-border text-archive-ink hover:border-archive-amber hover:bg-archive-amber/5 hover:text-archive-amber'
                }`}
              >
                <Swords className="h-3.5 w-3.5" />
                <span className="max-w-[140px] truncate">{localized(warA, 'name', lang)}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${expandedA ? 'rotate-180' : ''}`} />
                <span className="ml-0.5 rounded bg-archive-cream px-1.5 py-0.5 text-[10px] opacity-80">
                  {expandedA ? t('compare.hideDetail') : t('compare.viewDetail')}
                </span>
              </button>
              <button
                onClick={() => setExpandedB((v) => !v)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all ${
                  expandedB
                    ? 'border-archive-terracotta bg-archive-terracotta/10 text-archive-terracotta shadow-sm'
                    : 'border-archive-border text-archive-ink hover:border-archive-amber hover:bg-archive-amber/5 hover:text-archive-amber'
                }`}
              >
                <Swords className="h-3.5 w-3.5" />
                <span className="max-w-[140px] truncate">{localized(warB, 'name', lang)}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${expandedB ? 'rotate-180' : ''}`} />
                <span className="ml-0.5 rounded bg-archive-cream px-1.5 py-0.5 text-[10px] opacity-80">
                  {expandedB ? t('compare.hideDetail') : t('compare.viewDetail')}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * 战争详情面板：在对比弹窗的左右侧展示对应战争的详细信息。
 *
 * 设计要点：
 * - 卡片化布局，顶部带彩色徽章条（accentColor 区分左右）
 * - 每个信息块带图标徽章 + 标签 + 内容，视觉层次清晰
 * - 背景故事用引用块样式，左侧带彩色竖线
 * - 底部反思提示框带警告图标
 * - 展开收起用高度动画，平滑过渡
 */
function WarDetailPanel({
  war,
  expanded,
  accentColor,
  side,
}: {
  war: War;
  expanded: boolean;
  accentColor: string;
  side: 'left' | 'right';
}) {
  const { t, lang } = useT();
  const belligerents = localizedArray(war, 'belligerents', lang);

  return (
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div
            className="overflow-hidden rounded-xl border border-archive-border bg-gradient-to-b from-archive-cream/40 to-white"
            style={{ borderTopColor: accentColor, borderTopWidth: '3px' }}
          >
            {/* 侧标识 */}
            <div
              className={`flex items-center gap-2 px-4 py-2.5 ${side === 'right' ? 'justify-end' : ''}`}
              style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {side === 'left' ? 'A' : 'B'}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-archive-muted">
                {t('warModal.warDetail')}
              </span>
            </div>

            <div className="space-y-3 p-4">
              {/* 地点 */}
              <div className="flex items-start gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-archive-muted">
                    {t('compare.location')}
                  </p>
                  <p className="mt-0.5 text-sm text-archive-ink">{localized(war, 'location', lang)}</p>
                </div>
              </div>

              {/* 分隔线 */}
              <div className="border-t border-archive-border/40" />

              {/* 交战方 */}
              {belligerents.length > 0 && (
                <>
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                    >
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-archive-muted">
                        {t('compare.belligerents')}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-archive-ink">
                        {belligerents.join(' vs ')}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-archive-border/40" />
                </>
              )}

              {/* 背景故事 - 引用块样式 */}
              <div className="flex items-start gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-archive-muted">
                    {t('compare.background')}
                  </p>
                  <div
                    className="mt-1.5 rounded-r border-l-2 bg-archive-cream/30 py-2 pr-3 pl-3"
                    style={{ borderColor: accentColor }}
                  >
                    <p className="text-xs leading-relaxed text-archive-ink">
                      {localized(war, 'background', lang)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 反思提示框 */}
              <div className="flex items-start gap-2.5 rounded-lg border border-archive-amber/30 bg-archive-amber/5 p-3">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-archive-amber" />
                <p className="text-[11px] leading-relaxed text-archive-muted">
                  {formatCasualties(war.casualties, lang)} {t('warModal.reflection')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CompareRowProps {
  icon: React.ReactNode;
  label: string;
  valueA: string;
  valueB: string;
  ratioA: number;
  ratioB: number;
  colorA: string;
  colorB: string;
}

function CompareRow({ icon, label, valueA, valueB, ratioA, ratioB, colorA, colorB }: CompareRowProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs text-archive-muted">
        {icon}
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* A 侧 */}
        <div className="flex items-center justify-end gap-3">
          <span className="font-mono text-sm font-semibold text-archive-ink">{valueA}</span>
          <div className="h-3 w-24 overflow-hidden rounded-full bg-archive-border/40 md:w-32">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${ratioA * 100}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: colorA }}
            />
          </div>
        </div>
        {/* 中线 */}
        <div className="h-8 w-px bg-archive-border" />
        {/* B 侧 */}
        <div className="flex items-center gap-3">
          <div className="h-3 w-24 overflow-hidden rounded-full bg-archive-border/40 md:w-32">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${ratioB * 100}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: colorB }}
            />
          </div>
          <span className="font-mono text-sm font-semibold text-archive-ink">{valueB}</span>
        </div>
      </div>
    </div>
  );
}
