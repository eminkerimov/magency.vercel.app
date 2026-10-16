# Magency

Magency is a modern digital-agency experience built as a Senior Frontend Developer portfolio project. It is designed to feel like a complete product: polished responsive UI, realistic content, working forms, asynchronous states, routing, and browser-side persistence.

## Stack

- React 18
- Vite 8
- React Router 7
- TanStack Query 5
- Sass
- Mock Service Worker (MSW)
- Oxlint
- Vercel

## Product routes

- `/` - agency overview, services, selected work, process, team, engagement formats, and contact flow
- `/work` - responsive case-study catalogue for all three portfolio products
- `/work/:slug` - full case narrative with challenge, delivery, frontend decisions, outcome, and adjacent-case navigation
- `/start-project` - accessible three-step project brief with service, engagement, and case-study context
- `/blogs` - searchable, sortable, paginated, and bookmark-aware insight library
- `/blog/:id` - structured article reading experience with progress, helpfulness, sharing, bookmarks, and discussion
- `/categories` - topic discovery and category navigation
- unknown project, article, and application URLs - contextual 404 pages that preserve the requested URL

Every public route owns its document title, description, canonical URL, Open
Graph metadata, and robots policy. The production build writes route-specific
HTML metadata shells for known pages, plus `sitemap.xml`, `robots.txt`, and
`404.html`, so link previews do not depend on client JavaScript. Invalid
routes are marked `noindex, nofollow`. Secondary pages are route-split and
loaded on demand.

## API strategy

The application uses the same boundary it would use with a production backend: components call an API layer with standard `fetch` requests.

By default, MSW handles `/api/*` in the browser. This provides realistic request latency, HTTP status codes, validation errors, and persistence without running a separate server. Data that should survive a refresh is stored locally and is scoped to the current browser.

This approach keeps the frontend ready for a real API later: set `VITE_API_MODE=live` and connect the existing API client to live endpoints.

Current mock endpoints:

- `GET /api/case-studies`
- `GET /api/articles`
- `GET /api/articles/:id`
- `GET /api/categories`
- `GET /api/bookmarks`
- `PUT /api/bookmarks/:articleId`
- `DELETE /api/bookmarks/:articleId`
- `GET /api/articles/:articleId/helpfulness`
- `PUT /api/articles/:articleId/helpfulness`
- `GET /api/articles/:articleId/comments`
- `POST /api/articles/:articleId/comments`
- `DELETE /api/articles/:articleId/comments/:commentId`
- `POST /api/contact`
- `POST /api/newsletter`

The contributor directory is derived from the same `GET /api/articles`
response already used by the home page. It currently presents all five active
authors and calculates their published-insight counts from the catalogue, so
the Team section cannot drift away from the articles it links to. Each card
opens Insights with that author encoded in the URL-backed search filter. The
section also shares the articles request's loading, empty, error, and retry
states without adding a redundant authors endpoint.

The home page replaces generic reader testimonials with an interactive Selected
Work section. `GET /api/case-studies` supplies factual descriptions of three
portfolio projects: M-Movie, Fashion Archive, and SkyNature. The cases describe
the implemented frontend scope and technical decisions without invented clients,
performance metrics, or commercial outcomes.

Case selection is encoded as `?work=<slug>#work`, so a selected project can be
shared and restored through browser back/forward navigation. The accessible tab
interface supports click, Arrow Left/Right, Home, and End interaction. It also
includes asynchronous loading, empty, error, and retry states. Each case ends
with a contextual CTA to `/start-project`, carrying both the engagement and
the referenced case in the URL.

The same case-study response powers the dedicated `/work` catalogue and
`/work/:slug` detail routes. This keeps the home selector, catalogue cards,
technical stack, and case narratives consistent without adding a backend or a
second content source.

The home page presents three real agency engagement formats instead of
fictional paid memberships: Product Audit, Focused Build, and Ongoing Product
Support. Each CTA opens the project brief with a whitelisted
`?interest=<slug>` URL, so the selected format survives reloads,
back/forward navigation, and shared links.

The header, hero, service cards, engagement cards, work catalogue, and case
details no longer collapse into one contact anchor. Generic project intent
opens `/start-project`; service and case CTAs add contextual query parameters;
the footer's Quick contact link remains a direct path to the shorter home-page
form. The project brief validates each step, submits through `POST /api/contact`,
and returns a browser-local demo receipt without requiring a backend.

`POST /api/contact` validates the selected engagement in addition to the
existing form fields. The browser-local receipt stores only the request ID,
timestamp, and engagement slug; submitted names, emails, and messages are not
persisted.

Article pages consume the API exclusively. TanStack Query provides shared
caching, cancellation, retries, and request states, while the local article
collection is used only as seed data by the mock handlers.

