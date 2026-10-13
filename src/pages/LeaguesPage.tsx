import { PageHeader } from '@/components/layout/PageHeader';
import { LazyLeagueSeasonsDialog } from '@/features/leagues/components/LazyLeagueSeasonsDialog';
import { LeagueFilters } from '@/features/leagues/components/LeagueFilters';
import { LeagueResults } from '@/features/leagues/components/LeagueResults';

/** Composes the leagues feature: header → filters → results → seasons dialog. */
export const LeaguesPage = () => (
  <div className="flex flex-col gap-5 md:gap-6">
    <title>Sports Leagues</title>
    <PageHeader
      title="Sports leagues"
      description="Search by name or filter by sport. Open a league to browse its season badges."
    />
    <LeagueFilters />
    <LeagueResults />
    <LazyLeagueSeasonsDialog />
  </div>
);
