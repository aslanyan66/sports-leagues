import { ShieldOff } from 'lucide-react';

/** Shown instead of a badge when the API has none for a season, or the image can't load. */
export const SeasonBadgePlaceholder = () => (
  <div className="flex flex-col items-center gap-2 text-center text-fg-muted">
    <ShieldOff aria-hidden="true" className="size-14" strokeWidth={1.5} />
    <p className="text-sm font-medium">No badge for this season</p>
  </div>
);
