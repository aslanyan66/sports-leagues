import { lazy, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { loadLeagueSeasonsDialog } from '@/features/leagues/components/seasons-dialog/seasons-dialog-loader';
import { SeasonsDialogLoadError } from '@/features/leagues/components/seasons-dialog/SeasonsDialogLoadError';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

// React.lazy remembers a failed import forever, so a retry needs a new lazy component. It lives in
// state (not a module variable) so React, and the React Compiler, see the change.
const createLazyDialog = () =>
  lazy(async () => {
    const module = await loadLeagueSeasonsDialog();
    return { default: module.LeagueSeasonsDialog };
  });

/**
 * The dialog + carousel code ships as its own chunk and is only mounted once a league has been
 * opened. It then stays mounted (the store keeps the last league) so closing can animate.
 * If the chunk fails to load (e.g. offline), a small message with a retry replaces it, instead of
 * the error taking down the whole page.
 */
export const LazyLeagueSeasonsDialog = () => {
  const selectedLeagueId = useLeaguesUiStore((state) => state.selectedLeagueId);
  const closeSeasonsDialog = useLeaguesUiStore((state) => state.closeSeasonsDialog);
  const [seasonsDialog, setSeasonsDialog] = useState(createLazyDialog);
  const LeagueSeasonsDialog = seasonsDialog;

  if (selectedLeagueId === null) {
    return null;
  }

  return (
    <ErrorBoundary
      FallbackComponent={SeasonsDialogLoadError}
      onError={() => {
        closeSeasonsDialog();
      }}
      onReset={() => {
        setSeasonsDialog(createLazyDialog);
      }}
    >
      <Suspense fallback={null}>
        <LeagueSeasonsDialog />
      </Suspense>
    </ErrorBoundary>
  );
};
