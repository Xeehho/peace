import type { Language } from '@/types';

/**
 * 中英文 UI 文案字典。
 * 通过 t('a.b.c') 形式访问，返回当前语言对应文本。
 */
export const translations = {
  zh: {
    nav: {
      home: '首页',
      timeline: '时间线',
      insights: '数据洞察',
      about: '关于',
      cta: '行动呼吁',
      brand: '和平纪年',
    },
    lang: {
      switch: 'EN',
      label: 'English',
    },
    hero: {
      badge: 'War & Peace Archive',
      title1: '停止战争，',
      title2: '铭记历史。',
      subtitle:
        '每一场战争背后，都是无数被改写的人生。我们记录历史，不是为了延续仇恨，而是为了选择和平。',
    },
    home: {
      loading: '正在加载历史档案...',
      controlsHint: '左键拖拽旋转 · 滚轮缩放 · 右键平移',
    },
    stats: {
      badge: 'The Cost of War',
      title: '战争的代价',
      subtitle: '每一个数字背后，都是一个个真实存在过的人——父亲、儿子、丈夫、朋友。',
      recordedWars: '有记录的战争',
      totalCasualties: '累计伤亡人数',
      involvedCountries: '涉及国家与地区',
      yearSpan: '跨越年数',
    },
    highlights: {
      badge: 'Major Conflicts',
      title: '重大战争档案',
      viewAll: '查看全部时间线',
      casualties: '伤亡',
      viewDetail: '查看详情',
    },
    quotes: {
      badge: 'Voices for Peace',
      title: '和平之声',
      prev: '上一条',
      next: '下一条',
      indicator: (i: number) => `第 ${i} 条`,
    },
    cta: {
      title: '战争没有赢家，只有幸存者。',
      subtitle:
        '历史教会我们，冲突的代价永远无法衡量。今天的选择，将决定明天的世界。愿每一份记忆都成为和平的基石。',
      button: '支持联合国和平倡议',
      footnote: '让历史照亮未来的和平之路',
    },
    timeSlider: {
      label: '时间筛选',
    },
    viewToggle: {
      backToGlobal: '返回全球视角',
    },
    countryPanel: {
      involvedWars: '参与战争',
      totalCasualties: '累计伤亡',
      warRecords: '战争记录',
      noRecords: '暂无相关战争记录。',
      casualties: '伤亡',
    },
    warModal: {
      backToCountry: '返回国家',
      warDetail: 'War Detail',
      location: '地点',
      casualties: '伤亡人数',
      belligerents: '参战方',
      impact: '战争影响',
      duration: '持续时长',
      durationSameYear: '同年爆发与结束',
      durationYears: (n: number) => `${n} 年`,
      casualtyRatio: '占记录总伤亡比',
      involvedCountries: '涉及国家与地区',
      background: '背景故事',
      reflection:
        '不是一个冰冷的数字，而是无数被战争吞噬的人生——每一个数字背后，都是一个完整的故事。',
      figures: '同时期人物',
      attires: '各国着装',
      unknownCountry: '未知国家',
      attireAlt: (name: string) => `${name} 着装`,
    },
    timeline: {
      badge: 'Timeline',
      title: '人类战争编年史',
      subtitle: '曲线穿过每个时间锚点，把人类历史上重大的战争串联成一条可见的伤痕脉络。',
      scrollLeft: '向左滚动',
      scrollRight: '向右滚动',
      casualties: '伤亡',
      loading: '正在加载历史档案...',
    },
    insights: {
      badge: 'Insights',
      title: '数据洞察',
      subtitle:
        '每一个数字背后，都是一段无法挽回的生命记忆。透过数据的棱镜，我们重新审视人类冲突的规模与代价。',
      loading: '正在加载数据洞察...',
      statTotalWars: '记录战争总数',
      statTotalCasualties: '累计伤亡人数',
      statInvolvedCountries: '涉及国家数',
      statYearSpan: '跨越年数',
      eraTrendTitle: '伤亡人数时代趋势',
      eraTrendSubtitle: '按时代分组统计累计伤亡，观察人类冲突规模随文明演进的变迁。',
      eraTooltip: (c: string, n: number) => `${c} · ${n} 场`,
      topWarsTitle: '伤亡最惨重的战争 TOP 10',
      topWarsSubtitle: '按伤亡人数排序，十场代价最为沉重的战争，每一场都改写了历史的走向。',
      participationTitle: '国家参与战争热度',
      participationSubtitle: '按参与战争数量排序的前 15 个国家，圆点大小代表参与程度。',
      reflection1a: '当我们把战争的代价折算成数字，',
      reflection1b: '看到的不是冷峻的统计，而是无数个未及告别的人生。',
      reflection2:
        '每一次冲突都在历史的岩层上留下裂痕。愿这些数字不仅记录过去，更能提醒未来——和平从来不是理所当然，它是每一代人都必须守护的承诺。',
      eras: {
        ancient: { label: '古代', subtitle: '公元前 — 476' },
        medieval: { label: '中世纪', subtitle: '476 — 1453' },
        earlyModern: { label: '近代', subtitle: '1453 — 1900' },
        contemporary: { label: '现代', subtitle: '1900 — 至今' },
      },
    },
    about: {
      heroBadge: 'About',
      heroTitle: '关于和平纪年',
      heroSubtitle: '以数据为笔，以记忆为墨，记录人类战争史，唤醒对和平的珍视。',
      quote1: '每一场战争都是一道刻在人类身上的伤痕。',
      quote2: '我们记录它们，并非为了颂扬，',
      quote3: '而是希望有朝一日，这些伤痕不再增加。',
      missionBadge: 'Mission',
      missionTitle: '我们的使命',
      missions: [
        {
          title: '记录历史',
          description:
            '以客观、克制的姿态记录人类战争史，让事实本身说话。我们力求跨越文化与立场的藩篱，呈现冲突的多重面貌。',
        },
        {
          title: '唤醒反思',
          description:
            '通过数据可视化与时空叙事，让冰冷的数字重新具备重量，促使每一位访客在历史面前驻足反思。',
        },
        {
          title: '呼吁和平',
          description:
            '连接过去与未来，将历史的伤痕转化为前行的警醒。我们相信，记忆是和平最坚实的基石。',
        },
      ],
      whyBadge: 'Why',
      whyTitle: '为什么记录战争？',
      whyTexts: [
        '战争是人类历史中最沉重的话题。它既塑造了国界、政体与文明的走向，也吞噬了无数个体的命运与可能。记录战争，并非出于对暴力的迷恋，而是出于对真相的尊重——只有正视伤痕，才能理解今日世界何以如此。',
        '数字本身是冰冷的，但每一个数字背后，都是一个曾有名有姓的人，一段被中断的人生，一个被改写的家庭。当我们把数千年的冲突并置在同一张时间线上，看到的不是荣耀的史诗，而是反复重演的代价。',
        '历史不会自动教会我们什么，唯有被铭记、被讲述、被反思，它才具备意义。我们希望这份档案能成为一面镜子——既照见过去，也映出未来。',
      ],
      santayanaQuote: '不能铭记过去的人，注定要重蹈覆辙。',
      santayanaAuthor: '— 乔治·桑塔亚那',
      methodologyBadge: 'Methodology',
      methodologyTitle: '方法论',
      methodologySubtitle:
        '从史料到屏幕，我们尝试以严谨而克制的方式，将战争的复杂性转化为可被理解的叙事。',
      methodology: [
        {
          title: '数据来源',
          description:
            '汇集历史文献、学术研究、联合国与红十字国际委员会的公开数据，交叉比对以尽可能接近真实。',
        },
        {
          title: '可视化方法',
          description:
            '运用 3D 地球、时间曲线、统计图表等多种形式，将抽象的数字转化为可被感知的视觉语言。',
        },
        {
          title: '持续更新',
          description:
            '历史研究从未停止，本档案亦随之修订。我们会定期校订条目、补充来源、修正偏差。',
        },
      ],
      sourcesBadge: 'Sources',
      sourcesTitle: '数据来源',
      sourcesSubtitle:
        '本档案的数据综合参考了以下来源，并尽可能进行交叉验证。任何史实都欢迎指正。',
      sources: [
        {
          title: '历史百科全书',
          description: '综合性的通史与断代史百科，提供战争条目的基础框架与时间锚点。',
        },
        {
          title: '军事史学术研究',
          description: '参考国内外军事史专著与论文，获取战役细节、伤亡评估与战略分析。',
        },
        {
          title: '联合国与红十字国际委员会数据',
          description: '近现代冲突的人道影响、平民伤亡与流离失所数据的重要来源。',
        },
        {
          title: '维基百科战争列表',
          description: '作为广覆盖的索引工具，用于发现条目并追溯其原始引用。',
        },
        {
          title: 'Project Gutenberg 历史文献',
          description: '提供大量公版原始文献、回忆录与年代记，支撑第一手史料的阅读。',
        },
      ],
      techBadge: 'Technology',
      techTitle: '技术实现',
      techSubtitle:
        '我们借助现代 Web 技术，让历史的呈现不再局限于纸页，而是可被探索、被交互的时空。',
      techStack: [
        { label: 'Three.js / React Three Fiber', desc: '3D 地球与战争锚点的空间呈现' },
        { label: 'React 18 + TypeScript', desc: '组件化架构与类型安全的数据流' },
        { label: 'Framer Motion', desc: '页面过渡与数据入场的动效编排' },
        { label: 'Tailwind CSS', desc: 'archive 配色体系与一致的视觉语言' },
        { label: 'Vite + Zustand', desc: '极速构建与轻量全局状态管理' },
      ],
      ackBadge: 'Acknowledgements',
      ackTitle: '致谢',
      ackText:
        '感谢开源社区，是 React、Three.js、Framer Motion 等项目让这份档案得以诞生；感谢一代代历史学者与档案工作者，他们的考据与整理是我们一切数据的根基；也感谢每一位驻足于此的访客——记忆之所以有意义，是因为有人愿意记得。',
      ackFootnote: '愿和平与每一位阅读者同在',
    },
    format: {
      bc: (n: number) => `公元前 ${n} 年`,
      ad: (n: number) => `${n} 年`,
    },
    toll: {
      badge: 'The Human Toll',
      title: '每一个数字，都是一段人生',
      subtitle: '当数字缓慢攀升，请感受它的重量。这不仅是统计，而是无数被战争改写的命运。',
      counting: '正在计数...',
      milestone1: '已达到一座小城的人口',
      milestone2: '相当于一座大城市的消失',
      milestone3: '已超过百万——每一个都是真实的人',
      milestone4: '千万级——一座超大规模城市的人口',
      milestone5: '上亿——人类集体的伤疤',
      final: '这是有记录的战争累计伤亡人数',
      reflect: '请记住，这不是一个数字。',
    },
    network: {
      badge: 'Conflict Network',
      title: '交战方关系网络',
      subtitle: '每个节点是一个国家，连线代表两国曾发生战争。线的粗细对应伤亡规模——看见敌对关系的脉络，发现反复冲突的宿敌。',
      dragHint: '拖拽节点 · 点击连线查看战争 · 滚轮缩放',
      empty: '暂无连线',
      warsBetween: '场战争',
      casualtiesBetween: '累计伤亡',
    },
    compare: {
      badge: 'Compare',
      title: '战争对比',
      subtitle: '选择两场战争并排对比，看见"短而惨烈"与"长而消耗"的不同形态。',
      selectHint: '点击下方任意两张战争卡片进入对比',
      selected: '已选',
      vs: 'VS',
      duration: '持续时长',
      casualties: '伤亡人数',
      countries: '涉及国家',
      era: '所属时代',
      clear: '清除选择',
      compareBtn: '对比选中战争',
      needTwo: '请选择两场战争',
      sameWar: '请选择两场不同的战争',
      ancientEra: '古代',
      medievalEra: '中世纪',
      earlyModernEra: '近代',
      contemporaryEra: '现代',
    },
  },
  en: {
    nav: {
      home: 'Home',
      timeline: 'Timeline',
      insights: 'Insights',
      about: 'About',
      cta: 'Take Action',
      brand: 'Chronicle of Peace',
    },
    lang: {
      switch: '中',
      label: '中文',
    },
    hero: {
      badge: 'War & Peace Archive',
      title1: 'End the wars,',
      title2: 'remember the history.',
      subtitle:
        'Behind every war lie countless rewritten lives. We record history not to perpetuate hatred, but to choose peace.',
    },
    home: {
      loading: 'Loading the archive...',
      controlsHint: 'Left-drag to rotate · Scroll to zoom · Right-drag to pan',
    },
    stats: {
      badge: 'The Cost of War',
      title: 'The Cost of War',
      subtitle:
        'Behind every number is a real person who once lived—a father, a son, a husband, a friend.',
      recordedWars: 'Recorded Wars',
      totalCasualties: 'Total Casualties',
      involvedCountries: 'Countries & Regions',
      yearSpan: 'Years Spanned',
    },
    highlights: {
      badge: 'Major Conflicts',
      title: 'Major Conflict Archive',
      viewAll: 'View full timeline',
      casualties: 'Casualties',
      viewDetail: 'View details',
    },
    quotes: {
      badge: 'Voices for Peace',
      title: 'Voices for Peace',
      prev: 'Previous',
      next: 'Next',
      indicator: (i: number) => `Quote ${i}`,
    },
    cta: {
      title: 'Wars have no winners, only survivors.',
      subtitle:
        'History teaches us that the cost of conflict can never be measured. Today’s choices will shape tomorrow’s world. May every memory become a cornerstone of peace.',
      button: 'Support UN Peace Initiatives',
      footnote: 'Let history illuminate the path to peace',
    },
    timeSlider: {
      label: 'Time Filter',
    },
    viewToggle: {
      backToGlobal: 'Back to Global View',
    },
    countryPanel: {
      involvedWars: 'Wars Involved',
      totalCasualties: 'Total Casualties',
      warRecords: 'War Records',
      noRecords: 'No related war records.',
      casualties: 'Casualties',
    },
    warModal: {
      backToCountry: 'Back to country',
      warDetail: 'War Detail',
      location: 'Location',
      casualties: 'Casualties',
      belligerents: 'Belligerents',
      impact: 'War Impact',
      duration: 'Duration',
      durationSameYear: 'Broke out and ended same year',
      durationYears: (n: number) => `${n} year${n === 1 ? '' : 's'}`,
      casualtyRatio: 'Share of recorded casualties',
      involvedCountries: 'Countries & regions involved',
      background: 'Background',
      reflection:
        'is not a cold number, but countless lives swallowed by war—behind every figure lies a complete story.',
      figures: 'Contemporary Figures',
      attires: 'Military Attires',
      unknownCountry: 'Unknown country',
      attireAlt: (name: string) => `${name} attire`,
    },
    timeline: {
      badge: 'Timeline',
      title: 'Chronicle of Human Wars',
      subtitle:
        'A curve threads through each time anchor, linking the major wars of human history into a visible scar.',
      scrollLeft: 'Scroll left',
      scrollRight: 'Scroll right',
      casualties: 'Casualties',
      loading: 'Loading the archive...',
    },
    insights: {
      badge: 'Insights',
      title: 'Data Insights',
      subtitle:
        'Behind every number lies an irrevocable memory of life. Through the prism of data, we re-examine the scale and cost of human conflict.',
      loading: 'Loading insights...',
      statTotalWars: 'Total Recorded Wars',
      statTotalCasualties: 'Total Casualties',
      statInvolvedCountries: 'Countries Involved',
      statYearSpan: 'Years Spanned',
      eraTrendTitle: 'Casualty Trends by Era',
      eraTrendSubtitle:
        'Cumulative casualties grouped by era, observing how the scale of human conflict evolved with civilization.',
      eraTooltip: (c: string, n: number) => `${c} · ${n} wars`,
      topWarsTitle: 'Top 10 Deadliest Wars',
      topWarsSubtitle:
        'Ranked by casualties, the ten costliest wars—each reshaped the course of history.',
      participationTitle: 'Country Participation Heat',
      participationSubtitle:
        'Top 15 countries by number of wars joined; dot size indicates degree of involvement.',
      reflection1a: 'When we convert the cost of war into numbers,',
      reflection1b: 'we see not cold statistics, but countless unlived lives.',
      reflection2:
        'Every conflict leaves a fissure in the strata of history. May these numbers record not only the past, but remind the future—peace is never a given; it is a promise every generation must keep.',
      eras: {
        ancient: { label: 'Ancient', subtitle: 'BCE — 476' },
        medieval: { label: 'Medieval', subtitle: '476 — 1453' },
        earlyModern: { label: 'Early Modern', subtitle: '1453 — 1900' },
        contemporary: { label: 'Contemporary', subtitle: '1900 — Present' },
      },
    },
    about: {
      heroBadge: 'About',
      heroTitle: 'About Chronicle of Peace',
      heroSubtitle:
        'With data as pen and memory as ink, we chronicle human warfare to awaken a deeper reverence for peace.',
      quote1: 'Every war is a scar carved upon humanity.',
      quote2: 'We record them not to glorify,',
      quote3: 'but in hope that one day these scars will grow no more.',
      missionBadge: 'Mission',
      missionTitle: 'Our Mission',
      missions: [
        {
          title: 'Record History',
          description:
            'To chronicle the history of human war with objectivity and restraint, letting the facts speak. We strive to transcend cultural and partisan divides and present the many faces of conflict.',
        },
        {
          title: 'Awaken Reflection',
          description:
            'Through data visualization and spatio-temporal narrative, we lend weight back to cold numbers, inviting every visitor to pause and reflect before history.',
        },
        {
          title: 'Call for Peace',
          description:
            'Bridging past and future, we turn the scars of history into a forward-looking vigilance. We believe memory is the firmest foundation of peace.',
        },
      ],
      whyBadge: 'Why',
      whyTitle: 'Why Record Wars?',
      whyTexts: [
        'War is the heaviest subject in human history. It shaped borders, regimes, and civilizations, yet devoured countless individual fates and possibilities. Recording war is not born of an infatuation with violence, but of respect for truth—only by facing the scars can we understand why the world is as it is today.',
        'Numbers themselves are cold, but behind each number was a person with a name, an interrupted life, a rewritten family. When we lay thousands of years of conflict on a single timeline, what we see is not a glorious epic, but a cost repeatedly replayed.',
        'History teaches us nothing automatically; it gains meaning only when remembered, told, and reflected upon. We hope this archive becomes a mirror—reflecting both the past and the future.',
      ],
      santayanaQuote: 'Those who cannot remember the past are condemned to repeat it.',
      santayanaAuthor: '— George Santayana',
      methodologyBadge: 'Methodology',
      methodologyTitle: 'Methodology',
      methodologySubtitle:
        'From historical sources to the screen, we strive to translate the complexity of war into understandable narrative with rigor and restraint.',
      methodology: [
        {
          title: 'Data Sources',
          description:
            'Aggregating historical documents, academic research, and public data from the UN and ICRC, cross-checked to approach the truth as closely as possible.',
        },
        {
          title: 'Visualization Methods',
          description:
            'Using 3D globes, time curves, and statistical charts to translate abstract numbers into perceptible visual language.',
        },
        {
          title: 'Continuous Updates',
          description:
            'Historical research never stops, and neither does this archive. We periodically revise entries, supplement sources, and correct biases.',
        },
      ],
      sourcesBadge: 'Sources',
      sourcesTitle: 'Data Sources',
      sourcesSubtitle:
        'The data in this archive draws on the following sources, cross-verified wherever possible. Corrections on any fact are welcome.',
      sources: [
        {
          title: 'Historical Encyclopedias',
          description:
            'Comprehensive general and period encyclopedias that provide the basic framework and time anchors for war entries.',
        },
        {
          title: 'Military History Scholarship',
          description:
            'Referencing monographs and papers on military history at home and abroad for battle details, casualty assessments, and strategic analysis.',
        },
        {
          title: 'UN & ICRC Data',
          description:
            'A key source for the humanitarian impact, civilian casualties, and displacement data of modern conflicts.',
        },
        {
          title: 'Wikipedia War Lists',
          description:
            'A broad-coverage index used to discover entries and trace their original citations.',
        },
        {
          title: 'Project Gutenberg Historical Texts',
          description:
            'Provides a large body of public-domain original documents, memoirs, and chronicles supporting primary-source reading.',
        },
      ],
      techBadge: 'Technology',
      techTitle: 'Technology',
      techSubtitle:
        'With modern web technology, we make history no longer confined to pages, but a space-time to be explored and interacted with.',
      techStack: [
        { label: 'Three.js / React Three Fiber', desc: 'Spatial rendering of the 3D globe and war anchors' },
        { label: 'React 18 + TypeScript', desc: 'Component architecture and type-safe data flow' },
        { label: 'Framer Motion', desc: 'Choreography of page transitions and data entrances' },
        { label: 'Tailwind CSS', desc: 'The archive color system and consistent visual language' },
        { label: 'Vite + Zustand', desc: 'Fast builds and lightweight global state management' },
      ],
      ackBadge: 'Acknowledgements',
      ackTitle: 'Acknowledgements',
      ackText:
        'Thanks to the open-source community—React, Three.js, Framer Motion and more made this archive possible. Thanks to generations of historians and archivists, whose research and curation are the foundation of all our data. And thanks to every visitor who pauses here—memory is meaningful because someone is willing to remember.',
      ackFootnote: 'May peace be with every reader',
    },
    format: {
      bc: (n: number) => `${n} BCE`,
      ad: (n: number) => `${n} CE`,
    },
    toll: {
      badge: 'The Human Toll',
      title: 'Every Number Was a Life',
      subtitle: 'As the number climbs slowly, feel its weight. This is not statistics, but countless destinies rewritten by war.',
      counting: 'Counting...',
      milestone1: 'The population of a small town',
      milestone2: 'A whole city vanished',
      milestone3: 'Over a million—each one a real person',
      milestone4: 'Tens of millions—a metropolis lost',
      milestone5: 'Over a hundred million—humanity\'s collective scar',
      final: 'Total recorded casualties of war',
      reflect: 'Remember, this is not just a number.',
    },
    network: {
      badge: 'Conflict Network',
      title: 'Belligerent Relationship Network',
      subtitle: 'Each node is a country; links mark wars between them. Line thickness scales with casualties—see the fabric of enmity and recurring rivalries.',
      dragHint: 'Drag nodes · Click a line to view the war · Scroll to zoom',
      empty: 'No links',
      warsBetween: 'wars',
      casualtiesBetween: 'Total casualties',
    },
    compare: {
      badge: 'Compare',
      title: 'War Comparison',
      subtitle: 'Select two wars and compare them side by side—see the contrast between brief carnage and prolonged attrition.',
      selectHint: 'Click any two war cards below to compare',
      selected: 'Selected',
      vs: 'VS',
      duration: 'Duration',
      casualties: 'Casualties',
      countries: 'Countries involved',
      era: 'Era',
      clear: 'Clear selection',
      compareBtn: 'Compare selected wars',
      needTwo: 'Please select two wars',
      sameWar: 'Please select two different wars',
      ancientEra: 'Ancient',
      medievalEra: 'Medieval',
      earlyModernEra: 'Early Modern',
      contemporaryEra: 'Contemporary',
    },
  },
} as const;

export type TranslationTree = typeof translations.zh;

/**
 * 按点分路径取值，支持函数型文案（传入额外参数调用）。
 */
export function resolveT(
  lang: Language,
  path: string,
  ...args: unknown[]
): string {
  const dict = translations[lang] as unknown as Record<string, unknown>;
  const parts = path.split('.');
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return path;
    }
  }
  if (typeof cur === 'function') {
    return String((cur as (...a: unknown[]) => unknown)(...args));
  }
  return typeof cur === 'string' ? cur : path;
}
