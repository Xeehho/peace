import type { Country } from '@/types';
import { useT, localized } from '@/i18n/useT';

interface AttireFigureCardProps {
  country?: Country;
  imageUrl: string;
  caption?: string;
}

export function AttireFigureCard({ country, imageUrl, caption }: AttireFigureCardProps) {
  const { t, lang } = useT();
  const countryName = country ? localized(country, 'name', lang) : t('warModal.unknownCountry');

  return (
    <div className="group overflow-hidden rounded-lg border border-archive-border bg-archive-cream">
      <div className="relative aspect-[3/4] overflow-hidden bg-archive-border">
        <img
          src={imageUrl}
          alt={t('warModal.attireAlt', countryName)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-archive-amber">
          {countryName}
        </p>
        {caption && (
          <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-archive-muted">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
