import { SearchX } from 'lucide-react';

import { StateMessage, Button } from '@/components';
import type { ILeagueFilterValues } from '@/features/leagues/types/league';

interface ILeagueResultsEmptyProps {
  filters: ILeagueFilterValues;
  onClearFilters: () => void;
}

const describeFilters = ({ search, sport }: ILeagueFilterValues): string => {
  const subject = sport ? `${sport} leagues` : 'leagues';
  const query = search.trim();

  return query ? `There are no ${subject} matching “${query}”.` : `There are no ${subject} yet.`;
};

/**
 * Shown when nothing matches. With filters applied it offers to clear them; without any (the API
 * returned no leagues) there's nothing to clear, so it only says so.
 */
export const LeagueResultsEmpty = ({ filters, onClearFilters }: ILeagueResultsEmptyProps) => {
  const hasFilters = filters.search.trim() !== '' || filters.sport !== null;

  return (
    <StateMessage
      icon={SearchX}
      title="No leagues found"
      description={
        hasFilters
          ? `${describeFilters(filters)} Try another name or sport.`
          : describeFilters(filters)
      }
      action={
        hasFilters ? (
          <Button variant="secondary" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : undefined
      }
    />
  );
};
