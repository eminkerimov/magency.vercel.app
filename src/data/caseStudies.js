export const caseStudies = [
  {
    slug: "m-movie",
    index: "01",
    name: "M-Movie",
    type: "Independent media product",
    title: "A cinematic way to discover what to watch",
    summary:
      "A movie and TV discovery interface that turns TMDB data into browsing, search, title details, and a personal viewing library.",
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
    index: "02",
    name: "Fashion Archive",
    type: "Independent editorial project",
    title: "Fashion history as an explorable digital archive",
    summary:
      "An editorial fashion museum experience connecting a chronology with designers, landmark collections, objects, and exhibitions.",
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
    index: "03",
    name: "SkyNature",
    type: "Independent booking concept",
    title: "A calmer path to a nature stay",
    summary:
      "A responsive nature-stay discovery and booking concept built around a local catalogue of fictional cabins, eco homes, and retreats.",
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
