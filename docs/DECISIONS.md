# Design decisions

## State management

State is split by where it comes from:

- **Server state → TanStack Query.** League data and seasons come from the API. TanStack Query handles caching, loading/error states and request de-duplication. This directly covers the "cache responses to avoid repeat calls" requirement.
- **UI state → Zustand.** Search text, selected sport and the open league live in a small store (`features/leagues/store`). Components subscribe to just the values they read, so typing in the search box doesn't re-render the dropdown.

Why not Redux or Context: Redux Toolkit is a lot of setup for four values. Context re-renders every consumer on every change, which is a poor fit for a search box that updates on each keystroke. Zustand is ~1 KB, needs no provider and is easy to test outside React.

## Caching

- `staleTime: Infinity` and `gcTime: Infinity` (`src/lib/query-client.ts`): leagues and seasons don't change during a session, so each is fetched at most once.
- Query keys come from one factory: `['leagues', 'list']` and `['leagues', 'seasons', id]`, both under the `['leagues']` prefix.
- Seasons are cached per league. Closing and reopening a league shows its badges instantly with no request. A test checks this.
- The sport dropdown, the filtered list and the dialog header all read the same cached league list through TanStack Query's `select`: one request for all three.
- No refetch on window focus or reconnect.
- Query functions don't pass TanStack's `AbortSignal` to `fetch`. Otherwise a request is cancelled whenever its last component unmounts (closing the dialog, or React StrictMode's dev-only remount) and then sent again, which showed up as a cancelled + repeated request in the Network tab. A test asserts each endpoint is fetched exactly once under StrictMode.

## Season badges

- The badge API returns every season for a league. The dialog shows **all of them** in a carousel, oldest first, with a timeline of season years to jump between them.
- Seasons with `strBadge: null` (e.g. the English League Championship, whose seasons start in 1892) get a placeholder ("No badge for this season") instead of a broken image. A badge that fails to load falls back to the same placeholder.
- If the API returns `seasons: null`, the dialog says there are no seasons on record.
- Badge images load TheSportsDB's resized `/small` version (250px), with the original for retina screens. Season badges usually have **no `/medium` version** (it returns 404 for 35 of the 40 badges I checked), so it isn't used. If `/small` fails, the original is tried before falling back to the placeholder.

## Filtering

- League data is trimmed once when it arrives (`normalizeLeagues`), so the filter and the dropdown always compare the same values.
- Name search is case-insensitive, trims spaces and is debounced by 250 ms. Clearing it applies immediately and cancels any search still waiting, so typing again right after clearing never brings back the old one. The empty-state message describes the filters actually applied, not the half-typed query.
- It also matches `strLeagueAlternate` when the API provides it.
- **Sports come from the API, not a hardcoded list.** `groupLeaguesBySport` groups the leagues by `strSport`, and both the sport dropdown (each sport with its league count, e.g. "Soccer (n)") and the results (one section per sport) are built from it. So every option has leagues behind it, and a new sport in the API shows up with no code change. A league without a sport is grouped under "Other". The brief's examples (Basketball, Motorsport) appear whenever the API returns them.
- `useLeagueResults` filters the cached data, then groups it by sport. Sports are A–Z; leagues keep the API's order inside each sport.
- Filtering and grouping are pure functions (`filter-leagues.ts`, `group-leagues-by-sport.ts`), unit-tested on their own.
- The empty state offers "Clear filters" only when a filter is applied. If the API returns no leagues at all, it just says so.

## API notes

- The free API key (`3`) returns a **limited sample** of leagues (TheSportsDB limits free-key results). It changes over time, so the app assumes nothing about its size or which sports it contains, and handles a missing `strLeagueAlternate` ("No alternate name"). Tests use a richer mock dataset to cover the full behavior.
- Text fields the app relies on (`strLeague`, `strSport`) are typed as nullable and normalized defensively, so one incomplete row can't break the whole list.
- Responses are typed with TypeScript but not validated at runtime. For production I'd add schema validation (e.g. zod) at the API boundary.
- A small `fetch` wrapper is used instead of axios: the app only needs GET, timeouts (`AbortSignal.timeout`) and typed errors, which `fetch` covers without the extra dependency.

## UI and design

- **Direction:** a bookmaker's league board. Barlow Condensed (league names, headings, season years) gives a scoreboard feel; Barlow for body text. The one "loud" element is the season dialog: the badge on a spotlight with large season numerals and a timeline of seasons. Everything else stays quiet.
- **Tailwind CSS v4** with semantic theme tokens (`bg-surface`, `text-fg-muted`, `bg-brand-strong`…) defined once in `src/styles/global.css`.
- **Light and dark themes** in a SportyBet-inspired palette (brand red `#EC1C24`). The browser bar color (`theme-color`) follows the header of the current theme. Colors are CSS variables switched by `data-theme` on `<html>`. The first visit follows the OS setting, and the user's choice is saved. An inline script in `index.html` applies the theme before the first paint, so there's no flash.
- **Contrast:** text fields and the dropdown have a darker border (`input-border`, 3.6:1 in both themes), since a form control's edge must reach 3:1. Buttons use a darker red (`#C9141B`, 5.9:1 with white) because the brand red is just under the 4.5:1 minimum for normal-size text. The bright red is kept for large text and accents.
- **Building blocks:** generic UI pieces (Button, Chip, SearchField, Select, Dialog, Carousel, Skeleton, StateMessage) are composed into league-specific components. Radix UI provides the accessible behavior for the dropdown and dialog; Embla provides swipe for the carousel.
- **Responsive:** 1-column grid on phones, then 2 and 3 columns. Filters stack on mobile. The seasons dialog is centered on every screen: 16 px from the screen edges on phones, scrolling inside itself if the screen is short, and the badge shrinks to fit landscape phones. Touch targets are at least 44 px.
- **Performance:** the dialog and carousel code is its own chunk (~15 KB gzipped), downloaded only when a league card is hovered, focused or opened. Badges on slides other than the first use `loading="lazy"`.

## Component tree

The leagues page is composed from small single-purpose components (generic pieces from `src/components`, league pieces from `src/features/leagues/components`). League components are grouped by screen area: `filters/`, `results/`, `seasons-dialog/` and `season-carousel/`, so a new piece goes next to the ones it sits beside on screen:

```
LeaguesPage
├── PageHeader
├── LeagueFilters ............ search landmark
│   ├── LeagueSearch → SearchField
│   └── SportSelect → Select (Radix)
├── LeagueResults ............ loading / error / empty / sections per sport
│   ├── LeagueListSkeleton
│   ├── LeagueResultsError → StateMessage
│   ├── LeagueResultsCount ..... screen readers only (aria-live)
│   ├── LeagueResultsEmpty → StateMessage
│   └── LeagueSportGroups ...... one section per sport
│       └── LeagueList → LeagueCard → Chip
└── LazyLeagueSeasonsDialog .. loaded on first open
    └── LeagueSeasonsDialog → Dialog (Radix)
        ├── LeagueSeasonsHeader
        └── LeagueSeasons ........ loading / error / no seasons / carousel
            └── SeasonCarousel → Carousel (Embla)
                ├── SeasonSlide → SeasonBadgeImage → SeasonBadgePlaceholder
                ├── CarouselControls
                └── SeasonYearNav → CarouselTabs
```

## Accessibility

- **Keyboard:** everything is reachable with Tab, with visible focus rings. A "Skip to content" link is the first focusable element.
- **Dropdown:** Radix Select (arrow keys, type-ahead, Esc).
- **Dialog:** on open, focus goes to the dialog itself, so screen readers start from its title (not a dimmed "Previous" button); it's trapped while open; the close button comes first in Tab order, matching its top-right position; Esc or the close button closes it; focus returns to the league card that opened it.
- **Carousel:** follows the WAI-ARIA "tabbed carousel" pattern. The season timeline is a tablist (arrow keys, Home, End), each slide is its tab panel, and the selected tab scrolls into view (only the timeline scrolls, never the dialog). Each tab's name contains its visible text ("Season 1992–93", with "Season" for screen readers only), so voice-control users can say what they see. Changes from the previous/next buttons or a swipe are announced ("Season 1993-1994, 2 of 5"); tab changes aren't repeated, because the focused tab is already read out.
- **No lost focus:** previous/next use `aria-disabled` instead of `disabled` at either end, so they stay focusable. "Clear filters" and a successful "Try again" disappear once used, so focus moves to the search field instead of falling back to the page start.
- **Screen readers:** labelled controls, result count announced as it changes (`aria-live`, visually hidden since each sport heading shows its count; the only announcement for an empty result), loading states use `role="status"`, errors use `role="alert"`, decorative icons are hidden.
- **Motion:** CSS animations are switched off for users who prefer reduced motion, and the carousel jumps between seasons instead of sliding (Embla animates in JavaScript, which the CSS rule can't reach).

## Errors and routing

- **React Router** with two routes: `/` (leagues) and `*` (404 page). Tab titles are built from `VITE_APP_NAME` (`pageTitle`).
- **Route error boundary** (`errorElement`): any error thrown while rendering a page shows the error page with "Reload page" and "Back to leagues". In development it also shows the error message.
- **Top-level error boundary** (`react-error-boundary`): catches errors outside the router, such as in providers.
- API errors are not page crashes: they're shown in place with a "Try again" button.
- If the dialog's code chunk fails to download (e.g. offline), a local error boundary shows "Season badges couldn't open" with a retry, instead of the error replacing the whole page. React.lazy remembers a failed import, so a retry creates a fresh lazy component. Hover/focus preloads ignore failures.

## Testing

Vitest + React Testing Library, with **MSW** mocking the API at the network level, so tests run the real fetch → query → component path.

- **Unit:** filtering, grouping by sport, sport options, league and season normalizing, badge image URLs, season formatting, the Zustand store, `useDebounce`, the API client, the theme toggle, the search field.
- **Integration (`LeaguesPage.test.tsx`):** loading → list, error → retry, empty API response, debounced search, sport options from the API with counts, sport filter, sections per sport, "Clear filters", dialog content, carousel buttons, keyboard tabs (arrows, Home, End), null-badge placeholders, focus returning to the card, and **seasons served from cache on reopen (exactly one request)**.
- **Routing:** home page, 404 page and its "Back to leagues" link, and the error page for a crashing route.

## Types and constants

- **DTOs vs app types:** `features/leagues/types/league.dto.ts` holds the exact API response shapes (`ILeagueDto`, `ISeasonsResponseDto`…). They're only used at the API boundary and mapped to the app's types (`ILeague`, `ISeason` in `league.ts`) by `normalizeLeagues` / `normalizeSeasons`. Components never see raw API data.
- **Naming:** object shapes (DTOs, component props, store state) are `interface`s with an `I` prefix (`ILeagueCardProps`); unions and aliases stay `type` (`type Theme = 'light' | 'dark'`). Every component has a named props interface. Both rules are enforced by ESLint.
- **Generic components:** shared components that take a list of values are generic over the value type. `Select<TValue>` can be used with a string union, so `onChange` receives that exact type and a wrong option value is a compile error. It maps Radix's plain string back to the typed option instead of casting.
- **Public APIs (`index.ts`):** `@/components`, `@/hooks` and each feature (`@/features/leagues`) are imported through their `index.ts`, so a page needs one import line per module. A feature's index exports only what pages use (its three top-level components); the rest of the feature stays internal. Files inside a module import each other directly, which keeps the index files free of cycles. ESLint enforces both. Test setup and mocks may use feature internals to build fixtures. `package.json` declares `sideEffects` (only CSS and `main.tsx`), so the bundler can still drop unused re-exports: without it, the barrel pulled the dialog and carousel code into the main bundle.
- **No hardcoded API details:** the base URL comes from `.env` (`VITE_API_URL`, validated in `src/config/env.ts`). Endpoint paths, query parameter names, image sizes and the JSON content type live in `src/constants/api.ts`. Feature-level values (the "all sports" value, the fallback sport name, the debounce delay) live in `features/leagues/constants.ts`. An ESLint rule fails lint (and CI) if a URL literal appears in app code.

## Tooling

- TypeScript in strict mode plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and related flags.
- ESLint: `typescript-eslint` strict type-checked rules (no `any`), React, React Hooks (`exhaustive-deps` as a warning), jsx-a11y, import ordering and architecture rules, TanStack Query, Vitest and Testing Library rules. Prettier (with Tailwind class sorting) runs through ESLint.
- **No unused code:** TypeScript (`noUnusedLocals`, `noUnusedParameters`) and ESLint catch unused variables, imports, parameters, props and leftover `eslint-disable` comments as you type. Knip (`npm run knip`) finds what a single file can't show: unused files, exports and dependencies. Both run in `npm run check` and CI.
- The React Compiler runs through Babel and memoizes components automatically.

## If I had more time

- Runtime validation of API responses (zod).
- Sync filters to the URL so filtered views can be shared and survive a refresh.
- List virtualization if the full (paid-tier) league list is used.
- End-to-end tests (Playwright) and visual regression checks in both themes.
