import { Skeleton } from '@/components';
import { LEAGUE_SKELETON_COUNT } from '@/features/leagues/constants';

export const LeagueListSkeleton = () => (
  <div role="status">
    <span className="sr-only">Loading leagues</span>
    <ul aria-hidden="true" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
      {Array.from({ length: LEAGUE_SKELETON_COUNT }, (_, index) => (
        // Static placeholders that never reorder, so the index is a stable key.
        <li
          key={index}
          className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4"
        >
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-2 h-4 w-36" />
        </li>
      ))}
    </ul>
  </div>
);
