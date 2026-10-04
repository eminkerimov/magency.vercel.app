# M-Agency Project Context

## Project purpose

M-Agency is a portfolio project for a Senior Frontend Developer.

It is an agency-style product website used to demonstrate senior-level frontend
work: product thinking, UI quality, component architecture, accessibility,
responsive behavior, performance, testing, and pragmatic delivery decisions.

The primary product goal is to create the visual and behavioral impression of a
real, modern application. It is not required to represent an operating agency
with real customers, commercial plans, or a production content team.

## Content rules

- Case studies describe real portfolio work accurately. Do not invent clients,
  usage or conversion metrics, awards, or commercial outcomes; identify concept
  projects through their factual project type and scope.
- Concept team members, articles, and business scenarios are valid portfolio
  content.
- Concept content should be internally consistent and presented as normal
  product data. Its mock nature belongs in repository documentation and does not
  need to be exposed in every interface.
- Seeded metrics and activity data are allowed when they make the product feel
  complete, but they must remain consistent across the UI.
- Static content is not automatically "bad mock data". For a portfolio and a
  content-led static site, local structured content is a valid production
  architecture.
- When asynchronous behavior adds portfolio value, expose local seed data
  through a realistic mock API instead of importing it directly into every
  component.
- Prefer complete, believable flows over a large number of decorative controls.

## Technical direction

### Current state

- React 18
- Vite 8
- React Router 7
- TanStack Query 5
- Sass
- Mock Service Worker REST boundary
- Vercel-ready static deployment

### Architecture direction

- React with Vite
- Vercel deployment
- No separately managed traditional backend
- Mock Service Worker for production-like REST requests without a server
- localStorage or IndexedDB for browser-local persistence
- Vercel Functions only when a real external side effect can be added without
  building and maintaining a full backend

The Create React App to Vite migration is complete. Future features should keep
the API client independent from MSW so a live API can replace the mock handlers
without rewriting page components.

## Data and API strategy

| Feature | Preferred implementation |
| --- | --- |
| Articles, services, team | Local seed content exposed through mock REST endpoints when async behavior is useful |
| Selected work | `GET /api/case-studies` with factual portfolio cases, async UI states, and URL-backed tab selection |
| Search, sorting, filtering, pagination | Client-side derived state |
| Theme and demo preferences | localStorage with a clear reset path |
| Bookmarks | MSW REST endpoints backed by a minimal browser-local record; TanStack Query owns shared cache and optimistic mutations |
| Reading progress | Versioned localStorage snapshot with same-tab subscriptions and cross-tab synchronization |
| Article helpfulness | MSW GET/PUT endpoints backed by one browser-local response per article; optimistic UI and cross-tab cache synchronization without invented public totals |
| Contact form | URL-backed engagement selection plus POST /api/contact through MSW with validation, latency, success/error states, and a minimal browser-local receipt; optionally replace with a Vercel Function |
| Newsletter form | Mock API with duplicate handling and persistence; optionally replace with a real provider later |
| Public API with no secret | Direct browser fetch, with loading, empty, and error states |
| API requiring a secret | Vercel Function; keep the secret in Vercel environment variables |
| Comments | Implemented with MSW REST endpoints, browser persistence, TanStack Query mutations, and realistic asynchronous UI states |
| Likes | Mock API backed by browser persistence if the feature is added later |
| Analytics | Real analytics integration; do not invent live counters |

### Implemented Selected Work contract

- The home page replaces the reader-testimonial section with Selected Work for
  M-Movie, Fashion Archive, and SkyNature. Copy documents the actual frontend
  scope, decisions, and outcome of each project without fabricated clients or
  quantitative claims.
- `GET /api/case-studies` returns the three structured case resources through
  the same mock REST boundary used by the rest of the application. TanStack
  Query owns loading, empty, error, and retry states.
- The active case is stored in `?work=<slug>#work`, supports shared links and
  browser history, and safely falls back to the first case for an unknown slug.
- The case selector follows the tab interaction pattern: click or Arrow
  Left/Right, Home, and End update both selection and URL while maintaining
  keyboard focus and preventing an unwanted page reset.
- Every case routes `Build something together` to
  `?interest=focused-build#contact`, connecting portfolio evidence to the
  existing contact flow.

### Implemented case-study routes and discoverability

- `/work` presents all three projects as large responsive editorial cards,
  with code-native product previews, factual summaries, technology labels, and
  links to complete case studies.
- `/work/:slug` reuses `GET /api/case-studies` and expands each resource into
  challenge, delivered scope, frontend decisions, and outcome sections. No
  additional service or separately maintained duplicate dataset is required.
