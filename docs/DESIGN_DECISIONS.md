# Design Decisions

## 1. Lightweight state management
I used React hooks only (`useState`, `useEffect`, `useMemo`) and kept state local to the page.

**Why:** The assignment is a single SPA with simple interactions, so introducing Redux / external state libraries would add unnecessary complexity.

## 2. Explicit API handling and caching
I used native `fetch` for both endpoints:
- `all_leagues.php` for the league list
- `search_all_seasons.php?badge=1&id=<id>` for badge lookup

League data is fetched once on mount. Badge responses are cached in memory by `idLeague` to avoid repeated network calls when the same league is clicked again.

**Why:** This keeps the data flow easy to follow while still satisfying the caching requirement.

## 3. Derived filtering logic
Search and sport filters are controlled inputs, and the filtered league list is derived with `useMemo`.

**Why:** This keeps filtering predictable, avoids unnecessary recalculation, and makes the UI logic easy to reason about.

## 4. UX states
The app includes explicit loading, error, and empty states for the initial league fetch and for badge lookup.

**Why:** Even in a small exercise, handling these states makes the UI more realistic and resilient.

## 5. Responsive, mobile-first UI
The layout is mobile-first, with stacked filters on smaller screens and a responsive league grid on larger screens.

**Why:** The role emphasizes mobile-first frontend development, so responsiveness was prioritized over visual complexity.

## 6. Intentional simplicity
I intentionally kept the solution lightweight and review-friendly rather than over-abstracting the code for a small time-boxed task.

If this were extended further, the next steps would be:
- extract reusable UI components
- move API calls into a dedicated module
- add tests around filtering and badge caching

