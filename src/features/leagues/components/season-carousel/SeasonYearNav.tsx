import { CarouselTabs } from '@/components';
import type { ISeason } from '@/features/leagues/types/league';
import { formatSeason } from '@/features/leagues/utils/format-season';
import { cn } from '@/utils/cn';

interface ISeasonYearNavProps {
  seasons: ISeason[];
}

/** Season timeline: a tablist to jump to any season (arrow keys, Home, End). Seasons are chronological. */
export const SeasonYearNav = ({ seasons }: ISeasonYearNavProps) => (
  <CarouselTabs
    label="Seasons"
    renderTab={(index) => (
      <>
        {/* The space sits outside the hidden span, so the name reads "Season 1992–93". */}
        <span className="sr-only">Season</span> {formatSeason(seasons[index]?.name ?? '')}
      </>
    )}
    className="flex gap-1 overflow-x-auto border-b border-border"
    tabClassName={(isSelected) =>
      cn(
        '-mb-px min-h-11 shrink-0 cursor-pointer border-b-2 px-3 font-display text-lg font-semibold whitespace-nowrap tabular-nums transition-colors focus-visible:-outline-offset-2',
        isSelected ? 'border-brand text-fg' : 'border-transparent text-fg-muted hover:text-fg',
      )
    }
  />
);
