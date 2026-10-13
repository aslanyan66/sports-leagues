import { Select, type ISelectOption } from '@/components/ui/Select';
import { ALL_SPORTS_VALUE } from '@/features/leagues/constants';
import { useSportOptions } from '@/features/leagues/hooks/useSportOptions';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

export const SportSelect = () => {
  const sport = useLeaguesUiStore((state) => state.sport);
  const setSport = useLeaguesUiStore((state) => state.setSport);
  const { data: sports = [], isSuccess } = useSportOptions();

  const options: ISelectOption[] = [
    { value: ALL_SPORTS_VALUE, label: 'All sports' },
    ...sports.map((item) => ({ value: item, label: item })),
  ];

  return (
    <Select
      label="Sport"
      value={sport ?? ALL_SPORTS_VALUE}
      options={options}
      disabled={!isSuccess}
      onChange={(value) => {
        setSport(value === ALL_SPORTS_VALUE ? null : value);
      }}
    />
  );
};
