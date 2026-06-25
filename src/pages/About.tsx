import { motion } from 'framer-motion';
import {
  BookOpen,
  Eye,
  HeartHandshake,
  Quote,
  Database,
  BarChart3,
  RefreshCw,
  Globe,
  Code2,
  Heart,
} from 'lucide-react';
import { CallToAction } from '@/components/CallToAction';

const missions = [
  {
    icon: BookOpen,
    title: '记录历史',
    description: '以客观、克制的姿态记录人类战争史，让事实本身说话。我们力求跨越文化与立场的藩篱，呈现冲突的多重面貌。',
    accent: '#B85C4F',
  },
  {
    icon: Eye,
    title: '唤醒反思',
    description: '通过数据可视化与时空叙事，让冰冷的数字重新具备重量，促使每一位访客在历史面前驻足反思。',
    accent: '#C88A3D',
  },
  {
    icon: HeartHandshake,
    title: '呼吁和平',
    description: '连接过去与未来，将历史的伤痕转化为前行的警醒。我们相信，记忆是和平最坚实的基石。',
    accent: '#7A8B7A',
  },
];

const methodology = [
  {
    icon: Database,
    title: '数据来源',
    description:
      '汇集历史文献、学术研究、联合国与红十字国际委员会的公开数据，交叉比对以尽可能接近真实。',
  },
  {
    icon: BarChart3,
    title: '可视化方法',
    description:
      '运用 3D 地球、时间曲线、统计图表等多种形式，将抽象的数字转化为可被感知的视觉语言。',
  },
  {
    icon: RefreshCw,
    title: '持续更新',
    description:
      '历史研究从未停止，本档案亦随之修订。我们会定期校订条目、补充来源、修正偏差。',
  },
];

const dataSources = [
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
];

const techStack = [
  { label: 'Three.js / React Three Fiber', desc: '3D 地球与战争锚点的空间呈现' },
  { label: 'React 18 + TypeScript', desc: '组件化架构与类型安全的数据流' },
  { label: 'Framer Motion', desc: '页面过渡与数据入场的动效编排' },
  { label: 'Tailwind CSS', desc: 'archive 配色体系与一致的视觉语言' },
  { label: 'Vite + Zustand', desc: '极速构建与轻量全局状态管理' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function About() {
  return (
    <main className="min-h-screen bg-archive-cream pt-16">
      {/* 1. 英雄区 */}
      <section className="px-6 pb-12 pt-12 md:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              About
            </p>
            <h1 className="font-serif text-4xl font-medium text-archive-ink md:text-6xl">
              关于和平纪年
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
              以数据为笔，以记忆为墨，记录人类战争史，唤醒对和平的珍视。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="mx-auto mb-6 h-px w-16 bg-archive-border" />
            <p className="font-serif text-lg font-medium leading-relaxed text-archive-ink md:text-xl">
              每一场战争都是一道刻在人类身上的伤痕。
              <br />
              我们记录它们，并非为了颂扬，
              <br />
              而是希望有朝一日，这些伤痕不再增加。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. 我们的使命 */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              Mission
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              我们的使命
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {missions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-archive-border bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                    style={{ backgroundColor: item.accent }}
                  />
                  <div className="relative">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${item.accent}1A` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: item.accent }} />
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-medium text-archive-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-archive-muted">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 为什么记录战争？ */}
      <section className="border-y border-archive-border/60 bg-white/50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="mb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              Why
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              为什么记录战争？
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 text-sm leading-loose text-archive-muted md:text-base"
          >
            <p>
              战争是人类历史中最沉重的话题。它既塑造了国界、政体与文明的走向，也吞噬了无数个体的命运与可能。记录战争，并非出于对暴力的迷恋，而是出于对真相的尊重——只有正视伤痕，才能理解今日世界何以如此。
            </p>
            <p>
              数字本身是冰冷的，但每一个数字背后，都是一个曾有名有姓的人，一段被中断的人生，一个被改写的家庭。当我们把数千年的冲突并置在同一张时间线上，看到的不是荣耀的史诗，而是反复重演的代价。
            </p>
            <p>
              历史不会自动教会我们什么，唯有被铭记、被讲述、被反思，它才具备意义。我们希望这份档案能成为一面镜子——既照见过去，也映出未来。
            </p>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 rounded-2xl border border-archive-border bg-archive-cream p-8 shadow-soft"
          >
            <Quote className="h-7 w-7 text-archive-terracotta" />
            <blockquote className="mt-4 font-serif text-xl font-medium leading-relaxed text-archive-ink md:text-2xl">
              不能铭记过去的人，注定要重蹈覆辙。
            </blockquote>
            <figcaption className="mt-4 text-xs font-medium uppercase tracking-wider text-archive-muted">
              — 乔治·桑塔亚那
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* 4. 方法论 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              Methodology
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              方法论
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
              从史料到屏幕，我们尝试以严谨而克制的方式，将战争的复杂性转化为可被理解的叙事。
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
            {methodology.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative rounded-2xl border border-archive-border bg-white p-7 shadow-soft"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-archive-terracotta/10">
                      <Icon className="h-5 w-5 text-archive-terracotta" />
                    </div>
                    <span className="font-mono text-xs font-medium text-archive-muted">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-archive-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-archive-muted">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. 数据来源 */}
      <section className="border-y border-archive-border/60 bg-white/50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              Sources
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              数据来源
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
              本档案的数据综合参考了以下来源，并尽可能进行交叉验证。任何史实都欢迎指正。
            </p>
          </motion.div>

          <div className="space-y-3">
            {dataSources.map((source, idx) => (
              <motion.div
                key={source.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-4 rounded-xl border border-archive-border bg-archive-cream p-5 transition-colors hover:border-archive-amber/50"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-archive-border bg-white font-mono text-xs font-medium text-archive-terracotta">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-serif text-base font-medium text-archive-ink">
                    {source.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-archive-muted">
                    {source.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 技术实现 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              Technology
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              技术实现
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-archive-muted md:text-base">
              我们借助现代 Web 技术，让历史的呈现不再局限于纸页，而是可被探索、被交互的时空。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {techStack.map((tech, idx) => (
              <motion.div
                key={tech.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-4 rounded-xl border border-archive-border bg-white p-5 shadow-soft"
              >
                <Code2 className="mt-0.5 h-5 w-5 shrink-0 text-archive-amber" />
                <div>
                  <h3 className="font-serif text-sm font-medium text-archive-ink">
                    {tech.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-archive-muted">
                    {tech.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 致谢 */}
      <section className="border-t border-archive-border/60 bg-white/50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Globe className="mx-auto mb-6 h-8 w-8 text-archive-sage" />
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-archive-sage">
              Acknowledgements
            </p>
            <h2 className="font-serif text-3xl font-medium text-archive-ink md:text-4xl">
              致谢
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-loose text-archive-muted md:text-base">
              感谢开源社区，是 React、Three.js、Framer Motion 等项目让这份档案得以诞生；
              感谢一代代历史学者与档案工作者，他们的考据与整理是我们一切数据的根基；
              也感谢每一位驻足于此的访客——记忆之所以有意义，是因为有人愿意记得。
            </p>
            <div className="mx-auto mt-8 flex items-center justify-center gap-2 text-xs text-archive-muted">
              <Heart className="h-3.5 w-3.5 text-archive-terracotta" />
              <span>愿和平与每一位阅读者同在</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. 底部 CallToAction */}
      <CallToAction />
    </main>
  );
}
