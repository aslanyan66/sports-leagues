import {
  Carousel,
  CarouselAnnouncer,
  CarouselControls,
  CarouselSlide,
  CarouselViewport,
} from '@/components';
import { SeasonSlide } from '@/features/leagues/components/season-carousel/SeasonSlide';
import { SeasonYearNav } from '@/features/leagues/components/season-carousel/SeasonYearNav';
import type { ISeason } from '@/features/leagues/types/league';
import { formatSeason } from '@/features/leagues/utils/format-season';

interface ISeasonCarouselProps {
  seasons: ISeason[];
  leagueName: string;
}

/** Composes the generic carousel pieces into the season badge browser. */
export const SeasonCarousel = ({ seasons, leagueName }: ISeasonCarouselProps) => (
  <Carousel label={`${leagueName} season badges`} count={seasons.length}>
    <CarouselViewport>
      {seasons.map((season, index) => (
        <CarouselSlide key={season.name} index={index}>
          <SeasonSlide season={season} leagueName={leagueName} isFirst={index === 0} />
        </CarouselSlide>
      ))}
    </CarouselViewport>
    <CarouselControls itemLabel="season" />
    <SeasonYearNav seasons={seasons} />
    <CarouselAnnouncer getLabel={(index) => `Season ${formatSeason(seasons[index]?.name ?? '')}`} />
  </Carousel>
);
