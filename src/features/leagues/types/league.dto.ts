// DTOs: the exact shapes TheSportsDB v1 API returns. They only exist at the API boundary
// (`features/leagues/api`) and are mapped to the app's own types in `utils/normalize-*.ts`.

/** One item of `all_leagues.php` → `leagues[]`. */
export interface ILeagueDto {
  idLeague: string;
  /** Typed as nullable: the public API's data isn't guaranteed, and one bad row mustn't break the list. */
  strLeague: string | null;
  strSport: string | null;
  /** Listed in the task, but not returned by all_leagues.php on the free API key. */
  strLeagueAlternate?: string | null;
}

/** Response of `all_leagues.php`. */
export interface ILeaguesResponseDto {
  leagues: ILeagueDto[] | null;
}

/** One item of `search_all_seasons.php?badge=1` → `seasons[]`. */
export interface ISeasonDto {
  strSeason: string;
  /** null when the API has no badge for that season. */
  strBadge?: string | null;
}

/** Response of `search_all_seasons.php?badge=1&id=…`; `seasons` is null for leagues with no seasons. */
export interface ISeasonsResponseDto {
  seasons: ISeasonDto[] | null;
}
