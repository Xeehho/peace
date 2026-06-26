import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { formatCasualties, formatYearRange } from '@/utils/format';
import { useT, localized } from '@/i18n/useT';
import type { War, Country } from '@/types';

interface ConflictNetworkProps {
  wars: War[];
  countries: Country[];
}

// ===== 节点与连线类型 =====
interface GraphNode {
  id: string;
  name: string;
  nameEn: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  participation: number; // 参与战争数，决定节点大小
  isDragging: boolean;
}

interface GraphLink {
  source: string;
  target: string;
  wars: War[]; // 两点之间的所有战争
  totalCasualties: number;
}

// 力导向布局参数
const REPULSION = 1800; // 节点间斥力强度
const SPRING_LENGTH = 120; // 连线弹簧自然长度
const SPRING_K = 0.04; // 弹簧系数
const CENTER_K = 0.01; // 向中心拉力
const DAMPING = 0.82; // 阻尼
const MAX_VELOCITY = 6;

/**
 * 交战方关系网络图：力导向布局展示国家间的战争关系。
 *
 * - 节点 = 国家，大小由参与战争数决定
 * - 连线 = 两国曾发生战争，粗细由累计伤亡决定
 * - 节点可拖拽，点击连线弹出该两国之间的战争列表
 * - 力学模拟在 useEffect 中用 rAF 循环驱动
 */
