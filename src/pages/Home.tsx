import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useCountries } from '@/hooks/useCountries';
import { useWars } from '@/hooks/useWars';
import { GlobeScene } from '@/components/GlobeScene';
import { HeroSection } from '@/components/HeroSection';
import { CountryPanel } from '@/components/CountryPanel';
import { WarModal } from '@/components/WarModal';
import { TimeSlider } from '@/components/TimeSlider';
import { ViewToggle } from '@/components/ViewToggle';
import { CallToAction } from '@/components/CallToAction';
import { StatsSection } from '@/components/StatsSection';
import { QuotesCarousel } from '@/components/QuotesCarousel';
import { WarHighlights } from '@/components/WarHighlights';
import { SiteBackground } from '@/components/SiteBackground';
import { useAppStore } from '@/stores/appStore';
import { useT } from '@/i18n/useT';

export default function Home() {
  const { countries, loading: countriesLoading } = useCountries();
  const { wars, loading: warsLoading } = useWars();
  const { viewMode } = useAppStore();
  const { t } = useT();

  const isLoading = countriesLoading || warsLoading;

  return (
    <main className="relative isolate min-h-screen">
      <SiteBackground theme="home" />
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-archive-border border-t-archive-amber" />
            <p className="text-sm text-archive-muted">{t('home.loading')}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative h-screen w-full">
            <HeroSection />
            <Canvas
              camera={{ position: [0, 0.6, 3.4], fov: 45, near: 0.1, far: 100 }}
              className="h-full w-full"
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <GlobeScene countries={countries} wars={wars} />
              </Suspense>
            </Canvas>

            <CountryPanel />
            <WarModal />
            {viewMode === 'global' && <TimeSlider />}
            <ViewToggle />

            <div className="pointer-events-none absolute bottom-6 right-6 z-20 hidden text-right text-xs text-archive-muted md:block">
              <p>{t('home.controlsHint')}</p>
            </div>
          </div>

          <StatsSection />
          <WarHighlights />
          <QuotesCarousel />
          <CallToAction />
        </>
      )}
    </main>
  );
}
