# AI tools used

## Claude Code (Anthropic, Claude Opus 5.5)

I used Claude Code, an AI coding assistant running in the terminal, as a pair programmer throughout the task.

**How it helped**

- **Project setup:** scaffolded Vite + React + TypeScript and configured strict TypeScript, ESLint (no `any`, hook rules, import rules), Prettier, path aliases and the React Compiler.
- **Architecture:** we discussed folder structures (feature-based/Bulletproof React vs Feature-Sliced Design) and state options (TanStack Query vs axios alone, Zustand vs Redux/Context). I chose the approaches; the reasoning is in [DECISIONS.md](DECISIONS.md).
- **Implementation:** generated the API layer, Zustand stores, TanStack Query setup, the Tailwind theme, the component library (Radix-based dropdown and dialog, Embla carousel) and error pages to my specifications.
- **Design:** used the frontend-design skill to propose the visual direction (scoreboard typography, SportyBet-inspired palette, season "spotlight" dialog), which I reviewed and refined.
- **Accessibility:** helped apply WAI-ARIA patterns (tabbed carousel, dialog focus management) and caught a focus-return bug through tests.
- **API investigation:** checked the live API responses and docs, which surfaced that the free key returns a limited dataset (10 Soccer leagues, no `strLeagueAlternate`) and that some seasons have no badge, so the UI handles both.
- **Tests:** wrote the Vitest/RTL/MSW test suite, including a test proving badge responses are cached.
- **Refactoring:** reorganized the code as requirements changed: component folders by screen area, `index.ts` public APIs, a generic `Select`, sports built from the API instead of a fixed list, and removing features I decided against (sorting and a "group by" dropdown).
- **Review:** reviewed the code for leftovers and edge cases (e.g. dead helpers, an empty state offering a "Clear filters" that did nothing) and kept these docs in sync.

**What I did**

- Defined the requirements, stack, styling approach and structure, and made the trade-off decisions.
- Reviewed the generated code, ran the app and checked it on desktop and mobile in both themes.
