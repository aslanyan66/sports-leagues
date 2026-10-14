import { CircleAlert, RefreshCw } from 'lucide-react';

import { Button } from '@/components';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

import type { FallbackProps } from 'react-error-boundary';

/** Shown when the seasons dialog code can't be downloaded. Retrying loads it again and reopens the league. */
export const SeasonsDialogLoadError = ({ resetErrorBoundary }: FallbackProps) => {
  const selectedLeagueId = useLeaguesUiStore((state) => state.selectedLeagueId);
  const openSeasonsDialog = useLeaguesUiStore((state) => state.openSeasonsDialog);

  return (
    <div
      role="alert"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4 text-fg shadow-2xl"
    >
      <CircleAlert aria-hidden="true" className="size-5 shrink-0 text-brand-text" />
      <p className="min-w-0 flex-1 text-sm font-medium">
        Season badges couldn&apos;t open. Check your connection and try again.
      </p>
      <Button
        variant="secondary"
        onClick={() => {
          resetErrorBoundary();
          if (selectedLeagueId !== null) {
            openSeasonsDialog(selectedLeagueId);
          }
        }}
      >
        <RefreshCw aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
};
