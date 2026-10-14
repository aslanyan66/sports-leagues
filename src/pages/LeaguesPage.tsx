import { PageHeader } from '@/components';
import { LazyLeagueSeasonsDialog, LeagueFilters, LeagueResults } from '@/features/leagues';
import { pageTitle } from '@/utils/page-title';

/** Composes the leagues feature: header → filters → results → seasons dialog. */
export const LeaguesPage = () => (
  <div className="flex flex-col gap-5 md:gap-6">
    <title>{pageTitle()}</title>
    <PageHeader
      title="Sports leagues"
      description="Search by name or filter by sport. Open a league to browse its season badges."
    />
    <LeagueFilters />
    <LeagueResults />
    <LazyLeagueSeasonsDialog />
  </div>
);
