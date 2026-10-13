import { SearchField } from '@/components/ui/SearchField';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

export const LeagueSearch = () => {
  const search = useLeaguesUiStore((state) => state.search);
  const setSearch = useLeaguesUiStore((state) => state.setSearch);

  return (
    <SearchField
      label="League name"
      placeholder="Search, e.g. Premier League"
      value={search}
      onChange={setSearch}
    />
  );
};
