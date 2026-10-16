import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { subscribeToNewsletter } from "../api/forms";
import ContentState from "../components/ContentState";
import ReadingProgress from "../components/ReadingProgress";
import Seo from "../components/Seo";
import { useArticlesQuery } from "../features/articles/queries";
import BookmarkToggle from "../features/bookmarks/BookmarkToggle";
import { useBookmarksQuery } from "../features/bookmarks/queries";
import { useReadingProgressSummaries } from "../features/readingProgress";

const ITEMS_PER_PAGE = 8;
const ALL_CATEGORIES = "All categories";
const SORT_OPTIONS = ["newest", "oldest", "popular", "readingTime", "title"];
const EMPTY_ARTICLES = [];

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const Blog = () => {
  const {
    data: articlesData,
    error: articlesError,
    isError: isArticlesError,
    isPending: isArticlesPending,
    refetch: refetchArticles,
  } = useArticlesQuery();
  const {
    data: bookmarks = [],
    error: bookmarksError,
    isError: isBookmarksError,
    isPending: isBookmarksPending,
    refetch: refetchBookmarks,
  } = useBookmarksQuery();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || ALL_CATEGORIES;
  const requestedSort = searchParams.get("sort");
  const sortBy = SORT_OPTIONS.includes(requestedSort)
    ? requestedSort
    : "newest";
  const requestedPage = Number(searchParams.get("page"));
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const savedOnly = searchParams.get("saved") === "1";
  const [email, setEmail] = useState("");
  const [libraryAnnouncement, setLibraryAnnouncement] = useState("");
  const [subscriptionState, setSubscriptionState] = useState({
    status: "idle",
    message: "",
  });
  const removalFocusRef = useRef(null);
  const resultsRef = useRef(null);
  const articles = Array.isArray(articlesData)
    ? articlesData
    : EMPTY_ARTICLES;
  const bookmarkedArticleIds = useMemo(
    () => new Set(bookmarks.map((bookmark) => bookmark.articleId)),
    [bookmarks]
  );
  const articleIds = useMemo(
    () => articles.map((article) => article.id),
    [articles]
  );
  const progressByArticleId = useReadingProgressSummaries(articleIds);
  const isSavedViewPending = savedOnly && isBookmarksPending;
  const isSavedViewError = savedOnly && isBookmarksError;
  const normalizedCategories = useMemo(
    () => [
      ALL_CATEGORIES,
      ...new Set(
        articles
          .map((article) => article.category)
          .filter((item) => typeof item === "string" && item.trim())
      ),
    ],
    [articles]
  );
  const activeCategory = normalizedCategories.includes(category)
    ? category
    : ALL_CATEGORIES;
  const articleLinkState = {
    from: location.pathname + location.search,
  };

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  };

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...articles]
      .filter((article) => {
        const matchesCategory =
          activeCategory === ALL_CATEGORIES ||
          article.category === activeCategory;
        const matchesSaved =
          !savedOnly || bookmarkedArticleIds.has(article.id);

        const searchable = [
          article.title,
          article.excerpt,
          article.author,
          article.category,
          ...(Array.isArray(article.tags) ? article.tags : []),
        ]
          .join(" ")
          .toLowerCase();

        return (
          matchesCategory &&
          matchesSaved &&
          searchable.includes(normalizedQuery)
        );
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
  }, [
    activeCategory,
    articles,
    bookmarkedArticleIds,
    query,
    savedOnly,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  );
  const currentPage = Math.min(page, totalPages);

  const visibleArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const firstVisibleIndex = filteredArticles.length
    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
    : 0;

  const lastVisibleIndex = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredArticles.length
  );

  const handleSavedBookmarkRemoval = (article) => {
    if (!savedOnly) return;

    removalFocusRef.current = {
      index: visibleArticles.findIndex((item) => item.id === article.id),
      title: article.title,
    };
  };

  useEffect(() => {
    const pendingRemoval = removalFocusRef.current;

    if (!pendingRemoval || !savedOnly) return;

    removalFocusRef.current = null;
    window.requestAnimationFrame(() => {
      const bookmarkButtons = [
        ...document.querySelectorAll(
          ".articles-card .bookmark-button"
        ),
      ];
      const nextIndex = Math.min(
        Math.max(pendingRemoval.index, 0),
        Math.max(bookmarkButtons.length - 1, 0)
      );
      const nextTarget = bookmarkButtons[nextIndex] || resultsRef.current;

      nextTarget?.focus();
      setLibraryAnnouncement(
        `Removed ${pendingRemoval.title} from saved articles. ${filteredArticles.length} saved article${filteredArticles.length === 1 ? "" : "s"} remaining.`
      );
    });
  }, [filteredArticles.length, savedOnly, visibleArticles]);

  const popularArticle = useMemo(
    () =>
      [...articles].sort(
        (a, b) => b.commentCount - a.commentCount
      )[0],
    [articles]
  );

  const recentArticles = useMemo(
    () =>
      [...articles]
        .sort(
          (a, b) =>
            new Date(b.publishedAt) - new Date(a.publishedAt)
        )
        .slice(0, 4),
    [articles]
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
  }, [articles]);

  const getCategoryCount = (item) => {
    if (item === ALL_CATEGORIES) {
      return articles.length;
    }

    return articles.filter(
      (article) => article.category === item
    ).length;
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const changePage = (nextPage) => {
    const normalizedPage = Math.min(
      Math.max(nextPage, 1),
      totalPages
    );
    const nextParams = new URLSearchParams(searchParams);

    if (normalizedPage === 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(normalizedPage));
    }

    setSearchParams(nextParams, { replace: true });
    requestAnimationFrame(() => {
      const results = resultsRef.current;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      results?.focus({ preventScroll: true });
      results?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    if (subscriptionState.status !== "idle") {
      setSubscriptionState({ status: "idle", message: "" });
    }
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || subscriptionState.status === "submitting") {
      return;
    }

    setSubscriptionState({ status: "submitting", message: "" });

    try {
      await subscribeToNewsletter(normalizedEmail);
      setEmail("");
      setSubscriptionState({
        status: "success",
        message: "Demo preference saved in this browser. No email was sent.",
      });
    } catch (error) {
      if (error?.status === 409 || error?.code === "ALREADY_SUBSCRIBED") {
        setEmail("");
        setSubscriptionState({
          status: "success",
          message: "This email fingerprint is already saved in this browser.",
        });
        return;
      }

      setSubscriptionState({
        status: "error",
        message:
          error?.message ||
          "We couldn’t complete the subscription. Please try again.",
      });
    }
  };

  return (
    <main className="articles-page">
      <Seo
        title="Engineering Insights | M-Agency"
        description="Practical articles on frontend, backend, cloud, databases, testing, and technical leadership."
        path="/blogs"
      />
      <section className="articles-hero">
        <div className="container">
          <div className="articles-hero__content">
            <span>M-Agency Insights</span>
            <h1>Insights</h1>
            <p>
              Practical engineering perspectives on frontend, backend, cloud,
              databases, testing, and technical leadership.
            </p>
          </div>
        </div>
      </section>

      <section className="articles-content">
        <div className="container">
          {isArticlesPending || isSavedViewPending ? (
            <ContentState
              status="loading"
              count={8}
              label={savedOnly ? "Loading saved insights" : "Loading insights"}
            />
          ) : isArticlesError || isSavedViewError ? (
            <ContentState
              status="error"
              title={
                isSavedViewError
                  ? "Saved insights are temporarily unavailable"
                  : "Insights are temporarily unavailable"
              }
              message={
                (isSavedViewError
                  ? bookmarksError?.message
                  : articlesError?.message) ||
                "The articles request could not be completed."
              }
              onRetry={() => {
                if (isArticlesError) refetchArticles();
                if (isSavedViewError) refetchBookmarks();
              }}
            />
          ) : articles.length === 0 ? (
            <ContentState
              status="empty"
              eyebrow="No published articles"
              title="Insights are being prepared"
              message="New engineering articles will appear here when they are published."
            />
          ) : (
            <>
          <p className="sr-only" aria-live="polite">
            {libraryAnnouncement}
          </p>

          {isBookmarksError && !savedOnly && (
            <div
              className="articles-library-status"
              id="saved-articles-status"
              role="alert"
            >
              <span>Saved articles are temporarily unavailable.</span>
              <button type="button" onClick={() => refetchBookmarks()}>
                Try again
              </button>
            </div>
          )}

          <div className="articles-toolbar articles-toolbar--library">
            <label className="articles-toolbar__search">
              <span className="sr-only">Search articles</span>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  updateFilters({ q: event.target.value });
                }}
                placeholder="Search by title, author, or topic"
              />
            </label>

            <select
              value={activeCategory}
              onChange={(event) => {
                updateFilters({
                  category:
                    event.target.value === ALL_CATEGORIES
                      ? null
                      : event.target.value,
                });
              }}
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
              onChange={(event) => {
                updateFilters({
                  sort:
                    event.target.value === "newest"
                      ? null
                      : event.target.value,
                });
              }}
              aria-label="Sort articles"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="popular">Most discussed</option>
              <option value="readingTime">Shortest read</option>
              <option value="title">Title A–Z</option>
            </select>

            <button
              className={
                "articles-toolbar__saved" + (savedOnly ? " is-active" : "")
              }
              type="button"
              aria-pressed={savedOnly}
              aria-describedby={
                isBookmarksError ? "saved-articles-status" : undefined
              }
              disabled={isBookmarksPending || isBookmarksError}
              onClick={() => {
                updateFilters({ saved: savedOnly ? null : "1" });
              }}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6.75 4.75c0-.97.78-1.75 1.75-1.75h7c.97 0 1.75.78 1.75 1.75v15.1L12 16.63l-5.25 3.22V4.75Z"
                  fill={savedOnly ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
              Saved {bookmarks.length}
            </button>
          </div>

          <div className="articles-layout">
            <div className="articles-main">
              <div
                className="articles-results"
                ref={resultsRef}
                tabIndex="-1"
              >
                <span>
                  Showing {firstVisibleIndex}–{lastVisibleIndex} of{" "}
                  {filteredArticles.length} articles
                </span>

                {(query ||
                  activeCategory !== ALL_CATEGORIES ||
                  sortBy !== "newest" ||
                  savedOnly) && (
                  <button type="button" onClick={resetFilters}>
                    Clear filters
                  </button>
                )}
              </div>

              {visibleArticles.length ? (
                <div className="articles-grid">
                  {visibleArticles.map((article) => (
                    <article className="articles-card" key={article.id}>
                      <BookmarkToggle
                        article={article}
                        onRemove={handleSavedBookmarkRemoval}
                      />
                      <Link
                        className="articles-card__image"
                        state={articleLinkState}
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
                          <Link
                            state={articleLinkState}
                            to={`/blog/${article.id}`}
                          >
                            {article.title}
                          </Link>
                        </h2>

                        <p>{article.excerpt}</p>

                        {progressByArticleId[String(article.id)]?.isStarted && (
                          <div className="articles-card__progress">
                            <ReadingProgress
                              articleTitle={article.title}
                              compact
                              progress={
                                progressByArticleId[String(article.id)].progress
                              }
                            />
                          </div>
                        )}

                        <div className="articles-card__footer">
                          <div>
                            <strong>{article.author}</strong>
                            <span>
                              {article.commentCount} comments
                            </span>
                          </div>

                          <Link
                            state={articleLinkState}
                            to={`/blog/${article.id}`}
                          >
                            Read article →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="articles-empty">
                  <h2>
                    {savedOnly
                      ? "No saved insights match"
                      : "No articles found"}
                  </h2>
                  <p>
                    {savedOnly
                      ? "Save an article or clear the current filters."
                      : "Change the search query or selected category."}
                  </p>
                  <button type="button" onClick={resetFilters}>
                    {savedOnly ? "Show all insights" : "Reset filters"}
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
                    disabled={currentPage === 1}
                    onClick={() => changePage(currentPage - 1)}
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
                      className={currentPage === item ? "active" : ""}
                      onClick={() => changePage(item)}
                      aria-current={currentPage === item ? "page" : undefined}
                    >
                      {item}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => changePage(currentPage + 1)}
                  >
                    Next →
                  </button>
                </nav>
              )}
            </div>

            <aside className="articles-sidebar">
              <div className="articles-sidebar__block articles-newsletter">
                <span>Browser-only demo</span>
                <h2>Try the newsletter flow.</h2>
                <p>
                  No email is sent. A one-way fingerprint is stored locally to
                  demonstrate validation and duplicate handling.
                </p>

                <form
                  onSubmit={handleSubscribe}
                  aria-busy={subscriptionState.status === "submitting"}
                >
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email for local demo"
                    autoComplete="email"
                    aria-label="Email address"
                    aria-describedby={
                      subscriptionState.message
                        ? "newsletter-status"
                        : undefined
                    }
                    aria-invalid={subscriptionState.status === "error"}
                    disabled={subscriptionState.status === "submitting"}
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscriptionState.status === "submitting"}
                  >
                    {subscriptionState.status === "submitting"
                      ? "Saving…"
                      : "Save preference"}
                  </button>
                </form>

                {subscriptionState.message && (
                  <small
                    id="newsletter-status"
                    className={
                      subscriptionState.status === "error"
                        ? "is-error"
                        : "is-success"
                    }
                    role={
                      subscriptionState.status === "error" ? "alert" : "status"
                    }
                    aria-live={
                      subscriptionState.status === "error"
                        ? "assertive"
                        : "polite"
                    }
                  >
                    {subscriptionState.message}
                  </small>
                )}
              </div>

              <div className="articles-sidebar__block">
                <h2>Categories</h2>

                <div className="articles-category-list">
                  {normalizedCategories.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={activeCategory === item ? "active" : ""}
                      onClick={() =>
                        updateFilters({
                          category:
                            item === ALL_CATEGORIES ? null : item,
                        })
                      }
                    >
                      <span>{item}</span>
                      <strong>{getCategoryCount(item)}</strong>
                    </button>
                  ))}
                </div>
              </div>

              {popularArticle && (
                <div className="articles-sidebar__block articles-popular">
                <span>Most discussed</span>

                <Link
                  state={articleLinkState}
                  to={`/blog/${popularArticle.id}`}
                >
                  <img
                    src={popularArticle.image}
                    alt={popularArticle.title}
                    loading="lazy"
                  />
                  <h2>{popularArticle.title}</h2>
                </Link>

                <p>{popularArticle.commentCount} comments</p>
                </div>
              )}

              {recentArticles.length > 0 && (
                <div className="articles-sidebar__block articles-recent">
                  <h2>Recent articles</h2>

                  <div className="articles-recent__list">
                    {recentArticles.map((article) => (
                      <Link
                        key={article.id}
                        state={articleLinkState}
                        to={`/blog/${article.id}`}
                      >
                        <span>{formatDate(article.publishedAt)}</span>
                        <strong>{article.title}</strong>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="articles-sidebar__block articles-tags">
                <h2>Popular tags</h2>

                <div className="articles-tags__list">
                  {popularTags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() =>
                        updateFilters({ q: tag, category: null })
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;
