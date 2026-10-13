import { LeagueSearch } from '@/features/leagues/components/LeagueSearch';
import { SportSelect } from '@/features/leagues/components/SportSelect';

/** Filters section: name search + sport dropdown. Stacked on mobile, side by side from `md`. */
export const LeagueFilters = () => (
  <div
    role="search"
    aria-label="Filter leagues"
    className="grid gap-3 rounded-xl border border-border bg-surface p-4 md:grid-cols-[2fr_1fr] md:gap-4"
  >
    <LeagueSearch />
    <SportSelect />
  </div>
);
