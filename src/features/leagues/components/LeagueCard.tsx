import { ChevronRight } from 'lucide-react';

import { Chip } from '@/components/ui/Chip';
import { loadLeagueSeasonsDialog } from '@/features/leagues/components/seasons-dialog-loader';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';
import type { ILeague } from '@/features/leagues/types/league';
import { getLeagueCardId } from '@/features/leagues/utils/league-card-id';

interface ILeagueCardProps {
  league: ILeague;
}

/** A league as one large button: sport, name, alternate name. Opens the seasons dialog. */
export const LeagueCard = ({ league }: ILeagueCardProps) => {
  const openSeasonsDialog = useLeaguesUiStore((state) => state.openSeasonsDialog);
  const alternateName = league.strLeagueAlternate?.trim();

  return (
    <button
      type="button"
      id={getLeagueCardId(league.idLeague)}
      aria-haspopup="dialog"
      onClick={() => {
        openSeasonsDialog(league.idLeague);
      }}
      // Start downloading the dialog chunk as soon as the user shows intent.
      onPointerEnter={() => void loadLeagueSeasonsDialog()}
      onFocus={() => void loadLeagueSeasonsDialog()}
      className="group flex h-full w-full cursor-pointer flex-col items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-brand focus-visible:border-brand"
    >
      <Chip>{league.strSport}</Chip>
      <span className="flex flex-col gap-1">
        <span className="font-display text-2xl leading-tight font-bold">{league.strLeague}</span>
        <span className="text-sm text-fg-muted">
          {alternateName ? (
            <>
              <span className="sr-only">Also known as </span>
              {alternateName}
            </>
          ) : (
            'No alternate name'
          )}
        </span>
      </span>
      <span className="mt-auto flex items-center gap-1 pt-1 text-sm font-semibold text-brand-text">
        View season badges
        <ChevronRight
          aria-hidden="true"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </button>
  );
};
