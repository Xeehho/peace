interface WarSceneIllustrationProps {
  year: number;
  warName: string;
  location: string;
  className?: string;
}

export function WarSceneIllustration({ year, warName, location, className = '' }: WarSceneIllustrationProps) {
  const era = getEra(year);
  const palette = getPalette(era);

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`sky-${era}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.skyTop} />
          <stop offset="60%" stopColor={palette.skyMid} />
          <stop offset="100%" stopColor={palette.skyBottom} />
        </linearGradient>
        <linearGradient id={`ground-${era}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.groundTop} />
          <stop offset="100%" stopColor={palette.groundBottom} />
        </linearGradient>
        <filter id={`smoke-${era}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" />
          <feDisplacementMap in="SourceGraphic" scale="8" />
        </filter>
      </defs>

      {/* 天空 */}
      <rect width="400" height="200" fill={`url(#sky-${era})`} />

      {/* 太阳/月亮 */}
      <circle cx="320" cy="70" r="28" fill={palette.sun} opacity="0.9" />

      {/* 远山 */}
      <path
        d="M0 180 L60 140 L100 165 L160 120 L220 155 L280 130 L340 160 L400 145 L400 200 L0 200 Z"
        fill={palette.mountainsFar}
        opacity="0.5"
      />
      <path
        d="M0 190 L40 160 L100 180 L160 150 L220 175 L280 155 L340 180 L400 165 L400 200 L0 200 Z"
        fill={palette.mountainsNear}
        opacity="0.7"
      />

      {/* 烟雾 */}
      {[...Array(4)].map((_, i) => (
        <g key={i} opacity="0.3">
          <ellipse
            cx={80 + i * 90 + Math.sin(i * 2) * 20}
            cy={120 + i * 15}
            rx={35 + i * 8}
            ry={18 + i * 4}
            fill={palette.smoke}
            filter={`url(#smoke-${era})`}
          />
        </g>
      ))}

      {/* 地面 */}
      <rect y="200" width="400" height="100" fill={`url(#ground-${era})`} />

      {/* 战场元素 - 按时代渲染 */}
      {renderBattlefield(era, palette)}

      {/* 战争名称（手写风格） */}
      <text
        x="20"
        y="30"
        fontFamily="'Playfair Display', serif"
        fontSize="14"
        fill={palette.text}
        opacity="0.85"
        fontWeight="500"
      >
        {warName.length > 24 ? warName.slice(0, 22) + '...' : warName}
      </text>
      <text
        x="20"
        y="50"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="9"
        fill={palette.text}
        opacity="0.6"
      >
        {location.length > 30 ? location.slice(0, 28) + '...' : location}
      </text>
    </svg>
  );
}

