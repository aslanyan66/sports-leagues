import { Dialog, DialogContent } from '@/components';
import { LeagueSeasons } from '@/features/leagues/components/seasons-dialog/LeagueSeasons';
import { LeagueSeasonsHeader } from '@/features/leagues/components/seasons-dialog/LeagueSeasonsHeader';
import { useLeague } from '@/features/leagues/hooks/useLeague';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';
import { getLeagueCardId } from '@/features/leagues/utils/league-card-id';

/** Seasons dialog section: header (league info) + seasons carousel. */
export const LeagueSeasonsDialog = () => {
  const selectedLeagueId = useLeaguesUiStore((state) => state.selectedLeagueId);
  const isOpen = useLeaguesUiStore((state) => state.isSeasonsDialogOpen);
  const closeSeasonsDialog = useLeaguesUiStore((state) => state.closeSeasonsDialog);
  const { data: league } = useLeague(selectedLeagueId);

  return (
    <Dialog
      open={isOpen && Boolean(league)}
      onOpenChange={(open) => {
        if (!open) {
          closeSeasonsDialog();
        }
      }}
    >
      {league ? (
        <DialogContent
          closeLabel="Close season badges"
          onCloseAutoFocus={(event) => {
            // The dialog is opened from a league card rather than a Radix <Dialog.Trigger>,
            // so Radix has nothing to return focus to: send it back to that card.
            event.preventDefault();
            document.getElementById(getLeagueCardId(league.idLeague))?.focus();
          }}
        >
          <LeagueSeasonsHeader league={league} />
          <div className="px-4 pt-4 pb-5 sm:px-5 sm:pb-6 md:px-6">
            <LeagueSeasons leagueId={league.idLeague} leagueName={league.strLeague} />
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
};
