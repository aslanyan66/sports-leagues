import { formatLeagueCount } from '@/features/leagues/utils/format-league-count';

interface ILeagueResultsCountProps {
  count: number;
}

/**
 * Total result count for screen readers only: announced when search or filters change it.
 * Sighted users see the count in each sport heading instead.
 */
export const LeagueResultsCount = ({ count }: ILeagueResultsCountProps) => (
  <p className="sr-only" aria-live="polite" aria-atomic="true">
    {formatLeagueCount(count)}
  </p>
);
