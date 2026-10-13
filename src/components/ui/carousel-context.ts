import { createContext, use } from 'react';

import type useEmblaCarousel from 'embla-carousel-react';

export interface IGoToOptions {
  /** Announce the new slide in the live region. Off for tab navigation: the focused tab is already read out. */
  announce?: boolean;
}

export interface ICarouselContextValue {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  selectedIndex: number;
  count: number;
  /** Index to announce, or null when there's nothing to announce. */
  announcedIndex: number | null;
  goTo: (index: number, options?: IGoToOptions) => void;
  getSlideId: (index: number) => string;
  getTabId: (index: number) => string;
}

export const CarouselContext = createContext<ICarouselContextValue | null>(null);

export const useCarousel = (): ICarouselContextValue => {
  const context = use(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used inside <Carousel>');
  }

  return context;
};
