import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { CarouselContext, useCarousel, type IGoToOptions } from '@/components/ui/carousel-context';
import { cn } from '@/utils/cn';

/*
 * Accessible "tabbed carousel" (WAI-ARIA APG) on top of Embla for swipe/drag:
 * - <Carousel> is a region with aria-roledescription="carousel".
 * - <CarouselTabs> is a tablist (arrow keys, Home, End) that picks the slide.
 * - Each <CarouselSlide> is the tabpanel for its tab.
 * The selected index lives in React state and is synced both ways with Embla,
 * so buttons, tabs and swipes all go through the same state.
 */

interface ICarouselProps {
  label: string;
  count: number;
  children: ReactNode;
  className?: string;
}

export const Carousel = ({ label, count, children, className }: ICarouselProps) => {
  const baseId = useId();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [announcedIndex, setAnnouncedIndex] = useState<number | null>(null);
  // Mirrors selectedIndex for the Embla listener, so it can tell a swipe from our own scrollTo.
  const selectedIndexRef = useRef(0);

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();

      if (index !== selectedIndexRef.current) {
        // Changed by a swipe/drag, not by our own controls.
        selectedIndexRef.current = index;
        setSelectedIndex(index);
        setAnnouncedIndex(index);
      }
    };
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const goTo = (index: number, { announce = true }: IGoToOptions = {}) => {
    const next = Math.min(Math.max(index, 0), count - 1);
    selectedIndexRef.current = next;
    setSelectedIndex(next);
    setAnnouncedIndex(announce ? next : null);
    emblaApi?.scrollTo(next);
  };

  return (
    <CarouselContext
      value={{
        emblaRef,
        selectedIndex,
        count,
        announcedIndex,
        goTo,
        getSlideId: (index) => `${baseId}-slide-${index}`,
        getTabId: (index) => `${baseId}-tab-${index}`,
      }}
    >
      <section
        aria-roledescription="carousel"
        aria-label={label}
        className={cn('flex flex-col gap-4', className)}
      >
        {children}
      </section>
    </CarouselContext>
  );
};

interface ICarouselViewportProps {
  children: ReactNode;
}

export const CarouselViewport = ({ children }: ICarouselViewportProps) => {
  const { emblaRef } = useCarousel();

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex touch-pan-y">{children}</div>
    </div>
  );
};

interface ICarouselSlideProps {
  index: number;
  children: ReactNode;
}

export const CarouselSlide = ({ index, children }: ICarouselSlideProps) => {
  const { selectedIndex, getSlideId, getTabId } = useCarousel();
  const isActive = index === selectedIndex;

  return (
    <div
      id={getSlideId(index)}
      role="tabpanel"
      aria-roledescription="slide"
      aria-labelledby={getTabId(index)}
      aria-hidden={!isActive}
      className="min-w-0 shrink-0 grow-0 basis-full"
    >
      {children}
    </div>
  );
};

interface ICarouselTabsProps {
  label: string;
  /**
   * Content of each tab, which is also its accessible name. Add context for screen readers with
   * `sr-only` text (e.g. "Season ") so the visible text stays part of the name (WCAG 2.5.3).
   */
  renderTab: (index: number, isSelected: boolean) => ReactNode;
  className?: string;
  tabClassName?: (isSelected: boolean) => string;
}

export const CarouselTabs = ({ label, renderTab, className, tabClassName }: ICarouselTabsProps) => {
  const { selectedIndex, count, goTo, getSlideId, getTabId } = useCarousel();
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // The tablist scrolls horizontally: keep the selected tab visible after swipes and button presses.
  // Only the tablist is scrolled. `scrollIntoView` would also scroll every scrollable parent,
  // pulling a tall dialog down to the tablist on short screens.
  useEffect(() => {
    const list = listRef.current;
    const tab = tabRefs.current[selectedIndex];

    if (!list || !tab) {
      return;
    }

    const tabStart = tab.offsetLeft;
    const tabEnd = tabStart + tab.offsetWidth;

    if (tabStart < list.scrollLeft) {
      list.scrollLeft = tabStart;
    } else if (tabEnd > list.scrollLeft + list.clientWidth) {
      list.scrollLeft = tabEnd - list.clientWidth;
    }
  }, [selectedIndex]);

  const selectAndFocus = (index: number) => {
    const next = (index + count) % count;
    goTo(next, { announce: false });
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keyActions: Partial<Record<string, () => void>> = {
      ArrowLeft: () => {
        selectAndFocus(selectedIndex - 1);
      },
      ArrowRight: () => {
        selectAndFocus(selectedIndex + 1);
      },
      Home: () => {
        selectAndFocus(0);
      },
      End: () => {
        selectAndFocus(count - 1);
      },
    };
    const action = keyActions[event.key];

    if (action) {
      event.preventDefault();
      action();
    }
  };

  return (
    // `relative` makes the tabs' offsetLeft relative to the tablist itself.
    <div ref={listRef} role="tablist" aria-label={label} className={cn('relative', className)}>
      {Array.from({ length: count }, (_, index) => {
        const isSelected = index === selectedIndex;

        return (
          <button
            // One tab per slide; slides never reorder, so the index is a stable key.
            key={index}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={getTabId(index)}
            aria-selected={isSelected}
            aria-controls={getSlideId(index)}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => {
              goTo(index, { announce: false });
            }}
            onKeyDown={onKeyDown}
            className={tabClassName?.(isSelected)}
          >
            {renderTab(index, isSelected)}
          </button>
        );
      })}
    </div>
  );
};

interface ICarouselControlsProps {
  /** Used in the button labels: "Previous {itemLabel}", "Next {itemLabel}". */
  itemLabel?: string;
}

export const CarouselControls = ({ itemLabel = 'slide' }: ICarouselControlsProps) => {
  const { selectedIndex, count, goTo } = useCarousel();

  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="secondary"
        size="icon"
        aria-label={`Previous ${itemLabel}`}
        disabled={selectedIndex === 0}
        onClick={() => {
          goTo(selectedIndex - 1);
        }}
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      <p className="text-sm font-medium text-fg-muted tabular-nums" aria-hidden="true">
        {selectedIndex + 1} / {count}
      </p>
      <Button
        variant="secondary"
        size="icon"
        aria-label={`Next ${itemLabel}`}
        disabled={selectedIndex === count - 1}
        onClick={() => {
          goTo(selectedIndex + 1);
        }}
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </div>
  );
};

/** Announces slide changes from the previous/next buttons and swipes (tabs announce themselves). */
interface ICarouselAnnouncerProps {
  getLabel: (index: number) => string;
}

export const CarouselAnnouncer = ({ getLabel }: ICarouselAnnouncerProps) => {
  const { announcedIndex, count } = useCarousel();

  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {announcedIndex === null
        ? ''
        : `${getLabel(announcedIndex)}, ${announcedIndex + 1} of ${count}`}
    </p>
  );
};
