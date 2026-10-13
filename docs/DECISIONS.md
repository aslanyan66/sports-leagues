# Design decisions

## State management

State is split by where it comes from:

- **Server state → TanStack Query.** League data and seasons come from the API. TanStack Query handles caching, loading/error states, request de-duplication and cancellation. This directly covers the "cache responses to avoid repeat calls" requirement.
- **UI state → Zustand.** Search text, selected sport and the open league live in a small store (`features/leagues/store`). Components subscribe to just the values they read, so typing in the search box doesn't re-render the dropdown.

Why not Redux or Context: Redux Toolkit is a lot of setup for three values. Context re-renders every consumer on every change, which is a poor fit for a search box that updates on each keystroke. Zustand is ~1 KB, needs no provider and is easy to test outside React.

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
- Name search is case-insensitive, trims spaces and is debounced by 250 ms. Clearing it applies immediately, and the empty-state message describes the filters actually applied, not the half-typed query.
- It also matches `strLeagueAlternate` when the API provides it.
- The sport dropdown always offers the sports named in the brief (Soccer, Basketball, Motorsport) plus any other sport found in the data. Picking a sport with no leagues (Basketball on the free API key) shows an empty state with a "Clear filters" action.
- Filtering is a pure function (`filter-leagues.ts`), unit-tested on its own.

## API notes

- The free API key (`3`) returns a **limited dataset: 10 leagues, all Soccer, without `strLeagueAlternate`** (TheSportsDB documents a free limit of 10 for `all_leagues.php`). The UI handles the missing field ("No alternate name"). Tests use a richer mock dataset to cover the full behavior.
- Responses are typed with TypeScript but not validated at runtime. For production I'd add schema validation (e.g. zod) at the API boundary.
- A small `fetch` wrapper is used instead of axios: the app only needs GET, timeouts (`AbortSignal.timeout`) and typed errors, which `fetch` covers without the extra dependency.

## UI and design

- **Direction:** a bookmaker's league board. Barlow Condensed (league names, headings, season years) gives a scoreboard feel; Barlow for body text. The one "loud" element is the season dialog: the badge on a spotlight with large season numerals and a timeline of seasons. Everything else stays quiet.
- **Tailwind CSS v4** with semantic theme tokens (`bg-surface`, `text-fg-muted`, `bg-brand-strong`…) defined once in `src/styles/global.css`.
- **Light and dark themes** in a SportyBet-inspired palette (brand red `#EC1C24`). Colors are CSS variables switched by `data-theme` on `<html>`. The first visit follows the OS setting, and the user's choice is saved. An inline script in `index.html` applies the theme before the first paint, so there's no flash.
- **Contrast:** buttons use a darker red (`#C9141B`, 5.9:1 with white) because the brand red is just under the 4.5:1 minimum for normal-size text. The bright red is kept for large text and accents.
- **Building blocks:** generic UI pieces (Button, Chip, SearchField, Select, Dialog, Carousel, Skeleton, StateMessage) are composed into league-specific components. Radix UI provides the accessible behavior for the dropdown and dialog; Embla provides swipe for the carousel.
- **Responsive:** 1-column grid on phones, then 2 and 3 columns. Filters stack on mobile. The seasons dialog is a bottom sheet on mobile and a centered dialog from tablet up. Touch targets are at least 44 px.
- **Performance:** the dialog and carousel code is its own ~15 KB chunk, downloaded only when a league card is hovered, focused or opened. Badges on slides other than the first use `loading="lazy"`.

## Component tree

The leagues page is composed from small single-purpose components (generic pieces from `src/components`, league pieces from `src/features/leagues/components`):

