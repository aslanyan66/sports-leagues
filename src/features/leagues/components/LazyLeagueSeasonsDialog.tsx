import { lazy, Suspense } from 'react';

import { loadLeagueSeasonsDialog } from '@/features/leagues/components/seasons-dialog-loader';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

const LeagueSeasonsDialog = lazy(async () => {
  const module = await loadLeagueSeasonsDialog();
  return { default: module.LeagueSeasonsDialog };
});

/**
 * The dialog + carousel code ships as its own chunk and is only mounted once a league has been
 * opened. It then stays mounted (the store keeps the last league) so closing can animate.
 */
export const LazyLeagueSeasonsDialog = () => {
  const hasOpenedLeague = useLeaguesUiStore((state) => state.selectedLeagueId !== null);

  if (!hasOpenedLeague) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <LeagueSeasonsDialog />
    </Suspense>
  );
};