All 12 detail routes receive topic-specific structured sections and author
profiles from `GET /api/articles/:id`. The article body and table of contents
are rendered from that response, and reading time is derived from the actual
structured content. List, category, related, navigation, and bookmark article
resources remain summary-only so full article bodies are not duplicated across
collection responses.

Bookmarks use the same API boundary. `GET` returns saved entries joined with
their article data, `PUT` is idempotent (`201` when created and `200` when the
entry already exists), and `DELETE` removes the entry. The browser stores only
an array of `{ articleId, savedAt }` records under `magency:v1:bookmarks`; article
content remains in the content source. TanStack Query mutations update the
shared cache optimistically, restore the previous snapshot on failure, reconcile
the server response, and serialize bookmark writes before one final
revalidation. Bookmark controls are globally locked while a write is in flight,
and storage changes from another tab invalidate the shared cache.

Article helpfulness uses a private, browser-local response instead of invented
public totals. `GET` returns the current reader's `helpful`, `not-helpful`, or
empty selection, and `PUT` creates or changes it. The article page applies the
choice optimistically, restores the previous selection when a request fails,
and exposes loading, saved, error, and retry states without showing vote counts
or percentages. Responses are stored under
`magency:v1:article-helpfulness`; changes from another tab invalidate the shared
TanStack Query cache so open article pages stay synchronized.

Article discussions use the same no-backend REST flow. `GET` returns a curated
recent discussion plus comments created in the current browser, `POST` validates
display names (2-50 characters) and comments (10-1,000 characters), and `DELETE`
is available only for browser-created comments. The composer exposes loading,
validation, success, failure, and empty states; new comments appear first and
update article comment counts across cached lists and detail views.

Discussion persistence uses `magency:v1:comments` with the versioned shape
`{ version: 1, comments: [...] }`. Stored entries contain only `id`, `articleId`,
`author`, `body`, and `createdAt`; ownership is derived by the mock API. Each
article keeps its seeded historical comment count, while the discussion renders
the available recent sample and adds valid browser-local comments to the total.
Writes are serialized across tabs with Web Locks when available; browsers
without Web Locks retain per-tab Promise sequencing.
This is why the interface can say, for example, "Showing 2 recent of 36
comments" without inventing a complete historical thread.

## Browser-local product state

Reading progress is stored independently under
`magency:reading-progress:v1` as a versioned `{ version, articles }` snapshot.
Each article entry contains only `progress` (an integer from 0 to 100) and
`updatedAt`. Progress is recorded in 5% steps while reading, never moves
backwards, and is marked complete when the reader reaches at least 95%. The
article body, rather than comments or footer content, defines that percentage.
The saved value powers accessible resume controls on the article page and
progress indicators on article cards. Same-tab subscribers update immediately,
and the browser `storage` event keeps open tabs in sync.

Insight search, category, sort, page, and saved-only state are URL-backed.
Opening an article preserves that originating URL so returning to Insights
restores the same result set.

Bookmarks, article helpfulness, comments, and reading progress keep safe
in-memory fallbacks when localStorage is unavailable. Their data is local to the
current browser and can be cleared with the browser's site-data controls.

## Local development

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Vite serves the project at the URL printed in the terminal.

## Environment

Copy `.env.example` to `.env.local` when an explicit API mode is useful:

```env
VITE_API_MODE=mock
VITE_SITE_URL=https://magency.vercel.app
```

- `mock` starts the browser mock API and is the default.
- `live` disables MSW so requests can reach a deployed API.
- `VITE_SITE_URL` supplies the absolute base URL for canonical and social metadata.

Only public client configuration belongs in `VITE_*` variables. Never place secrets in them.

## Quality checks

```bash
npm run lint
npm run build
npm run preview
```

The production output is written to `dist/`.

The UI does not depend on Bootstrap, Font Awesome, or another runtime CSS CDN.
Layout, icons, responsive behavior, and font loading are owned by the project.

## Deployment

The repository is configured for Vercel with the Vite framework preset,
`npm run build`, and `dist` as the output directory. Known nested routes are
rewritten to their generated HTML metadata shells, while `404.html` remains
the deployment fallback for unknown URLs. Each shell boots the same React
application, and files from `public/` (including the MSW service worker) are
copied into the deployed root.

`build/` and `dist/` are generated folders and must not be committed. A
Git-based deployment installs from `package-lock.json` and creates a fresh
`dist/` during the Vercel build. Set `VITE_SITE_URL` in Vercel only when the
production origin differs from `https://magency.vercel.app`.

No permanent shared backend is required in mock mode. Bookmarks, article
helpfulness, discussions, reading progress, form submissions, and other
interactive demo data remain local to each browser.
