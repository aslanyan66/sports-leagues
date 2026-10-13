import { useState } from 'react';

import { SeasonBadgePlaceholder } from '@/features/leagues/components/SeasonBadgePlaceholder';
import type { ISeason } from '@/features/leagues/types/league';
import { getBadgeImageSources } from '@/features/leagues/utils/badge-image';
import { cn } from '@/utils/cn';

interface ISeasonBadgeImageProps {
  season: ISeason;
  leagueName: string;
  /** Load immediately (visible slide). Other slides lazy-load as they come into view. */
  eager?: boolean;
}

type LoadAttempt = 'resized' | 'original' | 'failed';

/**
 * Season badge on a "spotlight". Loads the resized image first, retries with the original
 * if that fails, and shows a placeholder when there's no badge or neither loads.
 */
export const SeasonBadgeImage = ({ season, leagueName, eager = false }: ISeasonBadgeImageProps) => {
  const [attempt, setAttempt] = useState<LoadAttempt>('resized');
  const [isLoaded, setIsLoaded] = useState(false);
  const sources = season.badgeUrl ? getBadgeImageSources(season.badgeUrl) : null;
  const showImage = sources !== null && attempt !== 'failed';

  return (
    <div className="flex aspect-square w-full max-w-64 items-center justify-center rounded-full bg-spotlight p-8">
      {showImage ? (
        <img
          // New element per attempt, so the browser drops the failed request and its srcset.
          key={attempt}
          src={attempt === 'resized' ? sources.src : sources.fallbackSrc}
          srcSet={attempt === 'resized' ? sources.srcSet : undefined}
          alt={`${leagueName} badge, season ${season.name}`}
          width={250}
          height={250}
          draggable={false}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => {
            setIsLoaded(true);
          }}
          onError={() => {
            setIsLoaded(false);
            setAttempt(attempt === 'resized' ? 'original' : 'failed');
          }}
          className={cn(
            'size-full object-contain drop-shadow-lg transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      ) : (
        <SeasonBadgePlaceholder />
      )}
    </div>
  );
};
