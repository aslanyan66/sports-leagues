import { useId } from 'react';

import { LeagueList } from '@/features/leagues/components/results/LeagueList';
import type { ILeagueSportGroup } from '@/features/leagues/types/league';
import { formatLeagueCount } from '@/features/leagues/utils/format-league-count';

interface ILeagueSportGroupsProps {
  groups: ILeagueSportGroup[];
}

/** One labelled section per sport, each with a heading, its league count and a grid of cards. */
export const LeagueSportGroups = ({ groups }: ILeagueSportGroupsProps) => {
  const idPrefix = useId();

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {groups.map(({ sport, leagues }, index) => {
        const headingId = `${idPrefix}-sport-${index}`;

        return (
          <section key={sport} aria-labelledby={headingId} className="flex flex-col gap-3">
            <h3
              id={headingId}
              className="flex items-baseline gap-2 border-b border-border pb-2 font-display text-2xl leading-tight font-bold"
            >
              {sport}
              <span className="font-sans text-sm font-medium text-fg-muted">
                {formatLeagueCount(leagues.length)}
              </span>
            </h3>
            <LeagueList leagues={leagues} />
          </section>
        );
      })}
    </div>
  );
};
