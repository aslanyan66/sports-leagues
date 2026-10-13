# Sports Leagues

A single-page app for browsing sports leagues from [TheSportsDB](https://www.thesportsdb.com/free_sports_api). Search leagues by name, filter them by sport, and open a league to swipe through its season badges.

## Features

- League list showing name, sport and alternate name
- Search by name (debounced, case-insensitive) and an animated sport filter
- Season badge carousel in a dialog (bottom sheet on mobile), with a placeholder when a season has no badge
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

Endpoint paths and parameters live in `src/constants/api.ts`. The free key returns a limited dataset (10 leagues, all Soccer, without `strLeagueAlternate`); the UI handles this, see [design decisions](docs/DECISIONS.md#api-notes).

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite**, with the **React Compiler**
- **TanStack Query** for server data and caching, **Zustand** for UI state
- **Tailwind CSS v4**, **Radix UI** (accessible dropdown and dialog), **Embla Carousel**, **Lucide** icons
- **React Router** and **react-error-boundary** for routing and error handling
- **Vitest**, **React Testing Library** and **MSW** for tests
- **ESLint** and **Prettier** for code quality

## Project structure

```
src/
├── app/         # App shell: routes, providers, root layout
├── api/         # HTTP client (fetch wrapper)
├── components/  # Shared UI building blocks (ui, layout, feedback)
├── config/      # Typed environment variables
├── constants/   # API endpoints, routes, storage keys
├── features/
│   └── leagues/ # Everything league-related: api, components, hooks, store, types, utils
├── hooks/       # Shared hooks
├── lib/         # Configured libraries (QueryClient)
├── pages/       # Route pages: leagues, 404, error
├── store/       # App-wide state (theme)
├── styles/      # Tailwind entry and theme tokens
├── testing/     # Test setup and API mocks
└── utils/       # Small shared helpers
```

Feature-based architecture: shared code imports nothing from features, features don't import from each other, and pages compose them. ESLint enforces these rules.

## More

- [Design decisions](docs/DECISIONS.md): architecture, state, caching, accessibility, testing
- [AI tools used](docs/AI_TOOLS.md)
