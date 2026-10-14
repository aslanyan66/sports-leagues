# Sports Leagues

A single-page app for browsing sports leagues from [TheSportsDB](https://www.thesportsdb.com/free_sports_api). Search leagues by name, filter them by sport, and open a league to swipe through its season badges.

## Features

- League list showing name, sport and alternate name
- Search by name (debounced, case-insensitive) and an animated sport filter built from the sports the API returns
- Leagues grouped by sport, one section per sport with its league count
- Season badge carousel in a centered dialog, with a placeholder when a season has no badge
- API responses cached for the session: nothing is fetched twice
- Responsive, light and dark themes, keyboard and screen-reader accessible
- 404 page and an error page for unexpected errors

## Getting started

Requires **Node.js 20.19+** (22 recommended, see `.nvmrc`).

```bash
npm install
npm run dev
```

Open http://localhost:5173.

No extra setup is needed. The `.env` file is committed on purpose: it only holds public, non-secret defaults (the app name and the public API base URL), so the app runs right after cloning. To override a value locally, create `.env.local`, which git ignores.

## Scripts

| Command                 | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Start the dev server                            |
| `npm run build`         | Type-check and build for production             |
| `npm run preview`       | Serve the production build locally              |
| `npm test`              | Run all tests once                              |
| `npm run test:watch`    | Run tests in watch mode                         |
| `npm run test:coverage` | Run tests with a coverage report                |
| `npm run lint`          | Lint with ESLint                                |
| `npm run format`        | Format with Prettier                            |
| `npm run check`         | Type-check, lint, format check and tests in one |

## API

Base URL (from `.env`): `https://www.thesportsdb.com/api/v1/json/3` (free public key `3`).

| Endpoint                                   | Used for                   |
| ------------------------------------------ | -------------------------- |
| `GET /all_leagues.php`                     | The league list            |
| `GET /search_all_seasons.php?badge=1&id=…` | Season badges for a league |

Endpoint paths and parameters live in `src/constants/api.ts`. The free key returns a limited sample that changes over time and may lack some sports or `strLeagueAlternate`; the UI handles this, see [design decisions](docs/DECISIONS.md#api-notes).

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite**, with the **React Compiler**
- **TanStack Query** for server data and caching, **Zustand** for UI state
- **Tailwind CSS v4**, **Radix UI** (accessible dropdown and dialog), **Embla Carousel**, **Lucide** icons
- **React Router** and **react-error-boundary** for routing and error handling
- **Vitest**, **React Testing Library** and **MSW** for tests
- **ESLint** and **Prettier** for code quality

## Architecture

**Feature-based architecture** (in the style of [Bulletproof React](https://github.com/alan2207/bulletproof-react)): code is grouped by feature, not by file type. Everything about leagues (API calls, components, hooks, state, types) lives in `features/leagues`, so the feature can be read, changed or removed in one place.

```
src/
├── app/         # App shell: router, providers, root layout
├── pages/       # Route pages that compose features: leagues, 404, error
├── features/
│   └── leagues/ # The leagues feature
│       ├── api/         # Endpoint calls and TanStack Query options
│       ├── components/  # League UI, one folder per area of the screen:
│       │   ├── filters/          # search and sport filters
│       │   ├── results/          # list, cards, loading/empty/error states
│       │   ├── seasons-dialog/   # dialog shell, header, lazy loading
│       │   └── season-carousel/  # badge slides and season timeline
│       ├── hooks/       # Feature hooks (results, sport options, seasons)
│       ├── store/       # UI state (Zustand): search, sport, open league
│       ├── types/       # API DTOs and app types
│       ├── utils/       # Pure helpers: filtering, grouping by sport, normalizing
│       └── index.ts     # Public API: what pages may import
├── components/  # Shared UI building blocks (ui, layout, feedback)
├── hooks/       # Shared hooks
├── api/         # HTTP client (fetch wrapper)
├── config/      # Typed environment variables
├── constants/   # API endpoints, routes, storage keys
├── types/       # Shared types (API query params)
├── lib/         # Configured libraries (QueryClient)
├── store/       # App-wide state (theme)
├── styles/      # Tailwind entry and theme tokens
├── testing/     # Test setup and API mocks
└── utils/       # Small shared helpers
```

Three rules keep it clean, all enforced by ESLint:

- **One-way imports:** shared code → `features` → `pages` → `app`. Shared folders never import from features, and features never import from each other; pages compose them.
- **Public APIs:** `components`, `hooks` and each feature are imported through their `index.ts` (`@/components`, `@/features/leagues`), never from files inside them.
- **Alias imports:** always `@/…`, never `../../`.

**Components** are small, single-purpose pieces: generic ones in `src/components` (Button, Dialog, Carousel…) are combined into league-specific ones in the feature. **Server data** lives in TanStack Query and **UI state** in Zustand. More in [design decisions](docs/DECISIONS.md).

## More

- [Design decisions](docs/DECISIONS.md): architecture, state, caching, accessibility, testing
- [AI tools used](docs/AI_TOOLS.md)
