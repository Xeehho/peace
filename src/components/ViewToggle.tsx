import { Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { useT } from '@/i18n/useT';

export function ViewToggle() {
  const { viewMode, resetToGlobal } = useAppStore();
  const { t } = useT();

  return (
    <AnimatePresence>
      {viewMode === 'country' && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={resetToGlobal}
          className="fixed bottom-6 left-6 z-30 flex items-center gap-2 rounded-full border border-archive-border bg-white/90 px-5 py-2.5 text-sm text-archive-ink shadow-soft backdrop-blur-md transition-colors hover:border-archive-amber hover:text-archive-amber"
        >
          <Globe2 className="h-4 w-4" />
          {t('viewToggle.backToGlobal')}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
