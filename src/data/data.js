export const articles = [
  {
    id: 1,
    publishedAt: "2026-06-06",
    title: "State Management Boundaries in Large React Applications",
    excerpt:
      "Separate server state, URL state, form state, and local UI state before selecting another global store.",
    author: "Adrian Thomas",
    category: "Frontend",
    tags: ["React", "State Management", "Architecture"],
    readingTime: 11,
    commentCount: 35,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=85",
  },
  {
    id: 2,
    publishedAt: "2026-05-30",
    title: "Reliable Background Jobs in Node.js",
    excerpt:
      "Design retries, dead-letter queues, idempotency, and observability for production workers.",
    author: "Narate Ketram",
    category: "Backend",
    tags: ["Node.js", "Queues", "Reliability"],
    readingTime: 12,
    commentCount: 27,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=85",
  },
  {
    id: 3,
    publishedAt: "2026-05-23",
    title: "A Practical Guide to Frontend Performance Budgets",
    excerpt:
      "Define measurable budgets for JavaScript, rendering, images, and interaction latency.",
    author: "Adrian Thomas",
    category: "Frontend",
    tags: ["Performance", "Core Web Vitals", "Frontend"],
    readingTime: 9,
    commentCount: 41,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=85",
  },
  {
    id: 4,
    publishedAt: "2026-05-16",
    title: "Container Observability Beyond CPU and Memory",
    excerpt:
      "Connect logs, traces, metrics, deployment metadata, and service maps into one monitoring strategy.",
    author: "Fernando Comet",
    category: "DevOps & Cloud",
    tags: ["Observability", "Containers", "Cloud"],
    readingTime: 10,
    commentCount: 19,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=85",
  },
  {
    id: 5,
    publishedAt: "2026-05-09",
    title: "Testing React Server Components Without Brittle Mocks",
    excerpt:
      "Test behavior at useful boundaries while keeping implementation details free to change.",
    author: "Adrian Thomas",
    category: "Testing",
    tags: ["React", "Testing", "Server Components"],
    readingTime: 6,
    commentCount: 22,
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=85",
  },
  {
    id: 6,
    publishedAt: "2026-05-02",
    title: "Writing Incident Reviews That Improve Engineering Systems",
    excerpt:
      "Turn production failures into long-term engineering improvements without assigning blame.",
    author: "Adedayo Saheed",
    category: "Engineering Career",
    tags: ["Leadership", "Incidents", "Engineering Culture"],
    readingTime: 8,
    commentCount: 29,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85",
  },
  {
    id: 7,
    publishedAt: "2026-04-25",
    title: "Designing Type-Safe APIs with Node.js and TypeScript",
    excerpt:
      "Keep validation, domain models, database access, and response contracts aligned.",
    author: "Narate Ketram",
    category: "Backend",
    tags: ["Node.js", "TypeScript", "APIs"],
    readingTime: 9,
    commentCount: 24,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=85",
  },
  {
    id: 8,
    publishedAt: "2026-04-18",
    title: "Practical CI/CD for Small Engineering Teams",
    excerpt:
      "Build a deployment pipeline that stays fast, understandable, and safe as your team grows.",
    author: "Fernando Comet",
    category: "DevOps & Cloud",
    tags: ["CI/CD", "Automation", "Delivery"],
    readingTime: 7,
    commentCount: 31,
    image:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&q=85",
  },
  {
    id: 9,
    publishedAt: "2026-04-11",
    title: "PostgreSQL Query Tuning: A Production Checklist",
    excerpt:
      "Use execution plans, statistics, indexes, and traces to diagnose slow database queries.",
    author: "Narate Ketram",
    category: "Databases",
    tags: ["PostgreSQL", "SQL", "Performance"],
    readingTime: 10,
    commentCount: 16,
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=85",
  },
  {
    id: 10,
    publishedAt: "2026-04-04",
    title: "Database Migrations Without Deployment Downtime",
    excerpt:
      "Use expand-and-contract changes and compatibility windows for safer production migrations.",
    author: "Narate Ketram",
    category: "Databases",
    tags: ["Migrations", "PostgreSQL", "Deployment"],
    readingTime: 13,
    commentCount: 33,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85",
  },
  {
    id: 11,
    publishedAt: "2026-03-28",
    title: "Modern CSS Architecture Without Utility Overload",
    excerpt:
      "Build maintainable styles with design tokens, layers, components, and clear ownership.",
    author: "Maya Chen",
    category: "Frontend",
    tags: ["CSS", "Design Systems", "Architecture"],
    readingTime: 8,
    commentCount: 33,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85",
  },
  {
    id: 12,
    publishedAt: "2026-03-21",
    title: "Growing from Senior Engineer to Technical Lead",
    excerpt:
      "Shift from solving isolated tasks to improving decisions, alignment, and engineering leverage.",
    author: "Adedayo Saheed",
    category: "Engineering Career",
    tags: ["Leadership", "Career", "Communication"],
    readingTime: 8,
    commentCount: 38,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=85",
  },
];

export const articleCategories = [
  "All categories",
  ...Array.from(new Set(articles.map((article) => article.category))),
];