import { SeasonBadgeImage } from '@/features/leagues/components/SeasonBadgeImage';
import type { ISeason } from '@/features/leagues/types/league';
import { formatSeason } from '@/features/leagues/utils/format-season';

interface ISeasonSlideProps {
  season: ISeason;
  leagueName: string;
  /** The first slide is visible on open, so its image loads eagerly. */
  isFirst: boolean;
}

/** One season: badge on a spotlight with the season years set large underneath. */
export const SeasonSlide = ({ season, leagueName, isFirst }: ISeasonSlideProps) => (
  <div className="flex flex-col items-center gap-4 px-2 pt-2">
    <SeasonBadgeImage season={season} leagueName={leagueName} eager={isFirst} />
    <p className="font-display text-5xl leading-none font-bold tabular-nums md:text-6xl">
      {formatSeason(season.name)}
    </p>
  </div>
);
