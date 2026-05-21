# Design Decisions

## 1. Lightweight state management

React hooks only. State is local to the page: filter inputs, selected league, and async results from `useLeagues` / `useLeagueBadge`.

**Why:** Single SPA, no cross-route sharing. A global store would add noise without benefit.

## 2. Cache at the IO boundary

Badge caching lives in `src/api/sportsdb.ts` (module `Map` + in-flight `Promise` dedup). Components never duplicate cache keys or shapes.

**Why:** One source of truth, testable API layer, no loading flicker on cache hit via `getCachedBadge()`.

## 3. Typed async state

`BadgeAsyncState` and `LeaguesAsyncState` are discriminated unions (`idle` | `loading` | `success` | `error`).

**Why:** UI branches stay exhaustive and safe without boolean flag soup.

## 4. Modal owns its lifecycle

`useModal` handles Escape, scroll lock, focus restore, initial focus, and a simple Tab trap. `App` only sets `selectedLeague` and renders `LeagueModal` when non-null.

**Why:** Keyboard and focus concerns stay colocated; avoids split ownership bugs.

## 5. Derived filtering

Search and sport filters use controlled inputs; `filterLeagues` is pure and covered by unit tests.

## 6. Minimal tests

Vitest + RTL: utility tests + one filter flow + one modal/badge flow with mocked API.

**Why:** High signal per line; guards cache/async regressions without a large suite.

## 7. Intentional simplicity preserved

No React Query, Redux, portals, or feature-sliced mega-structure. The refactor improves **correctness and maintainability**, not pattern count.