- Unknown case slugs remain at the requested URL and render a contextual,
  keyboard-focused 404 instead of silently redirecting. Unknown article and
  application routes follow the same behavior.
- Route-aware metadata owns title, description, canonical, Open Graph, Twitter,
  and robots values. Query strings and hashes are excluded from canonical URLs,
  and not-found routes use `noindex, nofollow`.
- The production build also emits route-specific static metadata shells for all
  known case studies and articles, plus `sitemap.xml`, `robots.txt`, and
  `404.html`. Social and non-JavaScript crawlers therefore receive the correct
  route metadata without adding server rendering or a backend.
- Work, case-study, insights, article, and category pages are route-split. The
  initial mock-worker startup and lazy-route transitions both expose immediate
  visual loading states.
- Header navigation, skip navigation, mobile-menu focus handling, Escape
  behavior, reduced-motion handling, and one-main/one-heading page structure are
  part of the implemented accessibility contract.
- Project layout, icons, and fonts are bundled locally; the production UI no
  longer depends on Bootstrap or Font Awesome CDNs.

### Implemented contributor directory contract

- The Team section is derived from the existing `GET /api/articles` response;
  it does not duplicate counts in component data or issue a second request.
- Active authors are grouped in catalogue order and joined to the canonical
  roles and focus areas in `data/authors.js`. A new article author therefore
  appears automatically, with an initials fallback when no portrait exists.
- The current catalogue resolves to five contributors and the exact published
  counts `3 / 4 / 2 / 2 / 1`, which sum to all 12 insights.
- Every contributor CTA opens `/blogs?q=<encoded author>` and the Insights page
  restores that URL-backed filter, its result count, and its clear-filter
  control.
- The section reuses the articles query loading, empty, error, and retry states.
  Its five-card mosaic has visible keyboard focus, 44px link targets, and
  responsive layouts without horizontal overflow from 320px upward.

### Implemented collaboration and contact flow

- The home page offers Product Audit, Focused Build, and Ongoing Product
  Support as believable agency engagements. It does not advertise paid
  memberships, accounts, or unsupported subscription features.
- Engagement CTAs use `?interest=<slug>#contact`. The contact select is derived
  from that URL, survives reload and browser history, and safely falls back to
  "Not sure yet" for unknown values.
- Changing the engagement keeps any name, email, and message already entered.
  CTA navigation moves keyboard focus to the selected field, while validation
  moves focus to the first invalid field.
- The mock contact endpoint validates the engagement against the shared data
  source. Browser persistence keeps only the request ID, timestamp, and
  engagement slug, not the submitted personal contact details.

### Implemented article content contract

- All 12 article detail routes receive topic-specific structured sections and
  author profiles from `GET /api/articles/:id`.
- The article body and table of contents are generated from the returned
  section data; reading time is derived from the words and content-block
  complexity in those sections.
- Article resources used by lists, categories, related/previous/next links, and
  bookmarks stay summary-only. Structured bodies and author profiles are
  included only in the detail response.

### Implemented bookmarks contract

- `GET /api/bookmarks` returns browser-local bookmarks joined with their article
  resources.
- `PUT /api/bookmarks/:articleId` is idempotent: it returns `201` for a new
  bookmark and `200` when that article was already saved.
- `DELETE /api/bookmarks/:articleId` removes the bookmark and returns the updated
  total. Bookmark mutations return `404` for an unknown article.
- Persistence uses `magency:v1:bookmarks` and stores only an array of
  `{ articleId, savedAt }` records. Article content is resolved from the content
  source instead of being duplicated in localStorage.
- TanStack Query provides a single shared bookmarks cache. Save and remove
  mutations cancel active reads, apply an optimistic cache update, roll back to
  the previous snapshot on failure, reconcile the response, serialize writes,
  globally lock concurrent controls, and invalidate once the write queue settles.
- Cross-tab bookmark storage changes invalidate the shared query, including
  explicit key removal or a full browser-storage clear.
- The blog exposes a saved-only filter and count, while article cards and detail
  pages use the same accessible bookmark toggle and cache state.
- Search, category, sort, page, and saved-only filters are URL-backed. Article
  links retain the originating Insights URL for a context-preserving return.

### Implemented comments and discussion contract

- `GET /api/articles/:articleId/comments` returns a newest-first combination of
  a curated recent seed and valid comments created in the current browser.
- `POST /api/articles/:articleId/comments` returns `201` and validates a
  trimmed display name from 2 to 50 characters and a trimmed body from 10 to
  1,000 characters. Malformed JSON returns `400`, invalid fields return `422`,
  unknown articles return `404`, and the per-article limit of 25 local comments
  returns `409`.
