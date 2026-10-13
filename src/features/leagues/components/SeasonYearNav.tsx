import { CarouselTabs } from '@/components/ui/Carousel';
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
    getTabLabel={(index) => `Season ${seasons[index]?.name ?? ''}`}
    renderTab={(index) => formatSeason(seasons[index]?.name ?? '')}
    className="flex gap-1 overflow-x-auto border-b border-border"
    tabClassName={(isSelected) =>
      cn(
        '-mb-px min-h-11 shrink-0 cursor-pointer border-b-2 px-3 font-display text-lg font-semibold whitespace-nowrap tabular-nums transition-colors',
        isSelected ? 'border-brand text-fg' : 'border-transparent text-fg-muted hover:text-fg',
      )
    }
  />
);
