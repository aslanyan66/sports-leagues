import { LeagueCard } from '@/features/leagues/components/results/LeagueCard';
import type { ILeague } from '@/features/leagues/types/league';

interface ILeagueListProps {
  leagues: ILeague[];
}

/** Responsive grid: 1 column on phones, 2 from `sm`, 3 from `lg`. */
export const LeagueList = ({ leagues }: ILeagueListProps) => (
  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
    {leagues.map((league) => (
      <li key={league.idLeague}>
        <LeagueCard league={league} />
      </li>
    ))}
  </ul>
);
