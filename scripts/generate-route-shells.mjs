import { dirname, join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";

import { caseStudies } from "../src/data/caseStudies.js";
import { articles } from "../src/data/data.js";

const outputDirectory = join(process.cwd(), "dist");
const templatePath = join(outputDirectory, "index.html");
const newline = String.fromCharCode(10);
const siteUrl = String(
  process.env.VITE_SITE_URL || "https://magency.vercel.app"
).replace(/\/+$/, "");

const homeMetadata = {
  path: "/",
  title: "M-Agency - Frontend Engineering Portfolio",
  description:
    "Senior frontend engineering portfolio featuring product work, modern interface systems, and practical engineering insights.",
};

const routes = [
  homeMetadata,
  {
    path: "/work",
    title: "Frontend Case Studies | M-Agency",
    description:
      "Explore three frontend portfolio case studies spanning media discovery, editorial archives, and nature-stay booking experiences.",
  },
  {
    path: "/start-project",
    title: "Start a Project | M-Agency",
    description:
      "Build a focused project brief for a frontend product audit, delivery milestone, or ongoing product support engagement.",
  },
  {
    path: "/blogs",
    title: "Engineering Insights | M-Agency",
    description:
      "Practical articles on frontend, backend, cloud, databases, testing, and technical leadership.",
  },
  {
    path: "/categories",
    title: "Engineering Topics | M-Agency",
    description:
      "Browse M-Agency engineering insights by frontend, backend, cloud, databases, testing, and leadership topics.",
  },
  ...caseStudies.map((study) => ({
    path: "/work/" + study.slug,
    title: study.name + " - " + study.title + " | M-Agency",
    description: study.summary,
  })),
  ...articles.map((article) => ({
    path: "/blog/" + article.id,
    title: article.title + " | M-Agency",
    description: article.excerpt,
    image: article.image,
    type: "article",
    lastmod: article.publishedAt,
  })),
];

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#39;");

const replaceHeadElement = (html, marker, startTag, replacement) => {
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error("Missing head marker: " + marker);
  }

  const start = html.lastIndexOf(startTag, markerIndex);
  const end = html.indexOf(">", markerIndex);
  if (start === -1 || end === -1) {
    throw new Error("Invalid head element for marker: " + marker);
  }

  return html.slice(0, start) + replacement + html.slice(end + 1);
};

const replaceMeta = (html, attribute, key, value) =>
  replaceHeadElement(
    html,
    attribute + '="' + key + '"',
    "<meta",
    '<meta ' +
      attribute +
      '="' +
      escapeHtml(key) +
      '" content="' +
      escapeHtml(value) +
      '" />'
  );

const replaceTitle = (html, title) => {
  const start = html.indexOf("<title>");
  const end = html.indexOf("</title>", start);
  if (start === -1 || end === -1) {
    throw new Error("Missing title element");
  }

  return (
    html.slice(0, start) +
    "<title>" +
    escapeHtml(title) +
    "</title>" +
    html.slice(end + "</title>".length)
  );
};

const canonicalFor = (path) => new URL(path, siteUrl + "/").href;

const renderShell = (template, metadata) => {
  const canonical = canonicalFor(metadata.path);
  const type = metadata.type || "website";
  let html = replaceTitle(template, metadata.title);

  html = replaceMeta(html, "name", "description", metadata.description);
  html = replaceMeta(
    html,
    "name",
    "robots",
    metadata.robots || "index, follow"
  );
  html = replaceMeta(html, "property", "og:type", type);
  html = replaceMeta(html, "property", "og:title", metadata.title);
  html = replaceMeta(
    html,
    "property",
    "og:description",
    metadata.description
  );
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(
    html,
    "name",
    "twitter:card",
    metadata.image ? "summary_large_image" : "summary"
  );
  html = replaceMeta(html, "name", "twitter:title", metadata.title);
  html = replaceMeta(
    html,
    "name",
    "twitter:description",
    metadata.description
  );
  html = replaceHeadElement(
    html,
    'rel="canonical"',
    "<link",
    '<link rel="canonical" href="' + escapeHtml(canonical) + '" />'
  );

  if (metadata.image) {
    const image = new URL(metadata.image, siteUrl + "/").href;
    const imageMarkup = [
      '<meta property="og:image" content="' + escapeHtml(image) + '" />',
      '<meta name="twitter:image" content="' + escapeHtml(image) + '" />',
    ].join(newline + "    ");

    html = html.replace(
      "</head>",
      "    " + imageMarkup + newline + "  </head>"
    );
  }

  return html;
};

const template = await readFile(templatePath, "utf8");

for (const route of routes) {
  const segments = route.path.split("/").filter(Boolean);
  const outputPath =
    route.path === "/"
      ? templatePath
      : join(outputDirectory, ...segments, "index.html");

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderShell(template, route), "utf8");
}

const notFoundMetadata = {
  path: "/404",
  title: "Page not found | M-Agency",
  description: "The requested M-Agency portfolio page could not be found.",
  robots: "noindex, nofollow",
};

await writeFile(
  join(outputDirectory, "404.html"),
  renderShell(template, notFoundMetadata),
  "utf8"
);

const sitemapEntries = routes.map((route) => {
  const lines = [
    "  <url>",
    "    <loc>" + escapeHtml(canonicalFor(route.path)) + "</loc>",
  ];

  if (route.lastmod) {
    lines.push("    <lastmod>" + escapeHtml(route.lastmod) + "</lastmod>");
  }

  lines.push("  </url>");
  return lines.join(newline);
});

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries,
  "</urlset>",
  "",
].join(newline);

await writeFile(join(outputDirectory, "sitemap.xml"), sitemap, "utf8");
await writeFile(
  join(outputDirectory, "robots.txt"),
  [
    "User-agent: *",
    "Allow: /",
    "Sitemap: " + canonicalFor("/sitemap.xml"),
    "",
  ].join(newline),
  "utf8"
);

console.log(
  "Generated " +
    routes.length +
    " route metadata shells, sitemap.xml, robots.txt, and 404.html."
);
