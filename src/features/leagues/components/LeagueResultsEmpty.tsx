import { SearchX } from 'lucide-react';

import { StateMessage } from '@/components/feedback/StateMessage';
import { Button } from '@/components/ui/Button';
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

/** Shown when the applied filters match nothing; offers a way out. */
export const LeagueResultsEmpty = ({ filters, onClearFilters }: ILeagueResultsEmptyProps) => (
  <StateMessage
    icon={SearchX}
    title="No leagues found"
    description={`${describeFilters(filters)} Try another name or sport.`}
    action={
      <Button variant="secondary" onClick={onClearFilters}>
        Clear filters
      </Button>
    }
  />
);
