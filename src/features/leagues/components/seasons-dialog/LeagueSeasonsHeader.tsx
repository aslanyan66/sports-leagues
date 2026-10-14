import { Chip, DialogDescription, DialogTitle } from '@/components';
import type { ILeague } from '@/features/leagues/types/league';

interface ILeagueSeasonsHeaderProps {
  league: ILeague;
}

/** Dialog title + description; Radix wires them to the dialog's accessible name/description. */
export const LeagueSeasonsHeader = ({ league }: ILeagueSeasonsHeaderProps) => {
  const alternateName = league.strLeagueAlternate;

  return (
    <div className="flex flex-col gap-2 px-4 pt-4 pr-16 sm:px-5 md:px-6 md:pt-6">
      <Chip className="self-start">{league.strSport}</Chip>
      <DialogTitle>{league.strLeague}</DialogTitle>
      <DialogDescription>
        {alternateName
          ? `Also known as ${alternateName}. Browse its badges season by season.`
          : 'Browse its badges season by season.'}
      </DialogDescription>
    </div>
  );
};