function renderBattlefield(era: string, palette: any) {
  switch (era) {
    case 'ancient':
      return (
        <g>
          {/* 古代军队阵列 */}
          {[...Array(5)].map((_, i) => (
            <g key={i}>
              {/* 盾牌兵 */}
              <rect
                x={40 + i * 18}
                y={220}
                width="10"
                height="22"
                fill={palette.soldierBody}
              />
              <ellipse
                cx={45 + i * 18}
                cy={216}
                rx="4"
                ry="5"
                fill={palette.soldierBody}
              />
              {/* 长矛 */}
              <line
                x1={45 + i * 18}
                y1={216}
                x2={47 + i * 18}
                y2={180}
                stroke={palette.weapon}
                strokeWidth="1.5"
              />
            </g>
          ))}
          {/* 战车 */}
          <g transform="translate(280, 215)">
            <rect x="0" y="8" width="30" height="12" fill={palette.vehicle} />
            <circle cx="6" cy="22" r="7" fill="none" stroke={palette.vehicle} strokeWidth="2" />
            <circle cx="24" cy="22" r="7" fill="none" stroke={palette.vehicle} strokeWidth="2" />
            <rect x="12" y="-10" width="3" height="18" fill={palette.flag} />
            <path d="M15 -10 L25 -6 L15 -2" fill={palette.flag} />
          </g>
          {/* 城墙剪影 */}
          <path
            d="M0 200 L0 180 L10 180 L10 175 L15 175 L15 180 L25 180 L25 175 L30 175 L30 180 L40 180 L40 200 Z"
            fill={palette.wall}
            opacity="0.6"
          />
        </g>
      );
    case 'medieval':
      return (
        <g>
          {/* 城堡剪影 */}
          <g opacity="0.5">
            <rect x="300" y="150" width="70" height="50" fill={palette.wall} />
            <rect x="295" y="140" width="15" height="15" fill={palette.wall} />
            <rect x="335" y="140" width="15" height="15" fill={palette.wall} />
            <rect x="350" y="120" width="20" height="30" fill={palette.wall} />
            <polygon points="345,120 360,105 375,120" fill={palette.roof} />
          </g>
          {/* 骑士 */}
          {[...Array(3)].map((_, i) => (
            <g key={i} transform={`translate(${60 + i * 50}, 215)`}>
              {/* 马 */}
              <ellipse cx="0" cy="10" rx="14" ry="8" fill={palette.horse} />
              <rect x="-14" y="12" width="3" height="8" fill={palette.horse} />
              <rect x="11" y="12" width="3" height="8" fill={palette.horse} />
              {/* 骑士 */}
              <rect x="-4" y="-10" width="8" height="14" fill={palette.armor} />
              <circle cx="0" cy="-14" r="5" fill={palette.armor} />
              {/* 剑 */}
              <line x1="8" y1="-8" x2="20" y2="-15" stroke={palette.weapon} strokeWidth="2" />
            </g>
          ))}
          {/* 旗帜 */}
          <line x1="120" y1="195" x2="120" y2="160" stroke={palette.flag} strokeWidth="1.5" />
          <path d="M120 160 L150 166 L120 172" fill={palette.flag} />
        </g>
      );
    case 'earlyModern':
      return (
        <g>
          {/* 步兵线阵 */}
          {[...Array(8)].map((_, i) => (
            <g key={i}>
              <rect
                x={30 + i * 14}
                y={220}
                width="8"
                height="20"
                fill={palette.soldierBody}
              />
              <circle cx={34 + i * 14} cy={217} r="4" fill={palette.soldierBody} />
              {/* 火枪 */}
              <line
                x1={38 + i * 14}
                y1={222}
                x2={55 + i * 14}
                y2={220}
                stroke={palette.weapon}
                strokeWidth="1.5"
              />
            </g>
          ))}
          {/* 大炮 */}
          <g transform="translate(280, 225)">
            <ellipse cx="0" cy="0" rx="20" ry="6" fill={palette.cannon} />
            <rect x="-5" y="-8" width="25" height="6" fill={palette.cannon} />
            <circle cx="-8" cy="0" r="3" fill={palette.wheel} />
            <circle cx="10" cy="0" r="3" fill={palette.wheel} />
          </g>
          {/* 硝烟 */}
          <ellipse cx="310" cy="200" rx="25" ry="12" fill={palette.smoke} opacity="0.6" />
        </g>
      );
    case 'industrial':
      return (
        <g>
          {/* 战壕 */}
          <path
            d="M0 245 Q100 255 200 245 T400 250 L400 300 L0 300 Z"
            fill={palette.trench}
          />
          {/* 铁丝网 */}
          {[...Array(5)].map((_, i) => (
            <g key={i}>
              <line
                x1={50 + i * 70}
                y1="235"
                x2={80 + i * 70}
                y2="250"
                stroke={palette.barbed}
                strokeWidth="1"
              />
              <circle cx={50 + i * 70} cy="235" r="2" fill={palette.barbed} />
              <circle cx={80 + i * 70} cy="250" r="2" fill={palette.barbed} />
            </g>
          ))}
          {/* 士兵 */}
          <g transform="translate(150, 228)">
            <rect x="0" y="0" width="10" height="18" fill={palette.soldierBody} />
            <circle cx="5" cy="-3" r="4" fill={palette.soldierBody} />
            <line x1="10" y1="4" x2="28" y2="2" stroke={palette.weapon} strokeWidth="2" />
          </g>
          {/* 气球/飞艇 */}
          <g opacity="0.5">
            <ellipse cx="200" cy="80" rx="30" ry="15" fill={palette.balloon} />
            <line x1="200" y1="95" x2="200" y2="120" stroke={palette.rope} strokeWidth="1" />
            <rect x="190" y="120" width="20" height="8" fill={palette.balloon} />
          </g>
        </g>
      );
    case 'ww':
      return (
        <g>
          {/* 坦克 */}
          <g transform="translate(60, 225)">
            <rect x="0" y="0" width="50" height="18" fill={palette.vehicle} />
            <rect x="12" y="-10" width="25" height="10" fill={palette.vehicle} />
            <rect x="35" y="-6" width="25" height="4" fill={palette.weapon} />
            <circle cx="10" cy="20" r="5" fill={palette.track} />
            <circle cx="25" cy="20" r="5" fill={palette.track} />
            <circle cx="40" cy="20" r="5" fill={palette.track} />
          </g>
          {/* 战壕与士兵 */}
          <path
            d="M200 250 Q250 260 300 255 Q350 250 400 258 L400 300 L200 300 Z"
            fill={palette.trench}
          />
          <g transform="translate(240, 235)">
            <rect x="0" y="0" width="9" height="18" fill={palette.soldierBody} />
            <circle cx="4.5" cy="-3" r="4" fill={palette.helmet} />
            <line x1="9" y1="3" x2="25" y2="1" stroke={palette.weapon} strokeWidth="2" />
          </g>
          {/* 战斗机 */}
          <g transform="translate(280, 90)" opacity="0.7">
            <ellipse cx="0" cy="0" rx="25" ry="4" fill={palette.vehicle} />
            <rect x="10" y="-2" width="15" height="3" fill={palette.vehicle} />
            <ellipse cx="-8" cy="-12" rx="15" ry="3" fill={palette.vehicle} />
            <ellipse cx="-8" cy="12" rx="15" ry="3" fill={palette.vehicle} />
          </g>
          {/* 爆炸 */}
          <g opacity="0.7">
            <circle cx="330" cy="200" r="15" fill={palette.explosion} />
            <circle cx="330" cy="200" r="25" fill={palette.explosion} opacity="0.4" />
          </g>
        </g>
      );
    case 'coldWar':
    default:
      return (
        <g>
          {/* 城市废墟 */}
          <g opacity="0.5">
            <rect x="280" y="170" width="25" height="50" fill={palette.building} />
            <rect x="320" y="150" width="20" height="70" fill={palette.building} />
            <rect x="355" y="190" width="30" height="30" fill={palette.building} />
            <polygon points="300,170 312,165 320,172 308,180" fill={palette.rubble} />
          </g>
          {/* 现代士兵 */}
          <g transform="translate(80, 222)">
            <rect x="0" y="0" width="10" height="20" fill={palette.soldierBody} />
            <circle cx="5" cy="-4" r="4.5" fill={palette.helmet} />
            <line x1="10" y1="4" x2="28" y2="3" stroke={palette.weapon} strokeWidth="2.5" />
            <rect x="22" y="1" width="6" height="5" fill={palette.weapon} />
          </g>
          <g transform="translate(140, 225)">
            <rect x="0" y="0" width="9" height="17" fill={palette.soldierBody} />
            <circle cx="4.5" cy="-3" r="4" fill={palette.helmet} />
            <line x1="9" y1="3" x2="25" y2="2" stroke={palette.weapon} strokeWidth="2" />
          </g>
          {/* 装甲车 */}
          <g transform="translate(220, 228)">
            <rect x="0" y="0" width="40" height="15" fill={palette.vehicle} />
            <rect x="8" y="-8" width="20" height="8" fill={palette.vehicle} />
            <circle cx="8" cy="17" r="4" fill={palette.track} />
            <circle cx="20" cy="17" r="4" fill={palette.track} />
            <circle cx="32" cy="17" r="4" fill={palette.track} />
          </g>
          {/* 直升机 */}
          <g transform="translate(250, 70)" opacity="0.6">
            <ellipse cx="0" cy="0" rx="20" ry="8" fill={palette.vehicle} />
            <line x1="-25" y1="0" x2="30" y2="0" stroke={palette.vehicle} strokeWidth="2" />
            <rect x="18" y="-1" width="15" height="2.5" fill={palette.vehicle} />
          </g>
        </g>
      );
  }
}