- `DELETE /api/articles/:articleId/comments/:commentId` removes only comments
  created in this browser. Seeded comments return `403`; unknown comments or
  articles return `404`.
- Persistence uses `magency:v1:comments` with the shape
  `{ version: 1, comments: [{ id, articleId, author, body, createdAt }] }`.
  Ownership is exposed by the API as `viewerOwned` instead of being trusted
  from stored data. Invalid, duplicate, or excess records are normalized away,
  with an in-memory fallback when localStorage is restricted.
- Each article's seeded `commentCount` is its historical baseline. The recent
  seed is a preview already represented by that number; only valid local
  comments are added to the effective total. Article lists, detail resources,
  navigation, related content, categories, bookmarks, and popular sorting all
  receive that effective count.
- TanStack Query keeps discussion and article caches synchronized, prevents
  conflicting writes, applies a reversible optimistic delete, and invalidates
  affected data after mutations or cross-tab storage changes.
- Comment writes are serialized across tabs with Web Locks when available;
  browsers without Web Locks retain per-tab Promise sequencing.
- The article page presents a responsive Recent discussion section with a
  labeled composer, character limits, loading skeletons, empty and retry states,
  status feedback, newest-first comments, a `You` badge, and delete controls
  only on browser-owned comments. The summary explicitly distinguishes the
  recent preview from the historical total.

### Implemented article helpfulness contract

- `GET /api/articles/:articleId/helpfulness` returns the current browser's
  `helpful`, `not-helpful`, or `null` response plus its update timestamp. It
  intentionally exposes no public vote count or percentage.
- `PUT /api/articles/:articleId/helpfulness` accepts one of the two response
  values. It returns `201` for the first selection and `200` for a repeat or a
  changed selection; an unchanged repeat is idempotent and preserves the
  existing timestamp. Malformed JSON returns `400`, an invalid response returns
  `422`, and an unknown article returns `404`.
- Persistence uses `magency:v1:article-helpfulness` with the shape
  `{ version: 1, articles: { [articleId]: { response, updatedAt } } }`. Invalid
  stored records are normalized away, and restricted localStorage falls back
  safely to memory.
- TanStack Query applies the selected response optimistically, rolls back on a
  failed request, reconciles the authoritative response, and serializes
  mutations per article. Web Locks serialize storage writes across tabs when
  available, with a Promise queue as the fallback.
- Storage changes in another tab invalidate the shared helpfulness cache. The
  article UI exposes accessible pressed states plus loading, saved, error, and
  retry feedback, while deliberately avoiding fabricated aggregate activity.

### Implemented reading progress behavior

- Persistence uses `magency:reading-progress:v1` with the shape
  `{ version: 1, articles: { [articleId]: { progress, updatedAt } } }`.
- Progress is normalized to an integer from 0 to 100 and can only increase.
  Article reading records it in 5% steps, measures only the article body, and
  promotes 95% or more to complete.
- The detail page restores a saved position through a resume action; article
  cards show started or completed progress without another network request.
  Resume also moves keyboard focus into the relevant article section and
  respects reduced-motion preferences.
- A small external-store layer provides immediate same-tab updates and merges
  cross-tab `storage` events without allowing older progress to overwrite newer
  progress.
- Invalid or unavailable localStorage falls back safely to in-memory state, so
  the feature remains usable in restricted browsers.

## Implementation decision rule

For each feature, choose the first sufficient option:

1. Real client-side behavior.
2. Mock REST API plus browser persistence.
3. A small Vercel Function when it avoids separate server infrastructure.
4. If the feature would require a full backend, database, authentication, or
   ongoing server maintenance, keep the realistic mock implementation.

## Security boundary

- Never place private keys or provider secrets in VITE-prefixed variables.
- VITE-prefixed values are public client-side configuration only.
- Validate and rate-limit public form endpoints.
- Keep development secrets in ignored local environment files and production
  secrets in Vercel environment variables.

## Portfolio quality bar

Every implemented feature should demonstrate at least one meaningful frontend
skill:

- accessible interaction and keyboard behavior;
- responsive layout without horizontal overflow;
- loading, success, empty, and error states;
- reusable components and clear data boundaries;
- performance-conscious assets and rendering;
- tests for important behavior;
- production build and deployment readiness.

## Non-goals unless explicitly added later

- Full custom backend infrastructure
- Authentication and account management
- Payments or real subscriptions
- Admin dashboard or CMS
- A separately deployed backend required only to support portfolio demo data