```
LeaguesPage
├── PageHeader
├── LeagueFilters ............ search landmark
│   ├── LeagueSearch → SearchField
│   └── SportSelect → Select (Radix)
├── LeagueResults ............ loading / error / empty / list
│   ├── LeagueListSkeleton
│   ├── LeagueResultsError → StateMessage
│   ├── LeagueResultsCount (aria-live)
│   ├── LeagueResultsEmpty → StateMessage
│   └── LeagueList → LeagueCard → Chip
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
- **Dialog:** focus moves into it and is trapped while open; Esc or the close button closes it; focus returns to the league card that opened it.
- **Carousel:** follows the WAI-ARIA "tabbed carousel" pattern. The season timeline is a tablist (arrow keys, Home, End), each slide is its tab panel, and the selected tab scrolls into view. Changes from the previous/next buttons or a swipe are announced ("Season 1993-1994, 2 of 5"); tab changes aren't repeated, because the focused tab is already read out.
- **No lost focus:** buttons that become unavailable while focused (previous/next at either end, "Try again" while retrying) use `aria-disabled` instead of `disabled`, so they stay focusable.
- **Screen readers:** labelled controls, result count announced as it changes (`aria-live`, the only announcement for an empty result), loading states use `role="status"`, errors use `role="alert"`, decorative icons are hidden.
- **Motion:** all animations are switched off for users who prefer reduced motion.

## Errors and routing

- **React Router** with two routes: `/` (leagues) and `*` (404 page).
- **Route error boundary** (`errorElement`): any error thrown while rendering a page shows the error page with "Reload page" and "Back to leagues". In development it also shows the error message.
- **Top-level error boundary** (`react-error-boundary`): catches errors outside the router, such as in providers.
- API errors are not page crashes: they're shown in place with a "Try again" button.

## Testing

Vitest + React Testing Library, with **MSW** mocking the API at the network level, so tests run the real fetch → query → component path.

- **Unit:** filtering, sport options, season normalizing, badge image URLs, season formatting, the Zustand store, `useDebounce`, the API client, the theme toggle, the search field.
- **Integration (`LeaguesPage.test.tsx`):** loading → list, error → retry, debounced search, sport filter including an empty sport and "Clear filters", dialog content, carousel buttons, keyboard tabs (arrows, Home, End), null-badge placeholders, focus returning to the card, and **seasons served from cache on reopen (exactly one request)**.
- **Routing:** home page, 404 page and its "Back to leagues" link, and the error page for a crashing route.

## Types and constants

- **DTOs vs app types:** `features/leagues/types/league.dto.ts` holds the exact API response shapes (`ILeagueDto`, `ISeasonsResponseDto`…). They're only used at the API boundary and mapped to the app's types (`ILeague`, `ISeason` in `league.ts`) by `normalizeLeagues` / `normalizeSeasons`. Components never see raw API data.
- **Naming:** object shapes (DTOs, component props, store state) are `interface`s with an `I` prefix (`ILeagueCardProps`); unions and aliases stay `type` (`type Theme = 'light' | 'dark'`). Every component has a named props interface. Both rules are enforced by ESLint.
- **No hardcoded API details:** the base URL comes from `.env` (`VITE_API_URL`, validated in `src/config/env.ts`). Endpoint paths, query parameter names, image sizes and the JSON content type live in `src/constants/api.ts`. Feature-level values (default sports, debounce delay) live in `features/leagues/constants.ts`. An ESLint rule fails the build if a URL literal appears in app code.

## Tooling

- TypeScript in strict mode plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and related flags.
- ESLint: `typescript-eslint` strict type-checked rules (no `any`), React, React Hooks (`exhaustive-deps` as a warning), jsx-a11y, import ordering and architecture rules, TanStack Query, Vitest and Testing Library rules. Prettier (with Tailwind class sorting) runs through ESLint.
- The React Compiler runs through Babel and memoizes components automatically.

## If I had more time

- Runtime validation of API responses (zod).
- Sync filters to the URL so filtered views can be shared and survive a refresh.
- List virtualization if the full (paid-tier) league list is used.
- End-to-end tests (Playwright) and visual regression checks in both themes.
