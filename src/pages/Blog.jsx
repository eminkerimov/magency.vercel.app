import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { articleCategories, articles } from "../data/data";

const ITEMS_PER_PAGE = 8;

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const Blog = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const normalizedCategories = useMemo(() => {
    const categories = articleCategories.filter(
      (item) => item !== "All" && item !== "All categories"
    );

    return ["All categories", ...categories];
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...articles]
      .filter((article) => {
        const matchesCategory =
          category === "All categories" || article.category === category;

        const searchable = [
          article.title,
          article.excerpt,
          article.author,
          article.category,
          ...(Array.isArray(article.tags) ? article.tags : []),
        ]
          .join(" ")
          .toLowerCase();

        return matchesCategory && searchable.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortBy === "popular") {
          return b.commentCount - a.commentCount;
        }

        if (sortBy === "readingTime") {
          return a.readingTime - b.readingTime;
        }

        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }

        if (sortBy === "oldest") {
          return new Date(a.publishedAt) - new Date(b.publishedAt);
        }

        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });
  }, [category, query, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setPage(1);
  }, [query, category, sortBy]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleArticles = filteredArticles.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const firstVisibleIndex = filteredArticles.length
    ? (page - 1) * ITEMS_PER_PAGE + 1
    : 0;

  const lastVisibleIndex = Math.min(
    page * ITEMS_PER_PAGE,
    filteredArticles.length
  );

  const popularArticle = useMemo(
    () =>
      [...articles].sort(
        (a, b) => b.commentCount - a.commentCount
      )[0],
    []
  );

  const recentArticles = useMemo(
    () =>
      [...articles]
        .sort(
          (a, b) =>
            new Date(b.publishedAt) - new Date(a.publishedAt)
        )
        .slice(0, 4),
    []
  );

  const popularTags = useMemo(() => {
    const counter = {};

    articles.forEach((article) => {
      if (!Array.isArray(article.tags)) {
        return;
      }

      article.tags.forEach((tag) => {
        counter[tag] = (counter[tag] || 0) + 1;
      });
    });

    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, []);

  const getCategoryCount = (item) => {
    if (item === "All categories") {
      return articles.length;
    }

    return articles.filter(
      (article) => article.category === item
    ).length;
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("All categories");
    setSortBy("newest");
  };

  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubscribed(true);
    setEmail("");
  };

  return (
    <main className="articles-page">
      <section className="articles-hero">
        <div className="container">
          <div className="articles-hero__content">
            <span>Engineering knowledge</span>
            <h1>Articles</h1>
            <p>
              Production-focused guides for frontend, backend, cloud,
              databases, testing, and engineering leadership.
            </p>
          </div>
        </div>
      </section>

      <section className="articles-content">
        <div className="container">
          <div className="articles-toolbar">
            <label className="articles-toolbar__search">
              <span className="sr-only">Search articles</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, author, or topic"
              />
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
            >
              {normalizedCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort articles"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="popular">Most discussed</option>
              <option value="readingTime">Shortest read</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>

          <div className="articles-layout">
            <div className="articles-main">
              <div className="articles-results">
                <span>
                  Showing {firstVisibleIndex}–{lastVisibleIndex} of{" "}
                  {filteredArticles.length} articles
                </span>

                {(query ||
                  category !== "All categories" ||
                  sortBy !== "newest") && (
                  <button type="button" onClick={resetFilters}>
                    Clear filters
                  </button>
                )}
              </div>

              {visibleArticles.length ? (
                <div className="articles-grid">
                  {visibleArticles.map((article) => (
                    <article className="articles-card" key={article.id}>
                      <Link
                        className="articles-card__image"
                        to={`/blog/${article.id}`}
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                        />
                        <span>{article.category}</span>
                      </Link>

                      <div className="articles-card__body">
                        <div className="articles-card__meta">
                          <time dateTime={article.publishedAt}>
                            {formatDate(article.publishedAt)}
                          </time>
                          <span>{article.readingTime} min read</span>
                        </div>

                        <h2>
                          <Link to={`/blog/${article.id}`}>
                            {article.title}
                          </Link>
                        </h2>

                        <p>{article.excerpt}</p>

                        <div className="articles-card__footer">
                          <div>
                            <strong>{article.author}</strong>
                            <span>
                              {article.commentCount} comments
                            </span>
                          </div>

                          <Link to={`/blog/${article.id}`}>
                            Read article →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="articles-empty">
                  <h2>No articles found</h2>
                  <p>
                    Change the search query or selected category.
                  </p>
                  <button type="button" onClick={resetFilters}>
                    Reset filters
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <nav
                  className="articles-pagination"
                  aria-label="Pagination"
                >
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage((current) => current - 1)
                    }
                  >
                    ← Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={page === item ? "active" : ""}
                      onClick={() => setPage(item)}
                      aria-current={page === item ? "page" : undefined}
                    >
                      {item}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((current) => current + 1)
                    }
                  >
                    Next →
                  </button>
                </nav>
              )}
            </div>

            <aside className="articles-sidebar">
              <div className="articles-sidebar__block articles-newsletter">
                <span>Weekly digest</span>
                <h2>Useful engineering, without noise.</h2>
                <p>One practical article every week.</p>

                <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Email address"
                    required
                  />
                  <button type="submit">Subscribe</button>
                </form>

                {subscribed && (
                  <small>Subscription confirmed.</small>
                )}
              </div>

              <div className="articles-sidebar__block">
                <h2>Categories</h2>

                <div className="articles-category-list">
                  {normalizedCategories.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={category === item ? "active" : ""}
                      onClick={() => setCategory(item)}
                    >
                      <span>{item}</span>
                      <strong>{getCategoryCount(item)}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div className="articles-sidebar__block articles-popular">
                <span>Most discussed</span>

                <Link to={`/blog/${popularArticle.id}`}>
                  <img
                    src={popularArticle.image}
                    alt={popularArticle.title}
                    loading="lazy"
                  />
                  <h2>{popularArticle.title}</h2>
                </Link>

                <p>{popularArticle.commentCount} comments</p>
              </div>

              <div className="articles-sidebar__block articles-recent">
                <h2>Recent articles</h2>

                <div className="articles-recent__list">
                  {recentArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/blog/${article.id}`}
                    >
                      <span>{formatDate(article.publishedAt)}</span>
                      <strong>{article.title}</strong>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="articles-sidebar__block articles-tags">
                <h2>Popular tags</h2>

                <div className="articles-tags__list">
                  {popularTags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        setCategory("All categories");
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
