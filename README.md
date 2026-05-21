## Sporty Leagues – Frontend Assignment

Single-page React application to browse leagues from [TheSportsDB](https://www.thesportsdb.com/) and preview season badges.

### Tech stack

- **React 19** + focused hooks (no global state library)
- **TypeScript** (strict, no `any`)
- **Vite** for dev/build
- **Vitest** + **React Testing Library** for regression tests
- **Native `fetch`** for HTTP
- **SCSS** (`src/styles/main.scss`)

### Features

- Leagues list from `all_leagues.php`
- Search + sport filter (derived with `useMemo`)
- Badge modal with cached API responses
- Loading, error, and empty states
- Responsive, mobile-first layout
- Docker production image (Nginx)

### Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle
npm test         # unit + integration tests
npm run lint
```

### Docker

```bash
docker build -t sporty-leagues .
docker run --rm -p 8080:80 sporty-leagues
```

Open `http://localhost:8080`.

### Project layout

| Path | Responsibility |
|------|----------------|
| `src/api/sportsdb.ts` | HTTP + badge cache + in-flight deduplication |
| `src/hooks/useLeagues.ts` | Initial leagues load (abort on unmount) |
| `src/hooks/useLeagueBadge.ts` | Badge async state per selected league |
| `src/hooks/useModal.ts` | Escape, focus trap, scroll lock, focus restore |
| `src/utils/filterLeagues.ts` | Pure filter/sport helpers (tested) |
| `src/App.tsx` | Composition only — no fetch/effect logic |
| `src/components/LeagueModal.tsx` | Presentational modal + `useModal` |

---

## Engineering notes (post-review refactor)

### Architecture choices

The app stays a **single-page exercise**: no router, no Redux/React Query, no feature-sliced folders. Logic moved into **small hooks** and a **typed API module** so `App.tsx` composes behavior instead of owning it.

That matches the original 90-minute scope while showing senior discipline: correct boundaries without enterprise ceremony.

### Cache ownership

**Single source of truth:** `Map<string, BadgeResult>` in `src/api/sportsdb.ts` only.

- UI holds **view state** via `useLeagueBadge` (`idle` / `loading` / `success` / `error`).
- React state is **not** a second cache.
- **Cache hits** call `getCachedBadge()` synchronously — no loading flicker on repeat opens.
- **In-flight deduplication:** concurrent requests for the same `idLeague` share one `Promise`.
- Null badge responses are cached to avoid repeat network calls for leagues without badges.

### Async race prevention

- `AbortController` on leagues load and badge fetch when selection changes or component unmounts.
- **Request generation** in `useLeagueBadge` ignores late responses after the user switches league.
- Badge `setState` only runs when `requestGeneration` matches the active effect run.

### Modal lifecycle

`useModal` + `LeagueModal` own **Escape**, **scroll lock**, **initial focus**, **focus restore**, and a **lightweight Tab trap**. No portal (not required at this z-index/complexity). Close button has `aria-label="Close dialog"`.

### Intentionally not implemented

| Omitted | Why |
|---------|-----|
| React Query / SWR | Overkill for two endpoints and one screen |
| Redux / Zustand | No shared cross-route state |
| Portal-based modal | No stacking/overflow issue observed |
| Playwright e2e | RTL covers filter + modal contract; keeps CI fast |
| Cache TTL / persistence | Out of assignment scope; in-memory is enough |
| Vue port | Role stack mismatch is a hiring context issue, not fixed by overbuilding here |

### Assignment reference

Brief: `docs/Home_Assignment_-_Frontend_Engineer_-_League_List.pdf`  
Supporting notes: `docs/DESIGN_DECISIONS.md`, `docs/AI_USAGE.md`
