// The app's own types (after normalizing the API DTOs in `league.dto.ts`).

/** A league as the UI uses it. Field names match the task's required display fields. */
export interface ILeague {
  idLeague: string;
  strLeague: string;
  strSport: string;
  /** Always present after normalizing: null when the API doesn't provide it. */
  strLeagueAlternate: string | null;
}

/** A season as the UI uses it: `badgeUrl` is null when the API has no badge for that season. */
export interface ISeason {
  name: string;
  badgeUrl: string | null;
}

export interface ILeagueFilterValues {
  search: string;
  /** null = all sports */
  sport: string | null;
}
