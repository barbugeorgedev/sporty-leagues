## Sporty Leagues – Frontend Assignment

Single-page React application built with Vite to browse leagues from [TheSportsDB](https://www.thesportsdb.com/) and preview their season badges.

### Tech stack

- **React 19 + hooks only**
- **Vite** for bundling/dev server
- **JavaScript only** (no TypeScript)
- **Native `fetch`** for HTTP
- **SCSS** (`src/styles/main.scss`) for styling

### Features

- **Leagues list**: Fetches leagues from `https://www.thesportsdb.com/api/v1/json/3/all_leagues.php`.
- **Display**: Shows `strLeague`, `strSport`, and `strLeagueAlternate` with graceful fallbacks when fields are missing.
- **Filtering**:
  - Search input to filter by league name.
  - Dropdown to filter by sport.
- **Badge modal**:
  - Clicking a league fetches season badge data from  
    `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=<id>`.
  - Shows the first available badge image (or a clear empty state when none exist).
  - Responses are **cached in memory by league ID** to avoid repeated API calls.
- **States**: Loading, error, and empty states for both leagues and badge requests.
- **Responsive**: Mobile‑first layout that scales up to a multi-column grid on larger screens.

### Getting started

- **Install dependencies**

```bash
npm install
```

- **Run dev server**

```bash
npm run dev
```

The app will be available on the URL printed by Vite (typically `http://localhost:5173`).

- **Build for production**

```bash
npm run build
```

### Docker

Build and run a production image served by Nginx:

```bash
docker build -t sporty-leagues .
docker run --rm -p 8080:80 sporty-leagues
```

Then open `http://localhost:8080`.

### Assignment brief

The original exercise description is included as `docs/HOME_Assignment_-_Frontend_Engineer_-_League_List.pdf` in the project root for reference. Supporting notes live in `docs/AI_USAGE.md` and `docs/DESIGN_DECISIONS.md`.

### Repository notes

- Entry point: `src/main.jsx`
- Root component: `src/App.jsx`
- Global styles: `src/styles/main.scss`

