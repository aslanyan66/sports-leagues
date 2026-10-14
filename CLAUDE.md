# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React 19 + TypeScript (strict) + Vite SPA that browses sports leagues from TheSportsDB's free API (`VITE_API_URL` in the committed `.env`; override in `.env.local`). Uses pnpm (version pinned via `packageManager`, enable with `corepack enable`) and Node 20.19+ (`.nvmrc`: 22). `README.md` covers features and setup. `docs/DECISIONS.md` explains why things are built the way they are (caching, a11y, design, testing); read the relevant section before changing behavior in that area.

## Commands

```bash
pnpm dev                 # dev server on http://localhost:5173
pnpm build               # tsc -b && vite build
pnpm typecheck           # tsc -b --noEmit
pnpm lint                # eslint, --max-warnings 0 (warnings fail too)
pnpm lint:fix
pnpm knip                # unused files/exports/dependencies
pnpm format              # prettier --write (format:check to verify)
pnpm test                # vitest run
pnpm test:coverage
pnpm check               # typecheck + lint + knip + format:check + test (what CI runs, plus build)

# Single test file / single test by name
pnpm vitest run src/features/leagues/utils/filter-leagues.test.ts
pnpm vitest run -t "<test name pattern>"
```

Prettier runs through ESLint, so formatting problems show up as lint errors.

## Architecture

Feature-based layout (Bulletproof React style). Leagues code lives in `src/features/leagues/` (`api/`, `components/`, `hooks/`, `store/`, `types/`, `utils/`). `src/pages` composes features, and `src/app` holds the router, providers and root layout. The top-level shared folders (`components`, `hooks`, `api`, `lib`, `store`, `utils`, `constants`, `config`, `types`) hold code that isn't tied to one feature.

**ESLint enforces these architecture rules** (`eslint.config.js`), so code that breaks them fails lint and CI:
- **One-way imports:** shared → `features` → `pages` → `app`. Shared folders never import from features, pages or app. A feature never imports from another feature.
- **Public APIs:** from outside, import `@/components`, `@/hooks` and `@/features/<name>` only through their `index.ts`, never a deep path. Inside one of those modules, import sibling files directly, never through its own index, to avoid cycles. A feature's `index.ts` exports only what pages use. `src/testing/**` is the exception and may import feature internals.
- **Always use the `@/…` alias**, never `../`.
- **No URL literals in app code:** the base URL comes from `env.apiUrl` (`src/config/env.ts`). Endpoint paths, query param names and image sizes go in `src/constants/api.ts`, and feature-level constants go in `features/leagues/constants.ts`. Tests are exempt.

**Data flow:**
- `src/api/client.ts` is a small `fetch` wrapper (timeouts, typed `ApiError`, `buildUrl`). Feature calls (`features/leagues/api/get-*.ts`) fetch the DTOs and map them to app types with `normalizeLeagues` / `normalizeSeasons`. Components only ever see the app types (`types/league.ts`), never DTOs (`types/league.dto.ts`).
- **Server state uses TanStack Query.** `src/lib/query-client.ts` sets `staleTime`/`gcTime: Infinity` with no refetch on focus or reconnect, so each endpoint is fetched once per session. Query keys come from the factory in `leagues.queries.ts`. Query functions **deliberately don't pass the AbortSignal** to fetch, so requests aren't cancelled and repeated on unmount or StrictMode remount, and tests assert exactly one request. Derived views (sport options, filtered and grouped results, dialog header) reuse the single cached list through `select` in hooks.
- **UI state uses Zustand.** `features/leagues/store/leagues-ui.store.ts` holds search, sport and the open league, and `src/store/theme.store.ts` holds the theme. Components subscribe to individual values.
- Filtering and grouping are pure functions in `features/leagues/utils/`, unit-tested on their own. Sports come from the API data, never a hardcoded list.
- The seasons dialog and carousel load lazily in a separate chunk (`LazyLeagueSeasonsDialog`, `seasons-dialog-loader.ts`), preloaded on card hover or focus, with a local error boundary that retries with a fresh lazy component. `package.json` `sideEffects` lets the barrel exports tree-shake. Keep it accurate, or the dialog code ends up in the main bundle.
- The React Compiler (Babel preset in `vite.config.ts`) memoizes automatically, so don't add `useMemo`/`useCallback`/`memo` by hand.

**UI:** Tailwind v4 with semantic tokens (`bg-surface`, `text-fg-muted`, …) defined in `src/styles/global.css`. The theme is switched by `data-theme` on `<html>`, and an inline script in `index.html` sets it before first paint. Generic primitives live in `src/components/ui` (built on Radix and Embla, styled with `cn` and `cva`) and are combined into league components grouped by screen area (`filters/`, `results/`, `seasons-dialog/`, `season-carousel/`). Accessibility behavior (focus management, live regions, the tabbed carousel pattern, `aria-disabled` nav buttons) is intentional and documented in DECISIONS.md, so keep it working when you change these components.

## Conventions (lint-enforced)

- Object shapes (props, DTOs, store state) are `interface`s named `IName`. Unions and aliases use `type`. Every component has a named props interface.
- Components are arrow functions. Use inline type imports (`import { type X }`), `curly: all`, `eqeqeq`, and no non-null assertions.
- Import order: builtin, external, `@/…`, relative, type, with blank lines between groups and alphabetized within them.
- Prefix intentionally unused vars or args with `_`. Stale `eslint-disable` comments are errors.
- TS flags include `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.

## Testing

Vitest (jsdom) + React Testing Library + MSW. Test files sit next to their source as `*.test.ts(x)`. Import `describe`/`it`/`expect` explicitly from `vitest`, since globals are off.
- MSW intercepts real fetches (`src/testing/mocks/handlers.ts` with fixture data in `mocks/data.ts`), so tests run the real fetch → query → component path. To override a response in a test, use `server.use(...)`. Unhandled requests error.
- `src/testing/test-utils.tsx`: `renderWithProviders` wraps in StrictMode with a fresh QueryClient (retry off) and returns `user` (userEvent). `renderRoute(path)` renders the real app routes in a memory router.
- `setup.ts` resets the Zustand stores and `localStorage` before each test. `restoreMocks: true` is set.
- Integration coverage for the main page is in `src/pages/LeaguesPage.test.tsx`.
