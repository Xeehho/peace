import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Skull, Users, UserCircle2, Shirt } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useCountries } from '@/hooks/useCountries';
import { useWars } from '@/hooks/useWars';
import { formatCasualties, formatYearRange } from '@/utils/format';
import { generateAttireImageUrl } from '@/utils/image';
import { AttireFigureCard } from './AttireFigureCard';

export function WarModal() {
  const { selectedWarId, setSelectedWar } = useAppStore();
  const { wars } = useWars();
  const { countries } = useCountries();

  const war = wars.find((w) => w.id === selectedWarId);
  const countryMap = new Map(countries.map((c) => [c.id, c]));

  return (
    <AnimatePresence>
      {war && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWar(null)}
            className="fixed inset-0 z-40 bg-archive-ink/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-archive-border bg-white p-8 shadow-soft"
          >
            <button
              onClick={() => setSelectedWar(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-archive-muted transition-colors hover:bg-archive-border/50 hover:text-archive-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-2xl text-archive-ink">{war.name}</h2>
            <p className="mt-1 font-mono text-sm text-archive-amber">
              {formatYearRange(war.startYear, war.endYear)}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded border border-archive-border bg-archive-cream/60 p-4">
                <div className="flex items-center gap-2 text-xs text-archive-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>地点</span>
                </div>
                <p className="mt-1 text-sm text-archive-ink">{war.location}</p>
              </div>
              <div className="rounded border border-archive-border bg-archive-cream/60 p-4">
                <div className="flex items-center gap-2 text-xs text-archive-muted">
                  <Skull className="h-3.5 w-3.5" />
                  <span>伤亡人数</span>
                </div>
                <p className="mt-1 font-mono text-lg text-archive-terracotta">
                  {formatCasualties(war.casualties)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded border border-archive-border bg-archive-cream/60 p-4">
              <div className="flex items-center gap-2 text-xs text-archive-muted">
                <Users className="h-3.5 w-3.5" />
                <span>参战方</span>
              </div>
              <p className="mt-1 text-sm text-archive-ink">
                {war.belligerents.join(' vs ')}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-serif text-lg text-archive-ink">背景故事</h3>
              <p className="leading-relaxed text-archive-muted">
                {war.background}
              </p>
            </div>

            {war.figures && war.figures.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-archive-ink">
                  <UserCircle2 className="h-4 w-4 text-archive-amber" />
                  同时期人物
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {war.figures.map((figure, idx) => (
                    <div
                      key={idx}
                      className="rounded border border-archive-border bg-archive-cream/60 p-3"
                    >
                      <p className="font-medium text-archive-ink">{figure.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-archive-muted">
                        {figure.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {war.attires && war.attires.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-archive-ink">
                  <Shirt className="h-4 w-4 text-archive-amber" />
                  各国着装
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {war.attires.map((attire, idx) => {
                    const country = countryMap.get(attire.countryId);
                    return (
                      <AttireFigureCard
                        key={idx}
                        country={country}
                        imageUrl={generateAttireImageUrl(
                          country?.name ?? attire.countryId,
                          attire.caption ?? ''
                        )}
                        caption={attire.caption}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
