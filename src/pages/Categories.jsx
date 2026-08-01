import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { articles } from "../data/data";

const categoryMeta = {
  Frontend: {
    icon: "</>",
    eyebrow: "Interfaces",
    color: "violet",
    description:
      "React architecture, state management, performance, accessibility, and scalable interface systems.",
    stack: ["React", "TypeScript", "Web APIs"],
  },
  Backend: {
    icon: "{ }",
    eyebrow: "Systems",
    color: "blue",
    description:
      "Node.js services, APIs, background jobs, validation, reliability, and production architecture.",
    stack: ["Node.js", "APIs", "Queues"],
  },
  "DevOps & Cloud": {
    icon: "↗",
    eyebrow: "Delivery",
    color: "cyan",
    description:
      "Delivery pipelines, containers, observability, cloud infrastructure, and release engineering.",
    stack: ["CI/CD", "Cloud", "Observability"],
  },
  Databases: {
    icon: "DB",
    eyebrow: "Data",
    color: "orange",
    description:
      "PostgreSQL, query performance, migrations, indexing, and production data systems.",
    stack: ["PostgreSQL", "SQL", "Migrations"],
  },
  Testing: {
    icon: "✓",
    eyebrow: "Quality",
    color: "green",
    description:
      "Practical testing strategies, resilient test suites, release confidence, and quality workflows.",
    stack: ["Testing", "RSC", "Release safety"],
  },
  "Engineering Career": {
    icon: "01",
    eyebrow: "Leadership",
    color: "pink",
    description:
      "Technical leadership, incident reviews, communication, career growth, and team effectiveness.",
    stack: ["Leadership", "Culture", "Communication"],
  },
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const Categories = () => {
  const categories = useMemo(() => {
    const grouped = articles.reduce((acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = [];
      }

      acc[article.category].push(article);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, categoryArticles]) => {
      const sortedArticles = [...categoryArticles].sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );

      return {
        name,
        count: categoryArticles.length,
        latestArticle: sortedArticles[0],
        totalReadingTime: categoryArticles.reduce(
          (sum, article) => sum + article.readingTime,
          0
        ),
        ...categoryMeta[name],
      };
    });
  }, []);

  const featuredCategories = [...categories]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <main className="categories-page">
      <section className="categories-hero">
        <div className="container">
          <div className="categories-hero__content">
            <span className="categories-kicker">Engineering topics</span>

            <h1>Categories</h1>

            <p>
              Production-focused collections for frontend, backend, cloud,
              databases, testing, and engineering leadership.
            </p>

            <div className="categories-hero__actions">
              <a href="#category-grid">Browse categories</a>
              <Link to="/blogs">View all articles</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-tracks" id="category-grid">
        <div className="container">
          <div className="categories-section-heading">
            <div>
              <span>Knowledge tracks</span>
              <h2>One clear path for every engineering discipline</h2>
            </div>

            <p>
              Each track groups related production topics, recent writing, and
              the tools engineers use in real systems.
            </p>
          </div>

          <div className="categories-grid">
            {categories.map((category, index) => (
              <article
                className={`category-track category-track--${category.color}`}
                key={category.name}
              >
                <div className="category-track__header">
                  <span className="category-track__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="category-track__count">
                    {category.count}{" "}
                    {category.count === 1 ? "article" : "articles"}
                  </span>
                </div>

                <div className="category-track__icon">{category.icon}</div>

                <span className="category-track__eyebrow">
                  {category.eyebrow}
                </span>

                <h3>{category.name}</h3>
                <p>{category.description}</p>

                <div className="category-track__stack">
                  {category.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="category-track__footer">
                  <div>
                    <span>Latest article</span>
                    <strong>{category.latestArticle.title}</strong>
                  </div>

                  <Link
                    to={`/blogs?category=${encodeURIComponent(category.name)}`}
                    aria-label={`Explore ${category.name} articles`}
                  >
                    ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-featured">
        <div className="container">
          <div className="categories-featured__heading">
            <div>
              <span>Start here</span>
              <h2>Most active collections</h2>
            </div>

            <Link to="/blogs">Browse every article →</Link>
          </div>

          <div className="categories-featured__grid">
            {featuredCategories.map((category, index) => (
              <article
                className={`categories-feature categories-feature--${index + 1}`}
                key={category.name}
              >
                <Link
                  className="categories-feature__image"
                  to={`/blog/${category.latestArticle.id}`}
                >
                  <img
                    src={category.latestArticle.image}
                    alt={category.latestArticle.title}
                    loading="lazy"
                  />
                </Link>

                <div className="categories-feature__content">
                  <div className="categories-feature__meta">
                    <span>{category.name}</span>
                    <time dateTime={category.latestArticle.publishedAt}>
                      {formatDate(category.latestArticle.publishedAt)}
                    </time>
                  </div>

                  <h3>
                    <Link to={`/blog/${category.latestArticle.id}`}>
                      {category.latestArticle.title}
                    </Link>
                  </h3>

                  <p>{category.latestArticle.excerpt}</p>

                  <div className="categories-feature__footer">
                    <span>{category.totalReadingTime} min in collection</span>

                    <Link
                      to={`/blogs?category=${encodeURIComponent(category.name)}`}
                    >
                      Explore collection →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-cta">
        <div className="container">
          <div className="categories-cta__panel">
            <div>
              <span>Not sure where to begin?</span>
              <h2>Start with the latest production lessons.</h2>
            </div>

            <Link to="/blogs">Open all articles →</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Categories;
