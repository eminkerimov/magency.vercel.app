import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ContentState from "../components/ContentState";
import NotFound from "../components/NotFound";
import ReadingProgress from "../components/ReadingProgress";
import Seo from "../components/Seo";
import ArticleBody from "../features/articles/ArticleBody";
import { useArticleQuery } from "../features/articles/queries";
import BookmarkToggle from "../features/bookmarks/BookmarkToggle";
import ArticleDiscussion from "../features/comments/ArticleDiscussion";
import ArticleHelpfulness from "../features/helpfulness/ArticleHelpfulness";
import { useReadingProgress } from "../features/readingProgress";
import { getAuthorPortrait } from "../data/authors";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const EMPTY_SECTIONS = [];

const copyText = async (text, trigger) => {
  let clipboardError;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      clipboardError = error;
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto -9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const copied = document.execCommand?.("copy");

    if (!copied) {
      throw clipboardError || new Error("Copy command was rejected");
    }
  } finally {
    textarea.remove();
    trigger?.focus({ preventScroll: true });
  }
};

const InnerBlog = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const articleBodyRef = useRef(null);
  const progressBarRef = useRef(null);
  const tocRef = useRef(null);
  const tocToggleRef = useRef(null);
  const lastRecordedStepRef = useRef(0);
  const trackedArticleRef = useRef("");
  const copyResetTimerRef = useRef(null);
  const [copyState, setCopyState] = useState({
    articleId: "",
    status: "idle",
  });
  const [activeSectionId, setActiveSectionId] = useState("");
  const [isTocOpen, setIsTocOpen] = useState(false);
  const {
    data,
    error,
    isError,
    isPending,
    refetch,
  } = useArticleQuery(id);
  const article = data?.article;
  const {
    isComplete: isReadingComplete,
    progress: savedReadingProgress,
    markComplete,
    recordProgress,
  } = useReadingProgress(article?.id);
  const previousArticle = data?.previousArticle;
  const nextArticle = data?.nextArticle;
  const relatedArticles = data?.relatedArticles || [];
  const articleSections = article?.content?.sections || EMPTY_SECTIONS;
  const authorProfile = article?.authorProfile;
  const authorPortrait = getAuthorPortrait(article?.author);
  const insightsOrigin =
    typeof location.state?.from === "string" &&
    location.state.from.startsWith("/blogs")
      ? location.state.from
      : "";
  const articleNavigationState = insightsOrigin
    ? { from: insightsOrigin }
    : undefined;
  const copyStatus =
    copyState.articleId === article?.id ? copyState.status : "idle";

  useEffect(() => {
    window.clearTimeout(copyResetTimerRef.current);
    copyResetTimerRef.current = null;

    return () => {
      window.clearTimeout(copyResetTimerRef.current);
    };
  }, [article?.id]);

  useEffect(() => {
    const articleId = article?.id ? String(article.id) : "";

    if (trackedArticleRef.current !== articleId) {
      trackedArticleRef.current = articleId;
      lastRecordedStepRef.current = savedReadingProgress;
      return;
    }

    lastRecordedStepRef.current = Math.max(
      lastRecordedStepRef.current,
      savedReadingProgress
    );
  }, [article?.id, savedReadingProgress]);

  useEffect(() => {
    if (!article?.id || !articleBodyRef.current) return undefined;

    let animationFrame = 0;

    const updateProgress = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        const articleBody = articleBodyRef.current;

        if (!articleBody) return;

        const scrollTop =
          window.scrollY || document.documentElement.scrollTop;
        const articleTop =
          scrollTop + articleBody.getBoundingClientRect().top;
        const readingPosition =
          scrollTop + window.innerHeight * 0.35;
        const articleHeight = Math.max(articleBody.offsetHeight, 1);
        const rawProgress =
          ((readingPosition - articleTop) / articleHeight) * 100;
        const nextProgress = Math.min(
          Math.max(rawProgress, 0),
          100
        );
        const visualProgress = nextProgress >= 95 ? 100 : nextProgress;

        if (progressBarRef.current) {
          progressBarRef.current.style.width =
            visualProgress.toFixed(2) + "%";
        }

        const nextStep =
          nextProgress >= 95
            ? 100
            : nextProgress >= 5
              ? Math.floor(nextProgress / 5) * 5
              : 0;

        if (nextStep <= lastRecordedStepRef.current) return;

        lastRecordedStepRef.current = nextStep;

        if (nextStep === 100) {
          markComplete();
        } else {
          recordProgress(nextStep);
        }
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [article?.id, markComplete, recordProgress]);

  useEffect(() => {
    const sections = articleSections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    let animationFrame = 0;

    const updateActiveSection = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        const marker = Math.min(190, window.innerHeight * 0.28);
        const activeSection = sections.reduce((current, section) => {
          if (section.getBoundingClientRect().top <= marker) {
            return section;
          }

          return current;
        }, sections[0]);

        setActiveSectionId(activeSection.id);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [articleSections]);

  useEffect(() => {
    if (!isTocOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!tocRef.current?.contains(event.target)) {
        setIsTocOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setIsTocOpen(false);
      tocToggleRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTocOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setIsTocOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);

    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  if (isPending) {
    return (
      <main className="article-page">
        <Seo
          title="Engineering Insight | M-Agency"
          description="Loading an M-Agency engineering insight."
          path={`/blog/${id}`}
        />
        <section className="article-content">
          <div className="container">
            <ContentState
              status="loading"
              count={3}
              label="Loading article"
            />
          </div>
        </section>
      </main>
    );
  }

  if (isError && error?.status !== 404) {
    return (
      <main className="article-page">
        <Seo
          title="Engineering Insight | M-Agency"
          description="An M-Agency engineering insight."
          path={`/blog/${id}`}
        />
        <section className="article-content">
          <div className="container">
            <ContentState
              status="error"
              title="This article could not be loaded"
              message={error?.message}
              onRetry={refetch}
            />
          </div>
        </section>
      </main>
    );
  }

  if (!article) {
    return (
      <NotFound
        eyebrow="Insight not found"
        title="That article is no longer in the library."
        message="The address may be outdated. Browse the current Insights collection to continue reading."
      />
    );
  }

  const handleResumeReading = () => {
    const articleBody = articleBodyRef.current;

    if (!articleBody) return;

    const targetProgress = Math.min(savedReadingProgress, 92);
    const articleTop =
      window.scrollY + articleBody.getBoundingClientRect().top;
    const targetPosition =
      articleTop +
      articleBody.offsetHeight * (targetProgress / 100) -
      window.innerHeight * 0.35;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: Math.max(targetPosition, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    const sections = [...articleBody.querySelectorAll("section")];
    const targetOffset =
      articleBody.offsetHeight * (targetProgress / 100);
    const articleBodyTop =
      articleBody.getBoundingClientRect().top;
    const targetSection =
      sections
        .filter(
          (section) =>
            section.getBoundingClientRect().top - articleBodyTop <=
            targetOffset
        )
        .at(-1) || sections[0];
    const focusTarget =
      targetSection?.querySelector("h2, p") || articleBody;
    const moveFocus = () => {
      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
    };

    if (prefersReducedMotion) {
      window.requestAnimationFrame(moveFocus);
    } else {
      window.setTimeout(moveFocus, 450);
    }
  };

  const shareUrl = `${window.location.origin}${location.pathname}`;
  const copyButtonLabel =
    copyStatus === "copying"
      ? "Copying..."
      : copyStatus === "success"
        ? "Copied"
        : copyStatus === "error"
          ? "Try again"
          : "Copy link";
  const copyStatusMessage =
    copyStatus === "success"
      ? "Link copied to clipboard."
      : copyStatus === "error"
        ? "Could not copy the link. Try again or use the address bar."
        : "";
  const activeSection =
    articleSections.find((section) => section.id === activeSectionId) ||
    articleSections[0];

  const handleTocNavigation = (event, sectionId) => {
    event.preventDefault();
    setIsTocOpen(false);
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: `#${sectionId}`,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          preserveScroll: false,
          scrollRequest: event.timeStamp,
        },
      }
    );
  };

  const handleCopyLink = async (event) => {
    if (copyStatus === "copying") return;

    const trigger = event.currentTarget;
    window.clearTimeout(copyResetTimerRef.current);
    setCopyState({ articleId: article.id, status: "copying" });

    try {
      await copyText(shareUrl, trigger);
      setCopyState({ articleId: article.id, status: "success" });
      copyResetTimerRef.current = window.setTimeout(
        () => setCopyState({ articleId: article.id, status: "idle" }),
        2600
      );
    } catch {
      setCopyState({ articleId: article.id, status: "error" });
      copyResetTimerRef.current = window.setTimeout(
        () => setCopyState({ articleId: article.id, status: "idle" }),
        5000
      );
    }
  };

  return (
    <main className="article-page">
      <Seo
        title={`${article.title} | M-Agency`}
        description={article.excerpt}
        path={`/blog/${article.id}`}
        image={article.image}
        type="article"
      />
      <div
        className="article-progress"
        ref={progressBarRef}
        style={{ width: "0%" }}
        aria-hidden="true"
      />

      <section className="article-hero">
        <div className="container">
          <Link
            className="article-hero__back"
            to={insightsOrigin || "/blogs"}
          >
            ← Back to insights
          </Link>

          <div className="article-hero__content">
            <span className="article-hero__category">
              {article.category}
            </span>

            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>

            <div className="article-hero__meta">
              <div>
                <strong>{article.author}</strong>
                <span>{authorProfile?.role || "Engineering author"}</span>
              </div>

              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>

              <span>{article.readingTime} min read</span>
              <span>{article.commentCount} comments</span>
            </div>

            <div className="article-hero__library">
              <BookmarkToggle article={article} variant="hero" />

              {savedReadingProgress > 0 &&
                (isReadingComplete ? (
                  <div className="article-hero__resume">
                    <ReadingProgress
                      articleTitle={article.title}
                      compact
                      progress={savedReadingProgress}
                    />
                  </div>
                ) : (
                  <div className="article-hero__resume">
                    <button
                      className="article-hero__resume-action"
                      type="button"
                      aria-label={
                        "Resume " +
                        article.title +
                        " from " +
                        savedReadingProgress +
                        " percent"
                      }
                      onClick={handleResumeReading}
                    >
                      Resume reading
                    </button>
                    <ReadingProgress
                      articleTitle={article.title}
                      compact
                      progress={savedReadingProgress}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="article-cover">
        <div className="container">
          <img src={article.image} alt={article.title} />
        </div>
      </section>

      <section className="article-content">
        <div className="container article-content__layout">
          <aside
            className={`article-toc${isTocOpen ? " is-open" : ""}`}
            ref={tocRef}
          >
            <button
              aria-controls="article-section-navigation"
              aria-expanded={isTocOpen}
              aria-label={isTocOpen ? "Close article navigation" : "Open article navigation"}
              className="article-toc__toggle"
              onClick={() => setIsTocOpen((open) => !open)}
              ref={tocToggleRef}
              type="button"
            >
              <span>
                <small>On this page</small>
                <strong>{activeSection?.label || activeSection?.title}</strong>
              </span>
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                <path d="m7 9.5 5 5 5-5" />
              </svg>
            </button>
            <span className="article-toc__label">On this page</span>
            <nav id="article-section-navigation" aria-label="Article sections">
              {articleSections.map((section) => (
                <Link
                  aria-current={activeSectionId === section.id ? "location" : undefined}
                  key={section.id}
                  onClick={(event) => handleTocNavigation(event, section.id)}
                  to={{
                    pathname: location.pathname,
                    search: location.search,
                    hash: `#${section.id}`,
                  }}
                >
                  {section.label || section.title}
                </Link>
              ))}
            </nav>
          </aside>

          <ArticleBody ref={articleBodyRef} sections={articleSections} />

          <aside
            className="article-share"
            aria-labelledby="article-share-title"
          >
            <h2 id="article-share-title">Share</h2>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-disabled={copyStatus === "copying"}
              aria-busy={copyStatus === "copying"}
            >
              {copyButtonLabel}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                article.title
              )}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareUrl
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <p
              className="article-share__status"
              data-state={copyStatus}
              role="status"
              aria-live="polite"
            >
              {copyStatusMessage}
            </p>
          </aside>
        </div>

        <div className="container article-content__end">
          <div className="article-content__end-inner">
            <ArticleHelpfulness
              key={`helpfulness-${article.id}`}
              articleId={article.id}
            />

            <div className="article-tags">
              {article.tags?.map((tag) => (
                <Link key={tag} to={`/blogs?q=${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              ))}
            </div>

            <div className="article-author">
              <div className="article-author__avatar">
                {authorPortrait ? (
                  <img src={authorPortrait} alt="" loading="lazy" />
                ) : (
                  <span aria-hidden="true">
                    {article.author
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                )}
              </div>

              <div>
                <span>{authorProfile?.role || "Engineering author"}</span>
                <h2>{article.author}</h2>
                <p>
                  {authorProfile?.bio ||
                    "Shares practical perspectives on building and maintaining modern software."}
                </p>
              </div>
            </div>

            <ArticleDiscussion key={`discussion-${article.id}`} article={article} />
          </div>
        </div>
      </section>

      <section className="article-navigation">
        <div className="container">
          {previousArticle ? (
            <Link
              state={articleNavigationState}
              to={`/blog/${previousArticle.id}`}
            >
              <span>Previous article</span>
              <strong>{previousArticle.title}</strong>
            </Link>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <Link
              state={articleNavigationState}
              to={`/blog/${nextArticle.id}`}
            >
              <span>Next article</span>
              <strong>{nextArticle.title}</strong>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="article-related">
          <div className="container">
            <div className="article-related__heading">
              <span>Continue reading</span>
              <h2>Related insights</h2>
            </div>

            <div className="article-related__grid">
              {relatedArticles.map((item) => (
                <article key={item.id}>
                  <Link
                    state={articleNavigationState}
                    to={`/blog/${item.id}`}
                  >
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </Link>

                  <div>
                    <span>{item.category}</span>
                    <h3>
                      <Link
                        state={articleNavigationState}
                        to={`/blog/${item.id}`}
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p>{item.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default InnerBlog;
