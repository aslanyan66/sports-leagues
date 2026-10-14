import { SearchField } from '@/components';
import { LEAGUE_SEARCH_INPUT_ID } from '@/features/leagues/constants';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

export const LeagueSearch = () => {
  const search = useLeaguesUiStore((state) => state.search);
  const setSearch = useLeaguesUiStore((state) => state.setSearch);

  return (
    <SearchField
      id={LEAGUE_SEARCH_INPUT_ID}
      label="League name"
      placeholder="Search, e.g. Premier League"
      value={search}
      onChange={setSearch}
    />
  );
};