export function ConflictNetwork({ wars, countries }: ConflictNetworkProps) {
  const { t, lang } = useT();
  const { setSelectedWar } = useAppStore();
  const svgRef = useRef<SVGSVGElement>(null);

  // 容器尺寸（响应式）
  const [size, setSize] = useState({ width: 900, height: 520 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: 520 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 构建节点和连线
  const { nodes, links, maxCasualties } = useMemo(() => {
    const countryMap = new Map(countries.map((c) => [c.id, c]));
    const participation = new Map<string, number>();
    const linkMap = new Map<string, GraphLink>();

    wars.forEach((war) => {
      // 为每对相关国家建立连线
      const ids = war.relatedCountryIds;
      for (let i = 0; i < ids.length; i++) {
        participation.set(ids[i], (participation.get(ids[i]) ?? 0) + 1);
        for (let j = i + 1; j < ids.length; j++) {
          const a = ids[i];
          const b = ids[j];
          if (a === b) continue;
          const key = a < b ? `${a}|${b}` : `${b}|${a}`;
          const existing = linkMap.get(key);
          if (existing) {
            existing.wars.push(war);
            existing.totalCasualties += war.casualties;
          } else {
            linkMap.set(key, {
              source: a < b ? a : b,
              target: a < b ? b : a,
              wars: [war],
              totalCasualties: war.casualties,
            });
          }
        }
      }
    });

    // 只保留参与 ≥1 场战争的国家作为节点
    const nodeList: GraphNode[] = [];
    participation.forEach((count, id) => {
      const c = countryMap.get(id);
      if (!c) return;
      const angle = Math.random() * Math.PI * 2;
      const r = 150 + Math.random() * 100;
      nodeList.push({
        id,
        name: c.name,
        nameEn: c.nameEn,
        x: size.width / 2 + Math.cos(angle) * r,
        y: size.height / 2 + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        participation: count,
        isDragging: false,
      });
    });

    const linkList = Array.from(linkMap.values());
    const maxC = Math.max(...linkList.map((l) => l.totalCasualties), 1);

    return { nodes: nodeList, links: linkList, maxCasualties: maxC };
  }, [wars, countries, size.width, size.height]);

  // 节点状态（可变引用，力学模拟直接修改）
  const nodesRef = useRef<GraphNode[]>([]);
  const [tick, setTick] = useState(0); // 触发重渲染
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // 同步 nodesRef
  useEffect(() => {
    // 保留已有位置（如果节点数量一致），否则用新数据
    if (nodesRef.current.length === nodes.length) {
      nodes.forEach((n, i) => {
        nodesRef.current[i].participation = n.participation;
      });
    } else {
      nodesRef.current = nodes.map((n) => ({ ...n }));
    }
    setTick((t) => t + 1);
  }, [nodes]);

  // 力学模拟主循环
  useEffect(() => {
    let rafId = 0;
    const cx = size.width / 2;
    const cy = size.height / 2;

    const simulate = () => {
      const ns = nodesRef.current;
      if (ns.length === 0) {
        rafId = requestAnimationFrame(simulate);
        return;
      }

      // 重置受力（用 vx/vy 累积）
      // 1. 节点间斥力
      for (let i = 0; i < ns.length; i++) {
        const a = ns[i];
        if (a.isDragging) continue;
        for (let j = i + 1; j < ns.length; j++) {
          const b = ns[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy + 0.01;
          const dist = Math.sqrt(dist2);
          const force = REPULSION / dist2;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx;
          a.vy += fy;
          if (!b.isDragging) {
            b.vx -= fx;
            b.vy -= fy;
          }
        }
      }

      // 2. 连线弹簧力
      links.forEach((link) => {
        const a = ns.find((n) => n.id === link.source);
        const b = ns.find((n) => n.id === link.target);
        if (!a || !b) return;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const displacement = dist - SPRING_LENGTH;
        const force = SPRING_K * displacement;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (!a.isDragging) {
          a.vx += fx;
          a.vy += fy;
        }
        if (!b.isDragging) {
          b.vx -= fx;
          b.vy -= fy;
        }
      });

      // 3. 向中心拉力 + 阻尼 + 位置更新
      ns.forEach((n) => {
        if (n.isDragging) {
          n.vx = 0;
          n.vy = 0;
          return;
        }
        n.vx += (cx - n.x) * CENTER_K;
        n.vy += (cy - n.y) * CENTER_K;
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        // 限速
        const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (sp > MAX_VELOCITY) {
          n.vx = (n.vx / sp) * MAX_VELOCITY;
          n.vy = (n.vy / sp) * MAX_VELOCITY;
        }
        n.x += n.vx;
        n.y += n.vy;
        // 边界
        const margin = 30;
        n.x = Math.max(margin, Math.min(size.width - margin, n.x));
        n.y = Math.max(margin, Math.min(size.height - margin, n.y));
      });

      setTick((t) => t + 1);
      rafId = requestAnimationFrame(simulate);
    };

    rafId = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(rafId);
  }, [links, size.width, size.height]);

  // 拖拽处理
  const onNodePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.preventDefault();
    const node = nodesRef.current.find((n) => n.id === id);
    if (!node) return;
    node.isDragging = true;
    setDraggingId(id);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const node = nodesRef.current.find((n) => n.id === draggingId);
    if (node) {
      node.x = x;
      node.y = y;
    }
  }, [draggingId]);

  const onNodePointerUp = useCallback((e: React.PointerEvent) => {
    const node = nodesRef.current.find((n) => n.id === draggingId);
    if (node) node.isDragging = false;
    setDraggingId(null);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }, [draggingId]);

  // 节点大小映射
  const maxParticipation = Math.max(...nodes.map((n) => n.participation), 1);
  const getRadius = (p: number) => 8 + (p / maxParticipation) * 14;

  // 节点位置映射（tick 触发重渲染时读取最新值）
  // tick 用于在力学模拟更新位置后触发重渲染
  void tick;
  const ns = nodesRef.current;

  return (
    <section className="px-6 pb-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-archive-terracotta">⬡</span>
          <h2 className="font-serif text-2xl font-medium text-archive-ink md:text-3xl">
            {t('network.title')}
          </h2>
        </div>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-archive-muted">
          {t('network.subtitle')}
        </p>
        <p className="mb-6 text-xs text-archive-sage">{t('network.dragHint')}</p>

        <div
          ref={containerRef}
          className="relative rounded-2xl border border-archive-border bg-white p-4 shadow-soft md:p-6"
        >
          <svg
            ref={svgRef}
            width={size.width}
            height={size.height}
            className="touch-none"
            onPointerMove={onPointerMove}
            onPointerUp={onNodePointerUp}
            onPointerLeave={onNodePointerUp}
          >
            {/* 连线 */}
            {links.map((link, i) => {
              const a = ns.find((n) => n.id === link.source);
              const b = ns.find((n) => n.id === link.target);
              if (!a || !b) return null;
              const widthRatio = Math.sqrt(link.totalCasualties / maxCasualties);
              const strokeWidth = 0.8 + widthRatio * 6;
              const isActive = selectedLink === link || hoveredLink === link;
              return (
                <line
                  key={`${link.source}-${link.target}-${i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={isActive ? '#B85C4F' : '#C88A3D'}
                  strokeWidth={strokeWidth}
                  strokeOpacity={isActive ? 0.9 : 0.35}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredLink(link)}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={() => setSelectedLink(selectedLink === link ? null : link)}
                />
              );
            })}

            {/* 节点 */}
            {ns.map((node) => {
              const r = getRadius(node.participation);
              const isDragging = draggingId === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-grab active:cursor-grabbing"
                  onPointerDown={(e) => onNodePointerDown(e, node.id)}
                >
                  {/* 外环光晕 */}
                  <circle
                    r={r + 4}
                    fill="#C88A3D"
                    opacity={isDragging ? 0.3 : 0.12}
                    className="transition-opacity"
                  />
                  {/* 主体 */}
                  <circle
                    r={r}
                    fill={isDragging ? '#B85C4F' : '#7A8B7A'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-colors"
                  />
                  {/* 标签 */}
                  <text
                    y={r + 12}
                    textAnchor="middle"
                    className="pointer-events-none select-none fill-archive-ink text-[10px] font-medium"
                    style={{ fontFamily: 'inherit' }}
                  >
                    {localized({ name: node.name, nameEn: node.nameEn }, 'name', lang)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* 连线详情浮层 */}
          {selectedLink && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-4 top-4 max-w-xs rounded-xl border border-archive-border bg-white p-4 shadow-lg"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-serif text-sm font-medium text-archive-ink">
                  {localized({ name: countries.find((c) => c.id === selectedLink.source)?.name ?? '', nameEn: countries.find((c) => c.id === selectedLink.source)?.nameEn ?? '' }, 'name', lang)}
                  {' ↔ '}
                  {localized({ name: countries.find((c) => c.id === selectedLink.target)?.name ?? '', nameEn: countries.find((c) => c.id === selectedLink.target)?.nameEn ?? '' }, 'name', lang)}
                </h4>
                <button
                  onClick={() => setSelectedLink(null)}
                  className="ml-2 text-archive-muted hover:text-archive-ink"
                  aria-label="close"
                >
                  ✕
                </button>
              </div>
              <p className="mb-3 text-xs text-archive-muted">
                {selectedLink.wars.length} {t('network.warsBetween')} · {formatCasualties(selectedLink.totalCasualties, lang)} {t('network.casualtiesBetween')}
              </p>
              <div className="max-h-48 space-y-1.5 overflow-y-auto">
                {selectedLink.wars
                  .sort((a, b) => b.casualties - a.casualties)
                  .map((war) => (
                    <button
                      key={war.id}
                      onClick={() => {
                        setSelectedWar(war.id);
                        setSelectedLink(null);
                      }}
                      className="block w-full rounded-md border border-archive-border/50 bg-archive-cream/40 px-2.5 py-1.5 text-left text-xs transition-colors hover:border-archive-amber hover:bg-archive-amber/10"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium text-archive-ink">
                          {localized(war, 'name', lang)}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-archive-terracotta">
                          {formatCasualties(war.casualties, lang)}
                        </span>
                      </div>
                      <span className="text-[10px] text-archive-muted">
                        {formatYearRange(war.startYear, war.endYear, lang)}
                      </span>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* 图例 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-archive-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7A8B7A]" />
            <span>{t('network.warsBetween')}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-px w-6 bg-[#C88A3D]" style={{ height: 1 }} />
            <span>{t('network.casualtiesBetween')}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
