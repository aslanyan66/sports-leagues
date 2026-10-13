interface ILeagueResultsCountProps {
  count: number;
}

/** Visible result count, announced to screen readers when the filters change it. */
export const LeagueResultsCount = ({ count }: ILeagueResultsCountProps) => (
  <p className="text-sm font-medium text-fg-muted" aria-live="polite" aria-atomic="true">
    {count === 1 ? '1 league' : `${count} leagues`}
  </p>
);
