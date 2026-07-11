# Movie App (react-demo)

A single-page React app for browsing popular movies and searching The Movie Database (TMDB), with a serverless API proxy.

## Tech stack

| Library | Version |
| --- | --- |
| React | 19.2.7 |
| React DOM | 19.2.7 |
| TypeScript | ~6.0.2 |
| Vite | ^8.1.1 |
| react-router-dom | ^7.18.1 |
| ESLint | ^10.6.0 |

See [package.json](package.json) for the full dependency list.

## Project layout

This app lives in `frontend/`, alongside a sibling `../api/` folder at the repo root:

```
react-demo/
  frontend/            <- you are here
    public/
      staticwebapp.config.json   # Azure SPA fallback routing + API runtime config
    src/
      components/
        navbar.tsx      # top nav (Home / Favorites links)
        MovieCard.tsx   # poster, title, release year for one movie
      pages/
        Home.tsx        # popular movies grid + search
        Favorites.tsx   # saved favorites list
      contexts/
        MovieContext.tsx  # favorites state (work in progress)
      services/
        api.ts          # calls the /api/movies/* proxy (see api/ below), typed Movie interface
      css/               # one stylesheet per component/page
      App.tsx            # route definitions
      main.tsx           # app entry point (BrowserRouter + StrictMode)
  api/                  <- sibling folder, NOT inside frontend/
    movies-popular/      # Azure Function: GET /api/movies/popular
    movies-search/       # Azure Function: GET /api/movies/search?q=
    host.json / package.json
  .github/workflows/     # GitHub Actions CI/CD (Azure Static Web Apps)
```

The frontend never talks to TMDB directly. `src/services/api.ts` calls relative `/api/movies/popular` and `/api/movies/search` routes, which are served by the Azure Functions in `../api/` (proxied automatically in production by Azure Static Web Apps, and via a local dev proxy — see below). The TMDB API key only ever lives server-side, as an environment variable read by those functions.

## Running locally

You need two terminals — one for the API, one for the frontend.

**Prerequisites (one-time):**
- [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local) — `npm install -g azure-functions-core-tools@4 --unsafe-perm true`
- A `../api/local.settings.json` file (gitignored, not committed) with your TMDB key:
  ```json
  {
    "IsEncrypted": false,
    "Values": {
      "FUNCTIONS_WORKER_RUNTIME": "node",
      "TMDB_API_KEY": "<your TMDB key>"
    }
  }
  ```

**Terminal 1 — API:**
```bash
cd api
func start          # serves the Functions app on http://localhost:7071
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
npm run dev         # serves Vite on http://localhost:5173, proxying /api/* to :7071
```

Open [http://localhost:5173](http://localhost:5173).

## Other commands

```bash
npm run build     # tsc -b && vite build -> outputs to dist/
npm run preview   # preview the production build locally
npm run lint      # eslint .
```

## Deployment

Pushes to `main` deploy automatically via GitHub Actions to Azure Static Web Apps (Free tier) — see `.github/workflows/`. The frontend (`frontend/dist`) and the API (`api/`) are built and deployed together; the TMDB key is stored as an Azure Static Web Apps Application Setting, never in source control.
