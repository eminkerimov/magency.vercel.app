export const caseStudies = [
  {
    slug: "m-movie",
    name: "M-Movie",
    type: "Independent media product",
    title: "A cinematic way to discover what to watch",
    summary:
      "A movie and TV discovery interface that turns TMDB data into browsing, search, title details, and a personal viewing library.",
    facts: [
      {
        label: "Ownership",
        value: "Product direction / UX / frontend",
      },
      {
        label: "Product state",
        value: "Independent frontend build",
      },
      {
        label: "Data strategy",
        value: "TMDB API + browser-local library",
      },
      {
        label: "Core constraint",
        value: "A large, changing catalogue",
      },
    ],
    sectionTitles: {
      challenge: "Turning catalogue volume into confident choices.",
      delivered: "Discovery, detail, and personal tracking in one flow.",
      decisions: "State separated by responsibility.",
    },
    evidence: [
      {
        key: "flow",
        label: "Product flow",
        title: "A title can move from discovery to a decision without losing context.",
        summary:
          "The interface connects broad catalogue exploration with focused title details and a personal viewing loop.",
        points: [
          "Search, genre, release, and ranking views lead into one consistent title-detail route.",
          "Credits, reviews, availability, media, and related titles keep deeper exploration in the same mental model.",
          "Watchlist, watched state, notes, ratings, and episode progress turn browsing into an ongoing library.",
        ],
      },
      {
        key: "state",
        label: "State & data",
        title: "Remote catalogue data and private viewing state stay separate.",
        summary:
          "Each kind of state lives where it is easiest to reason about, share, and persist.",
        points: [
          "TMDB-backed queries own changing public catalogue content and its request states.",
          "Search and discovery controls live in the URL so filtered views survive refresh and browser navigation.",
          "Personal lists, notes, ratings, and progress persist only in the current browser.",
        ],
      },
      {
        key: "resilience",
        label: "Resilience",
        title: "Asynchronous screens remain understandable when data changes or fails.",
        summary:
          "The catalogue is treated as a networked product, not as a static grid of ideal responses.",
        points: [
          "Lazy route boundaries keep the initial experience focused while deeper screens load on demand.",
          "Loading, empty, and retryable error states protect discovery and detail paths.",
          "Catalogue, detail, and personal-library concerns are isolated so each path can recover independently.",
        ],
      },
      {
        key: "accessibility",
        label: "Accessibility",
        title: "Core discovery does not depend on pointer precision or decorative motion.",
        summary:
          "Native interaction patterns keep a dense media interface predictable across input methods.",
        points: [
          "Filters and library actions use labelled controls with visible keyboard focus.",
          "Landmarks and heading order keep long title-detail screens navigable.",
          "Motion adds orientation while search, saving, and progress flows remain fully usable without it.",
        ],
      },
    ],
    challenge:
      "Bring a large, changing catalogue into a coherent experience while keeping discovery, release planning, and personal viewing progress easy to navigate.",
    delivered: [
      "Trending, popular, top-rated, and upcoming discovery views with search and detailed filters.",
      "Movie and series pages with credits, reviews, media, availability, related titles, and release information.",
      "A browser-local watchlist, watched list, personal notes and ratings, and episode progress.",
    ],
    decisions: [
      "Used TMDB endpoints for catalogue, detail, and image data, with URL-backed search and discovery filters.",
      "Split routes into lazy-loaded pages and added skeleton and error states for asynchronous content.",
      "Stored library and episode progress locally so personal state persists across visits in the same browser.",
    ],
    stack: ["React", "React Router", "Axios", "Sass", "TMDB API"],
    outcome:
      "A responsive media discovery and tracking interface with connected paths from browsing to title details and personal lists.",
    visual: "cinema",
    engagement: "focused-build",
  },
  {
    slug: "fashion-archive",
    name: "Fashion Archive",
    type: "Independent editorial project",
    title: "Fashion history as an explorable digital archive",
    summary:
      "An editorial fashion museum experience connecting a chronology with designers, landmark collections, objects, and exhibitions.",
    facts: [
      {
        label: "Ownership",
        value: "Research direction / UX / frontend",
      },
      {
        label: "Product state",
        value: "Independent editorial build",
      },
      {
        label: "Data strategy",
        value: "Structured local archive records",
      },
      {
        label: "Core constraint",
        value: "Mixed historical record types",
      },
    ],
    sectionTitles: {
      challenge: "Connecting history without flattening the story.",
      delivered: "Chronology, records, and archive-wide search.",
      decisions: "Structure first, animation second.",
    },
    evidence: [
      {
        key: "flow",
        label: "Product flow",
        title: "Every archive path leads back to a wider historical context.",
        summary:
          "Visitors can enter through time, a creator, a collection, an object, or an exhibition without reaching an isolated record.",
        points: [
          "The chronology connects landmark moments directly to deeper archive records.",
          "Designer, collection, object, and exhibition pages share clear cross-links and source context.",
          "Archive-wide search lets one query travel across otherwise different record types.",
        ],
      },
      {
        key: "state",
        label: "State & data",
        title: "A shared record model keeps unlike content consistently explorable.",
        summary:
          "The archive uses structured local content as a small editorial system rather than hard-coding every screen.",
        points: [
          "Common record fields power repeatable cards, search results, and detail-page metadata.",
          "Type-specific fields preserve the detail needed for designers, collections, objects, and exhibitions.",
          "Stable links connect timeline entries, search results, and detail routes without a live CMS.",
        ],
      },
      {
        key: "resilience",
        label: "Resilience",
        title: "The experience stays coherent as content types diverge.",
        summary:
          "Shared presentation rules reduce duplication while keeping specialist records distinct.",
        points: [
          "Reusable browse and detail patterns prevent each archive category from becoming a separate mini-site.",
          "Lazy-loaded routes keep the editorial landing page independent from deeper records.",
          "Local structured content makes the portfolio build self-contained and repeatable.",
        ],
      },
      {
        key: "accessibility",
        label: "Accessibility",
        title: "Search and chronology remain useful without scroll choreography.",
        summary:
          "The visual narrative is layered on top of conventional navigation and predictable focus behavior.",
        points: [
          "The archive search opens as a labelled dialog and returns focus to its trigger when closed.",
          "Timeline destinations remain reachable through links rather than scroll position alone.",
          "Source references use normal links so research context stays keyboard and screen-reader accessible.",
        ],
      },
    ],
    challenge:
      "Give different kinds of fashion history records a shared structure while making room for visual storytelling and source context.",
    delivered: [
      "An editorial home page and interactive fashion history timeline.",
      "Browsable designer, collection, object, and exhibition sections with dedicated detail pages.",
      "Archive search across record types, with interpretive imagery and links to museum sources.",
    ],
    decisions: [
      "Modeled archive records as local structured data for consistent cards, search, and detail views.",
      "Made the timeline respond to scroll position and linked its entries to source material.",
      "Lazy-loaded routes and used an accessible search dialog with focus handling.",
    ],
    stack: ["React", "React Router", "Sass", "Create React App"],
    outcome:
      "A navigable editorial archive that joins chronology, collection browsing, and cross-category search in one interface.",
    visual: "archive",
    engagement: "focused-build",
  },
  {
    slug: "skynature",
    name: "SkyNature",
    type: "Independent booking concept",
    title: "A calmer path to a nature stay",
    summary:
      "A responsive nature-stay discovery and booking concept built around a local catalogue of fictional cabins, eco homes, and retreats.",
    facts: [
      {
        label: "Ownership",
        value: "Product direction / UX / frontend",
      },
      {
        label: "Product state",
        value: "Independent booking concept",
      },
      {
        label: "Data strategy",
        value: "Typed catalogue + browser state",
      },
      {
        label: "Core constraint",
        value: "No backend or payment flow",
      },
    ],
    sectionTitles: {
      challenge: "Removing friction from inspiration to booking intent.",
      delivered: "Search, stay detail, and a validated request flow.",
      decisions: "Shareable state where it matters, local state where it fits.",
    },
    evidence: [
      {
        key: "flow",
        label: "Product flow",
        title: "The path from browsing to a booking request stays continuous.",
        summary:
          "Each stage answers the next practical question without pretending the concept completes a real transaction.",
        points: [
          "Search, filters, sorting, and pagination narrow the catalogue without hiding the active criteria.",
          "Stay pages join imagery, amenities, reviews, related options, and a clear booking entry point.",
          "The request modal keeps dates, guests, and the live cost summary in one focused task.",
        ],
      },
      {
        key: "state",
        label: "State & data",
        title: "Shareable discovery state is separated from private browser state.",
        summary:
          "The interface uses different persistence strategies for catalogue exploration, saved stays, and temporary form input.",
        points: [
          "Filters, sort order, and pagination live in the URL for refresh, sharing, and browser navigation.",
          "The typed local catalogue gives cards, detail routes, and related stays one dependable source.",
          "Saved stays persist in the browser without implying an account or remote profile.",
        ],
      },
      {
        key: "resilience",
        label: "Resilience",
        title: "The request flow is complete even though the concept has no backend.",
        summary:
          "Validation and feedback make the demo useful while its boundary stays explicit.",
        points: [
          "Date and guest inputs are validated before a request can finish.",
          "The cost summary is derived from current selections so feedback stays immediate and consistent.",
          "Completion remains browser-local and never claims that availability, payment, or a reservation was confirmed.",
        ],
      },
      {
        key: "accessibility",
        label: "Accessibility",
        title: "Dialog behavior is treated as part of the booking feature.",
        summary:
          "Filters and booking controls are designed for predictable keyboard and assistive-technology use.",
        points: [
          "Filter and booking dialogs move focus inside, contain it while open, and return it when closed.",
          "Inputs use visible labels with field-level validation messages.",
          "Saved and selected states use text and control semantics rather than color alone.",
        ],
      },
    ],
    challenge:
      "Connect inspiration, practical filtering, stay details, and a booking request flow within a clear client-side experience.",
    delivered: [
      "An editorial landing page and searchable stay catalogue with filters, sorting, and pagination.",
      "Stay detail pages with galleries, amenities, reviews, related stays, and booking summaries.",
      "A validated booking modal with live cost calculation and a browser-local saved-stays list.",
    ],
    decisions: [
      "Kept filter and page state in the URL so views support browser navigation and sharing.",
      "Used typed local data and local imagery to make the concept self-contained.",
      "Built keyboard-accessible filter and booking dialogs with focus management and clear feedback states.",
    ],
    stack: ["React", "TypeScript", "Vite", "React Router", "SCSS Modules"],
    outcome:
      "A complete client-side discovery and booking-request demo; requests finish locally without a backend or payment.",
    visual: "stays",
    engagement: "focused-build",
  },
];