type Era = 'ancient' | 'medieval' | 'earlyModern' | 'industrial' | 'ww' | 'coldWar';

function getEra(year: number): Era {
  if (year < 500) return 'ancient';
  if (year < 1500) return 'medieval';
  if (year < 1750) return 'earlyModern';
  if (year < 1900) return 'industrial';
  if (year < 1950) return 'ww';
  return 'coldWar';
}

function getPalette(era: string) {
  const palettes: Record<Era, any> = {
    ancient: {
      skyTop: '#c9a87c',
      skyMid: '#e8d4a8',
      skyBottom: '#f5e6c8',
      groundTop: '#8b7355',
      groundBottom: '#6b5344',
      sun: '#f0d78c',
      mountainsFar: '#7a6a5a',
      mountainsNear: '#5a4a3a',
      smoke: '#8a7a6a',
      soldierBody: '#5a4a3a',
      weapon: '#c0a080',
      vehicle: '#6a5a4a',
      flag: '#b85c4f',
      wall: '#7a6a5a',
      horse: '#5a4a3a',
      armor: '#9a8a7a',
      roof: '#8b4513',
      cannon: '#3a3a3a',
      wheel: '#2a2a2a',
      text: '#1f1f1f',
    },
    medieval: {
      skyTop: '#4a5a6a',
      skyMid: '#7a8a9a',
      skyBottom: '#aab0c0',
      groundTop: '#4a6a3a',
      groundBottom: '#3a4a2a',
      sun: '#e8d8b0',
      mountainsFar: '#3a4a5a',
      mountainsNear: '#2a3a4a',
      smoke: '#6a6a6a',
      soldierBody: '#5a3a2a',
      weapon: '#c0c0c0',
      vehicle: '#6a5a4a',
      flag: '#b85c4f',
      wall: '#5a5a5a',
      horse: '#4a3a2a',
      armor: '#8a8a8a',
      roof: '#5a3a2a',
      cannon: '#3a3a3a',
      wheel: '#2a2a2a',
      text: '#f5f5f5',
    },
    earlyModern: {
      skyTop: '#6a7a8a',
      skyMid: '#9aacbc',
      skyBottom: '#ccdde8',
      groundTop: '#6a7a4a',
      groundBottom: '#4a5a3a',
      sun: '#f5e0a0',
      mountainsFar: '#5a6a7a',
      mountainsNear: '#4a5a6a',
      smoke: '#7a7a7a',
      soldierBody: '#4a3a6a',
      weapon: '#8a8a8a',
      vehicle: '#5a4a3a',
      flag: '#b85c4f',
      wall: '#6a6a6a',
      horse: '#4a3a2a',
      armor: '#7a7a7a',
      roof: '#5a3a2a',
      cannon: '#3a3a3a',
      wheel: '#2a2a2a',
      text: '#1f1f1f',
    },
    industrial: {
      skyTop: '#5a5a6a',
      skyMid: '#7a7a8a',
      skyBottom: '#9a9aaa',
      groundTop: '#5a6a4a',
      groundBottom: '#4a5a3a',
      sun: '#d8d0b0',
      mountainsFar: '#4a4a5a',
      mountainsNear: '#3a3a4a',
      smoke: '#5a5a5a',
      soldierBody: '#3a4a5a',
      weapon: '#6a6a6a',
      vehicle: '#4a4a4a',
      flag: '#b85c4f',
      wall: '#5a5a5a',
      horse: '#4a3a2a',
      armor: '#6a6a6a',
      roof: '#4a3a2a',
      cannon: '#3a3a3a',
      wheel: '#2a2a2a',
      trench: '#5a4a3a',
      barbed: '#6a6a6a',
      balloon: '#b85c4f',
      rope: '#5a4a3a',
      text: '#f5f5f5',
    },
    ww: {
      skyTop: '#3a3a4a',
      skyMid: '#5a5a6a',
      skyBottom: '#7a7a8a',
      groundTop: '#4a5a3a',
      groundBottom: '#3a4a2a',
      sun: '#c8b898',
      mountainsFar: '#2a2a3a',
      mountainsNear: '#1a1a2a',
      smoke: '#4a4a4a',
      soldierBody: '#4a5a4a',
      weapon: '#5a5a5a',
      vehicle: '#4a4a4a',
      helmet: '#3a4a3a',
      track: '#2a2a2a',
      explosion: '#c88a3d',
      trench: '#5a4a3a',
      flag: '#b85c4f',
      text: '#e5e5e5',
    },
    coldWar: {
      skyTop: '#2a3a4a',
      skyMid: '#4a5a6a',
      skyBottom: '#6a7a8a',
      groundTop: '#5a6a4a',
      groundBottom: '#3a4a2a',
      sun: '#a8b8c8',
      mountainsFar: '#1a2a3a',
      mountainsNear: '#0a1a2a',
      smoke: '#3a3a3a',
      soldierBody: '#3a4a3a',
      weapon: '#5a5a5a',
      vehicle: '#4a4a4a',
      helmet: '#3a4a3a',
      track: '#1a1a1a',
      building: '#4a4a4a',
      rubble: '#5a5a5a',
      flag: '#b85c4f',
      text: '#d5d5d5',
    },
  };
  return palettes[era as Era] || palettes.coldWar;
}
